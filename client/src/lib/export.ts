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

function buildHtmlExport(entries: JournalEntry[]): string {
  const body = entries
    .map((entry) => {
      const date = format(new Date(entry.createdAt), 'MMMM d, yyyy');
      return `<article><h1>${entry.title}</h1><p><em>${date}</em></p>${entry.content}</article><hr>`;
    })
    .join('\n');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Journal Export</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:2rem}img{max-width:100%;height:auto}</style></head><body>${body}</body></html>`;
}

export async function exportEntries(
  entries: JournalEntry[],
  exportFormat: 'markdown' | 'json' | 'txt' | 'html',
  embedImages: boolean = false
) {
  const timestamp = format(new Date(), 'yyyy-MM-dd');

  if (exportFormat === 'html') {
    const processedEntries = embedImages
      ? await Promise.all(entries.map(async (e) => ({ ...e, content: await embedImagesAsBase64(e.content) })))
      : entries;
    const content = buildHtmlExport(processedEntries);
    downloadAsFile(content, `journal-export-${timestamp}.html`, 'text/html');
    return;
  }

  if (embedImages && exportFormat === 'markdown') {
    const processedEntries = await Promise.all(
      entries.map(async (entry) => ({
        ...entry,
        content: await embedImagesAsBase64(entry.content),
      }))
    );
    const content = processedEntries
      .map((entry) => {
        const date = format(new Date(entry.createdAt), 'MMMM d, yyyy');
        const md = htmlToMarkdownWithImages(entry.content);
        return `# ${entry.title}\n\n*${date}*\n\n${md}\n\n---\n\n`;
      })
      .join('');
    downloadAsFile(content, `journal-export-${timestamp}.md`, 'text/markdown');
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
  
  const extensions: Record<string, string> = {
    markdown: 'md',
    json: 'json',
    txt: 'txt',
  };
  
  link.download = `journal-export-${timestamp}.${extensions[exportFormat] ?? exportFormat}`;
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
