import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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

  const { toast } = useToast();

  // Fetch all entries
  const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/entries"],
  });

  // Search entries
  const { data: searchResults = [] } = useQuery<JournalEntry[]>({
    queryKey: ["/api/entries/search", searchQuery],
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
      <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col">
      
      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-white/60 backdrop-blur-sm border-b border-gray-200/60">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                data-testid="button-open-sidebar-menu"
                title="Open sidebar"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <span data-testid="text-entry-count" className="text-sm text-gray-600">{displayedEntries.length} {displayedEntries.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          {selectedTag && (
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <span className="text-sm text-blue-800">Filtered by: {selectedTag}</span>
              <button
                onClick={clearTagFilter}
                className="text-blue-600 hover:text-blue-800 font-medium text-lg leading-none"
                data-testid="button-clear-tag-filter"
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
                  className="group flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  data-testid="button-delete"
                >
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              )}
              
              {/* Confirm Delete */}
              {showDeleteConfirm && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Delete entry?</span>
                  <button 
                    onClick={handleDeleteEntry}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    data-testid="button-confirm-delete"
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    data-testid="button-cancel-delete"
                  >
                    No
                  </button>
                </div>
              )}
              
              {/* Export Button */}
              <button 
                onClick={() => setShowExportModal(true)}
                className="group flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                data-testid="button-export"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No entry selected</h3>
                <p>Create a new entry or select an existing one to start writing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Row */}
      <div className="border-t border-gray-200/60 px-4 md:px-6 py-2 bg-gray-50/20 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Auto-save enabled</span>
          </div>
          <span data-testid="text-character-count" className="text-gray-600">{selectedEntry?.content ? selectedEntry.content.replace(/<[^>]*>/g, '').length : 0} characters</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-400">
          <span>Changes save automatically</span>
        </div>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        entries={entries}
        selectedEntryId={selectedEntryId}
      />
      </div>
    </AuthenticatedLayout>
  );
}