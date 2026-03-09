import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { JournalEntry } from '@shared/schema';
import { exportEntries, exportForLLM } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  selectedEntryId: string | null;
}

export function ExportModal({ isOpen, onClose, entries, selectedEntryId }: ExportModalProps) {
  const [format, setFormat] = useState('markdown');
  const [range, setRange] = useState('current');
  const [embedImages, setEmbedImages] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const getEntriesToExport = (): JournalEntry[] => {
    switch (range) {
      case 'current':
        if (selectedEntryId) {
          const entry = entries.find(e => e.id === selectedEntryId);
          if (entry) return [entry];
        }
        return [];
      case 'today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return entries.filter(entry => new Date(entry.createdAt) >= today);
      }
      case 'week': {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entries.filter(entry => new Date(entry.createdAt) >= weekAgo);
      }
      case 'all':
        return entries;
      default:
        return [];
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const entriesToExport = getEntriesToExport();

      if (entriesToExport.length === 0) {
        toast({
          title: 'No entries to export',
          description: 'Please select a valid range or create some entries first.',
          variant: 'destructive',
        });
        return;
      }

      await exportEntries(entriesToExport, format as 'markdown' | 'json' | 'txt' | 'html', embedImages);
      
      toast({
        title: 'Export successful',
        description: `Exported ${entriesToExport.length} entries as ${format.toUpperCase()}${embedImages ? ' with images' : ''}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Something went wrong during export. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleLLMExport = async () => {
    setIsExporting(true);
    try {
      const entriesToExport = getEntriesToExport();

      if (entriesToExport.length === 0) {
        toast({
          title: 'No entries to export',
          description: 'Please select a valid range or create some entries first.',
          variant: 'destructive',
        });
        return;
      }

      await exportForLLM(entriesToExport);
      
      toast({
        title: 'Copied to clipboard',
        description: `${entriesToExport.length} entries with images formatted for LLMs and copied to clipboard`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to copy content to clipboard.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const supportsEmbedImages = format === 'markdown' || format === 'html';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-export">
        <DialogHeader>
          <DialogTitle>Export Options</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger data-testid="select-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markdown">Markdown (.md)</SelectItem>
                <SelectItem value="json">JSON (.json)</SelectItem>
                <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                <SelectItem value="html">HTML (.html)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Export Range</Label>
            <RadioGroup value={range} onValueChange={setRange} data-testid="radio-range">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current" className="text-sm">Current entry only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="today" id="today" />
                <Label htmlFor="today" className="text-sm">Today's entries</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week" className="text-sm">This week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="text-sm">All entries</Label>
              </div>
            </RadioGroup>
          </div>

          {supportsEmbedImages && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="embed-images" className="text-sm font-medium text-gray-700">Embed images</Label>
                <p className="text-xs text-gray-500 mt-0.5">Include images directly in the file (larger file size)</p>
              </div>
              <Switch
                id="embed-images"
                checked={embedImages}
                onCheckedChange={setEmbedImages}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleLLMExport}
              disabled={isExporting}
              data-testid="button-chatgpt-export"
            >
              {isExporting ? 'Copying...' : 'Copy for LLMs'}
            </Button>
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={onClose} data-testid="button-cancel">
                Cancel
              </Button>
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                data-testid="button-download"
              >
                {isExporting ? 'Exporting...' : 'Download'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
