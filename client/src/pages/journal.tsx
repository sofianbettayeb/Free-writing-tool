import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { JournalEntry, InsertJournalEntry } from "@shared/schema";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { ExportModal } from "@/components/export-modal";
import { Timer } from "@/components/timer";
import { useLocalStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Journal() {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentEntry, setCurrentEntry] = useLocalStorage<Partial<JournalEntry>>("currentEntry", {
    title: "",
    content: "",
    wordCount: "0"
  });

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
      setSelectedEntryId(newEntry.id); // Set the ID so future saves will update instead of create
      setHasAutoSaved(true);
    },
    onError: () => {
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
    onError: () => {
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
      setHasAutoSaved(false);
      setCurrentEntry({ title: "", content: "", wordCount: "0" });
      setShowDeleteConfirm(false);
      toast({ title: "Entry deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: "Failed to delete entry", 
        variant: "destructive" 
      });
    },
  });

  const handleSaveEntry = () => {
    if (!currentEntry.title?.trim() || !currentEntry.content?.trim()) {
      toast({ 
        title: "Please enter a title and content", 
        variant: "destructive" 
      });
      return;
    }

    const entryData: InsertJournalEntry = {
      title: currentEntry.title,
      content: currentEntry.content,
      wordCount: currentEntry.wordCount || "0",
    };

    if (selectedEntryId) {
      updateEntryMutation.mutate({ id: selectedEntryId, data: entryData });
    } else {
      createEntryMutation.mutate(entryData);
    }
  };

  const handleNewEntry = () => {
    // Auto-save current entry if it has content
    if (currentEntry.title?.trim() || currentEntry.content?.trim()) {
      const entryData: InsertJournalEntry = {
        title: currentEntry.title || "Untitled",
        content: currentEntry.content || "",
        wordCount: currentEntry.wordCount || "0",
      };

      if (selectedEntryId) {
        updateEntryMutation.mutate({ id: selectedEntryId, data: entryData });
      } else {
        createEntryMutation.mutate(entryData);
      }
    }
    
    // Reset to new entry
    setSelectedEntryId(null);
    setHasAutoSaved(false);
    setShowDeleteConfirm(false); // Reset delete confirmation when creating new entry
    setCurrentEntry({ title: "", content: "", wordCount: "0" });
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    // Auto-save current entry before switching
    if (currentEntry.title?.trim() || currentEntry.content?.trim()) {
      const entryData: InsertJournalEntry = {
        title: currentEntry.title || "Untitled",
        content: currentEntry.content || "",
        wordCount: currentEntry.wordCount || "0",
      };

      if (selectedEntryId) {
        updateEntryMutation.mutate({ id: selectedEntryId, data: entryData });
      } else {
        createEntryMutation.mutate(entryData);
      }
    }

    // Switch to selected entry
    setSelectedEntryId(entry.id);
    setHasAutoSaved(true);
    setShowDeleteConfirm(false); // Reset delete confirmation when switching entries
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      wordCount: entry.wordCount,
    });
  };

  // Auto-save functionality - save to server after typing stops
  useEffect(() => {
    // Don't auto-save if mutations are pending to avoid duplicates
    if (createEntryMutation.isPending || updateEntryMutation.isPending) {
      return;
    }

    // Don't auto-save empty content
    if (!currentEntry.title?.trim() && !currentEntry.content?.trim()) {
      return;
    }

    const autoSave = setTimeout(() => {
      const entryData: InsertJournalEntry = {
        title: currentEntry.title || "Untitled",
        content: currentEntry.content || "",
        wordCount: currentEntry.wordCount || "0",
      };

      if (selectedEntryId) {
        // Update existing entry
        updateEntryMutation.mutate({ id: selectedEntryId, data: entryData });
      } else if (!hasAutoSaved) {
        // Only create new entry if we haven't auto-saved yet
        createEntryMutation.mutate(entryData);
      }
    }, 2000); // Auto-save after 2 seconds of no changes

    return () => clearTimeout(autoSave);
  }, [currentEntry, selectedEntryId, hasAutoSaved]); // Added hasAutoSaved to dependencies

  const handleDeleteEntry = () => {
    if (selectedEntryId) {
      deleteEntryMutation.mutate(selectedEntryId);
    }
  };

  const displayedEntries = searchQuery ? searchResults : entries;

  return (
    <div className="flex h-screen bg-gray-50/30" data-testid="journal-app">
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
      />

      <div className="flex-1 flex flex-col bg-white shadow-xl overflow-hidden">
        <div className="border-b border-gray-200/60 px-4 md:px-8 py-5 bg-white/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="button-sidebar-open"
                  title="Open sidebar"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              )}
              <div className="flex items-center space-x-3 text-sm text-gray-700 bg-gray-100/50 px-4 py-2 rounded-lg">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="font-medium">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <Timer />
            </div>

            <div className="flex items-center space-x-3">
              {selectedEntryId && (
                <div className="flex items-center space-x-2">
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      data-testid="button-delete-entry"
                      title="Delete entry"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={handleDeleteEntry}
                        disabled={deleteEntryMutation.isPending}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600 disabled:opacity-50"
                        data-testid="button-confirm-delete"
                        title="Confirm delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                        data-testid="button-cancel-delete"
                        title="Cancel delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2.5 hover:bg-blue-50 rounded-lg transition-colors group"
                data-testid="button-export"
                title="Export entry"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
              
              {(createEntryMutation.isPending || updateEntryMutation.isPending || deleteEntryMutation.isPending) && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {deleteEntryMutation.isPending ? "Deleting..." : "Saving..."}
                </div>
              )}
            </div>
          </div>
        </div>

        <Editor
          entry={currentEntry}
          onUpdate={setCurrentEntry}
        />
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        entries={entries}
        selectedEntryId={selectedEntryId}
      />
    </div>
  );
}
