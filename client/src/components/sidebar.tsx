import { useState } from "react";
import { JournalEntry } from "@shared/schema";
import { format, isToday, isYesterday } from "date-fns";

interface SidebarProps {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  isOpen: boolean;
  onToggle: () => void;
  isLoading: boolean;
}

export function Sidebar({
  entries,
  selectedEntryId,
  searchQuery,
  onSearchChange,
  onSelectEntry,
  onNewEntry,
  isOpen,
  onToggle,
  isLoading
}: SidebarProps) {
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.createdAt);
    let key = 'older';
    
    if (isToday(date)) {
      key = 'today';
    } else if (isYesterday(date)) {
      key = 'yesterday';
    }
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
    return groups;
  }, {} as Record<string, JournalEntry[]>);

  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getPreview = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;
  };

  return (
    <div 
      className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-0 overflow-hidden'
      }`}
      data-testid="sidebar"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Journal</h1>
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            data-testid="button-sidebar-toggle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>
        </div>
        
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Search entries..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading entries...</div>
        ) : entries.length === 0 && !searchQuery ? (
          <div className="p-4 text-center text-gray-500">No entries yet. Create your first entry!</div>
        ) : entries.length === 0 && searchQuery ? (
          <div className="p-4 text-center text-gray-500">No entries found for "{searchQuery}"</div>
        ) : (
          <div className="p-4">
            {Object.entries(groupedEntries).map(([group, groupEntries]) => (
              <div key={group}>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  {group === 'today' ? 'Today' : group === 'yesterday' ? 'Yesterday' : 'Older'}
                </div>
                
                {groupEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    className={`mb-4 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedEntryId === entry.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:shadow-sm'
                    }`}
                    data-testid={`card-entry-${entry.id}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {entry.title || 'Untitled'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {format(new Date(entry.createdAt), 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {getPreview(entry.content)}
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span>{getWordCount(entry.content)} words</span>
                      <span className="mx-2">•</span>
                      <span>{Math.max(1, Math.ceil(getWordCount(entry.content) / 200))} min read</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onNewEntry}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          data-testid="button-new-entry"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          New Entry
        </button>
      </div>
    </div>
  );
}
