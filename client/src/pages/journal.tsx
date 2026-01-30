import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { JournalEntry, InsertJournalEntry } from "@shared/schema";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { ExportModal } from "@/components/export-modal";
import { Timer } from "@/components/timer";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Journal() {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const { toast } = useToast();

  // Keyboard shortcut for opening shortcuts popup (Cmd/Ctrl + /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const KEYBOARD_SHORTCUTS = [
    { keys: ['Mod', 'B'], action: 'Bold' },
    { keys: ['Mod', 'I'], action: 'Italic' },
    { keys: ['Mod', 'U'], action: 'Underline' },
    { keys: ['Mod', 'Shift', 'S'], action: 'Strikethrough' },
    { keys: ['Mod', 'E'], action: 'Code' },
    { keys: ['Mod', 'Shift', '8'], action: 'Bullet List' },
    { keys: ['Mod', 'Shift', '7'], action: 'Numbered List' },
    { keys: ['Mod', 'Z'], action: 'Undo' },
    { keys: ['Mod', 'Shift', 'Z'], action: 'Redo' },
    { keys: ['Mod', '/'], action: 'Show Shortcuts' },
  ];

  // Fetch all entries
  const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/entries"],
  });

  // Search entries - use query parameter to handle special characters like "/"
  const { data: searchResults = [] } = useQuery<JournalEntry[]>({
    queryKey: ["/api/entries/search", searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/entries/search?q=${encodeURIComponent(searchQuery)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      return res.json();
    },
    enabled: searchQuery.length > 0,
  });

  // Create entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (entryData: InsertJournalEntry) => {
      const response = await apiRequest("POST", "/api/entries", entryData);
      return response.json();
    },
    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      setSelectedEntryId(newEntry.id);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ 
        title: "Failed to save entry", 
        variant: "destructive" 
      });
    },
  });

  // Update entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertJournalEntry> }) => {
      const response = await apiRequest("PATCH", `/api/entries/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ 
        title: "Failed to update entry", 
        variant: "destructive" 
      });
    },
  });

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      setSelectedEntryId(null);
      setShowDeleteConfirm(false);
      toast({ title: "Entry deleted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ 
        title: "Failed to delete entry", 
        variant: "destructive" 
      });
    },
  });

  const handleNewEntry = () => {
    createEntryMutation.mutate({
      title: "Untitled",
      content: "",
      wordCount: "0",
    });
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntryId(entry.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteEntry = () => {
    if (selectedEntryId) {
      deleteEntryMutation.mutate(selectedEntryId);
    }
  };

  const handleUpdateEntry = (entryData: Partial<InsertJournalEntry>) => {
    if (selectedEntryId) {
      updateEntryMutation.mutate({ id: selectedEntryId, data: entryData });
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery(''); // Clear search when filtering by tag
  };

  const clearTagFilter = () => {
    setSelectedTag(null);
  };

  // Get the selected entry from the fetched data
  const selectedEntry = entries.find(entry => entry.id === selectedEntryId);

  // Determine which entries to display based on search and tag filtering
  let displayedEntries = searchQuery ? searchResults : entries;
  
  // Apply tag filtering
  if (selectedTag) {
    displayedEntries = displayedEntries.filter(entry => 
      entry.tags && entry.tags.includes(selectedTag)
    );
  }

  // Export handlers
  const exportAsJson = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'journal-entries.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({ title: "Exported as JSON" });
  };

  const exportAsText = () => {
    const textContent = entries
      .map(entry => `${entry.title}\n\n${entry.content.replace(/<[^>]*>/g, '')}\n\n---\n`)
      .join('\n');
    
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent);
    const exportFileDefaultName = 'journal-entries.txt';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({ title: "Exported as text" });
  };

  const exportAsMarkdown = () => {
    const markdownContent = entries
      .map(entry => `# ${entry.title}\n\n${entry.content.replace(/<[^>]*>/g, '')}\n\n---\n`)
      .join('\n');
    
    const dataUri = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdownContent);
    const exportFileDefaultName = 'journal-entries.md';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({ title: "Exported as Markdown" });
  };

  const exportAsHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Journal Entries</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          .entry { margin-bottom: 40px; }
          hr { border: none; border-top: 1px solid #eee; margin: 30px 0; }
        </style>
      </head>
      <body>
        ${entries.map(entry => `
          <div class="entry">
            <h1>${entry.title}</h1>
            ${entry.content}
            <hr>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    
    const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    const exportFileDefaultName = 'journal-entries.html';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({ title: "Exported as HTML" });
  };

  return (
    <AuthenticatedLayout>
      <div className="h-full bg-stone-50 flex flex-col">

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-white border-b border-stone-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1"
                data-testid="button-open-sidebar-menu"
                title="Open sidebar"
                aria-label="Open sidebar"
                aria-expanded={sidebarOpen}
              >
                <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <span data-testid="text-entry-count" className="text-sm text-stone-600">{displayedEntries.length} {displayedEntries.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          {selectedTag && (
            <div className="flex items-center space-x-2 bg-stone-100 px-3 py-1 rounded border border-stone-200">
              <span className="text-sm text-stone-700">{selectedTag}</span>
              <button
                onClick={clearTagFilter}
                className="text-stone-500 hover:text-stone-700 font-medium text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 rounded"
                data-testid="button-clear-tag-filter"
                aria-label={`Clear filter: ${selectedTag}`}
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
            <Timer />
            
            <div className="flex items-center space-x-2">
              {/* Delete Entry Button */}
              {selectedEntry && !showDeleteConfirm && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="group flex items-center px-3 py-2 text-sm text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
                  data-testid="button-delete"
                  aria-label="Delete entry"
                  title="Delete entry"
                >
                  <svg className="w-4 h-4 text-stone-600 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              )}
              
              {/* Confirm Delete */}
              {showDeleteConfirm && (
                <div className="flex items-center space-x-2" role="alertdialog" aria-labelledby="delete-confirm-label">
                  <span id="delete-confirm-label" className="text-sm text-stone-600">Delete entry?</span>
                  <button
                    onClick={handleDeleteEntry}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
                    data-testid="button-confirm-delete"
                    aria-label="Confirm delete"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-1"
                    data-testid="button-cancel-delete"
                    aria-label="Cancel delete"
                  >
                    No
                  </button>
                </div>
              )}
              
              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="group flex items-center px-3 py-2 text-sm text-stone-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1"
                data-testid="button-export"
                aria-label="Export entries"
                title="Export entries"
              >
                <svg className="w-5 h-5 text-stone-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
              
            </div>
        </div>
      </div>

      {/* Workspace Row (Middle) */}
      <div className="flex min-h-0 overflow-hidden">
        <Sidebar
          entries={displayedEntries}
          selectedEntryId={selectedEntryId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectEntry={handleSelectEntry}
          onNewEntry={handleNewEntry}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isLoading={isLoading}
          onTagClick={handleTagClick}
        />


        <div className="flex flex-col min-h-0 flex-1">
          {selectedEntry ? (
            <Editor
              entry={selectedEntry}
              onUpdate={handleUpdateEntry}
              sidebarOpen={sidebarOpen}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-500">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No entry selected</h3>
                <p>Create a new entry or select an existing one to start writing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Row - Simplified */}
      <div className="border-t border-stone-200 px-4 md:px-6 py-2 bg-white flex items-center justify-between text-sm text-stone-500">
        <span data-testid="text-character-count">{selectedEntry?.content ? selectedEntry.content.replace(/<[^>]*>/g, '').length : 0} chars</span>
        <button
          onClick={() => setShowShortcuts(true)}
          className="text-xs hover:text-stone-700 transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-1 rounded px-1"
          data-testid="button-show-shortcuts"
          aria-label="Show keyboard shortcuts"
        >
          <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-mono">{navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+/</kbd>
          <span>shortcuts</span>
        </button>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        entries={entries}
        selectedEntryId={selectedEntryId}
      />

      {/* Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-700">{shortcut.action}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex}>
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-stone-600">
                        {key === 'Mod' ? (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl') : key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="text-gray-400 mx-0.5">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 text-center pt-2 border-t">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Esc</kbd> to close
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}