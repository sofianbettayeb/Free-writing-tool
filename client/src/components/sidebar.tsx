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
  onTagClick?: (tag: string) => void;
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
  isLoading,
  onTagClick
}: SidebarProps) {
  // Ensure entries is always an array
  const safeEntries = Array.isArray(entries) ? entries : [];
  
  const groupedEntries = safeEntries.reduce((groups, entry) => {
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
      className={`bg-white border-r border-stone-200 flex flex-col min-h-0 transition-all duration-200 ${
        isOpen ? 'w-72 overflow-y-auto' : 'w-0 overflow-hidden'
      }`}
      data-testid="sidebar"
    >
      <div className="p-4 border-b border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-medium text-stone-900">Entries</h1>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            data-testid="button-sidebar-toggle"
            aria-label="Close sidebar"
            aria-expanded={isOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>
        </div>
        
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-stone-200 rounded text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
            data-testid="input-search"
            aria-label="Search entries"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-stone-400 text-sm">Loading...</div>
        ) : entries.length === 0 && !searchQuery ? (
          <div className="p-4 text-center text-stone-400 text-sm">No entries yet</div>
        ) : entries.length === 0 && searchQuery ? (
          <div className="p-4 text-center text-stone-400 text-sm">No results</div>
        ) : (
          <div className="p-3">
            {Object.entries(groupedEntries).map(([group, groupEntries]) => (
              <div key={group}>
                <div className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2 px-1">
                  {group === 'today' ? 'Today' : group === 'yesterday' ? 'Yesterday' : 'Earlier'}
                </div>
                
                {groupEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectEntry(entry);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-selected={selectedEntryId === entry.id}
                    aria-label={`Entry: ${entry.title || 'Untitled'}`}
                    className={`mb-2 p-2.5 rounded cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 ${
                      selectedEntryId === entry.id
                        ? 'bg-stone-100'
                        : 'hover:bg-stone-50'
                    }`}
                    data-testid={`card-entry-${entry.id}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-stone-900 truncate" title={entry.title || 'Untitled'}>
                        {entry.title || 'Untitled'}
                      </span>
                      <span className="text-xs text-stone-400 ml-2 flex-shrink-0">
                        {format(new Date(entry.createdAt), 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {getPreview(entry.content)}
                    </p>

                    {/* Tags - simplified */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.slice(0, 2).map((tag, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTagClick?.(tag);
                            }}
                            className="px-1.5 py-0.5 text-xs bg-stone-100 text-stone-600 rounded hover:bg-stone-200 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-500"
                            data-testid={`sidebar-tag-${tag}`}
                            aria-label={`Filter by tag: ${tag}`}
                          >
                            {tag}
                          </button>
                        ))}
                        {entry.tags.length > 2 && (
                          <span className="text-xs text-stone-400 px-1">
                            +{entry.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-stone-100">
        <button
          onClick={onNewEntry}
          className="w-full flex items-center justify-center py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2"
          data-testid="button-new-entry"
          aria-label="Create new entry"
        >
          New entry
        </button>
      </div>
    </div>
  );
}
