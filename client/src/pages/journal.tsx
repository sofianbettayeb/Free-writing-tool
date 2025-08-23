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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      setCurrentEntry({ title: "", content: "", wordCount: "0" });
      toast({ title: "Entry saved successfully" });
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
      toast({ title: "Entry updated successfully" });
    },
    onError: () => {
      toast({ 
        title: "Failed to update entry", 
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
    setSelectedEntryId(null);
    setCurrentEntry({ title: "", content: "", wordCount: "0" });
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntryId(entry.id);
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      wordCount: entry.wordCount,
    });
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (currentEntry.content && currentEntry.content.trim().length > 0) {
        // Auto-save to localStorage only
        // Don't save empty entries to the server
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [currentEntry]);

  const displayedEntries = searchQuery ? searchResults : entries;

  return (
    <div className="flex h-screen bg-white" data-testid="journal-app">
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

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <Timer />
            </div>

            <div className="flex items-center space-x-2">
              {!sidebarOpen && (
                <button
                  onClick={handleNewEntry}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  data-testid="button-new-entry-header"
                  title="New entry"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  New
                </button>
              )}
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="button-export"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>

              <button
                onClick={handleSaveEntry}
                disabled={createEntryMutation.isPending || updateEntryMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                data-testid="button-save"
              >
                {createEntryMutation.isPending || updateEntryMutation.isPending ? 'Saving...' : 'Save'}
              </button>
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
