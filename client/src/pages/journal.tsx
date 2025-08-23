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
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      wordCount: entry.wordCount,
    });
  };

  // Auto-save functionality - save to server after typing stops
  useEffect(() => {
    const autoSave = setTimeout(() => {
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
    }, 2000); // Auto-save after 2 seconds of no changes

    return () => clearTimeout(autoSave);
  }, [currentEntry, selectedEntryId, createEntryMutation, updateEntryMutation]);

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
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="button-export"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
              
              {(createEntryMutation.isPending || updateEntryMutation.isPending) && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
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
