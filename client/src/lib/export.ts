import { JournalEntry } from '@shared/schema';
import { format } from 'date-fns';

export async function exportEntries(
  entries: JournalEntry[],
  exportFormat: 'markdown' | 'json' | 'txt' | 'html'
) {
  const response = await fetch('/api/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format: exportFormat,
      entryIds: entries.map(e => e.id),
    }),
  });

  if (!response.ok) {
    throw new Error('Export failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const timestamp = format(new Date(), 'yyyy-MM-dd');
  const extensions = {
    markdown: 'md',
    json: 'json',
    txt: 'txt',
    html: 'html',
  };
  
  link.download = `journal-export-${timestamp}.${extensions[exportFormat]}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function exportToChatGPT(entries: JournalEntry[]) {
  const chatGPTFormat = entries.map(entry => {
    const date = format(new Date(entry.createdAt), 'MMMM d, yyyy \'at\' h:mm a');
    const plainTextContent = entry.content.replace(/<[^>]*>/g, '');
    
    return `**${entry.title}**\n*${date}*\n\n${plainTextContent}`;
  }).join('\n\n---\n\n');

  const fullText = `Here are my journal entries for analysis:\n\n${chatGPTFormat}\n\nPlease analyze these entries and provide insights about patterns, themes, or suggestions for reflection.`;

  // Copy to clipboard
  navigator.clipboard.writeText(fullText).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = fullText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  });
}

export function downloadAsFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
