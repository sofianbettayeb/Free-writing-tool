import { JournalEntry } from '@shared/schema';
import { format } from 'date-fns';

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function embedImagesAsBase64(html: string): Promise<string> {
  const imgRegex = /<img\s+[^>]*src=["']([^"']*\/images\/[^"']*)["'][^>]*>/gi;
  const matches = Array.from(html.matchAll(imgRegex));

  if (matches.length === 0) return html;

  const cache = new Map<string, string | null>();
  await Promise.all(
    matches.map(async (match) => {
      const src = match[1];
      if (!cache.has(src)) {
        let fetchUrl = src;
        if (src.startsWith('/')) {
          fetchUrl = window.location.origin + src;
        }
        cache.set(src, await fetchImageAsBase64(fetchUrl));
      }
    })
  );

  let result = html;
  cache.forEach((base64, src) => {
    if (base64) {
      result = result.split(src).join(base64);
    }
  });
  return result;
}

function htmlToMarkdownWithImages(html: string): string {
  let md = html;
  md = md.replace(/<img\s+[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img\s+[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![$1]($2)');
  md = md.replace(/<img\s+[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![image]($1)');
  md = md.replace(/<[^>]*>/g, '');
  return md.trim();
}

export async function exportEntries(
  entries: JournalEntry[],
  exportFormat: 'markdown' | 'json' | 'txt' | 'html',
  embedImages: boolean = false
) {
  if (embedImages && (exportFormat === 'markdown' || exportFormat === 'html')) {
    const processedEntries = await Promise.all(
      entries.map(async (entry) => ({
        ...entry,
        content: await embedImagesAsBase64(entry.content),
      }))
    );

    let content: string;
    let mimeType: string;
    let ext: string;

    if (exportFormat === 'html') {
      content = processedEntries
        .map((entry) => {
          const date = format(new Date(entry.createdAt), 'MMMM d, yyyy');
          return `<article><h1>${entry.title}</h1><p><em>${date}</em></p>${entry.content}</article><hr>`;
        })
        .join('\n');
      content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Journal Export</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:2rem}img{max-width:100%;height:auto}</style></head><body>${content}</body></html>`;
      mimeType = 'text/html';
      ext = 'html';
    } else {
      content = processedEntries
        .map((entry) => {
          const date = format(new Date(entry.createdAt), 'MMMM d, yyyy');
          const md = htmlToMarkdownWithImages(entry.content);
          return `# ${entry.title}\n\n*${date}*\n\n${md}\n\n---\n\n`;
        })
        .join('');
      mimeType = 'text/markdown';
      ext = 'md';
    }

    const timestamp = format(new Date(), 'yyyy-MM-dd');
    downloadAsFile(content, `journal-export-${timestamp}.${ext}`, mimeType);
    return;
  }

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

export async function exportForLLM(entries: JournalEntry[]) {
  const processedEntries = await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      content: await embedImagesAsBase64(entry.content),
    }))
  );

  const llmFormat = processedEntries
    .map((entry) => {
      const date = format(new Date(entry.createdAt), "MMMM d, yyyy 'at' h:mm a");
      const md = htmlToMarkdownWithImages(entry.content);
      return `**${entry.title}**\n*${date}*\n\n${md}`;
    })
    .join('\n\n---\n\n');

  const fullText = `Here are my journal entries for analysis:\n\n${llmFormat}\n\nPlease analyze these entries and provide insights about patterns, themes, or suggestions for reflection.`;

  await navigator.clipboard.writeText(fullText).catch(() => {
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
