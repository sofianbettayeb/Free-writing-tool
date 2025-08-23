import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJournalEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all journal entries
  app.get("/api/entries", async (req, res) => {
    try {
      const entries = await storage.getAllJournalEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Get a specific journal entry
  app.get("/api/entries/:id", async (req, res) => {
    try {
      const entry = await storage.getJournalEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entry" });
    }
  });

  // Create a new journal entry
  app.post("/api/entries", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid entry data" });
    }
  });

  // Update a journal entry
  app.patch("/api/entries/:id", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.partial().parse(req.body);
      const entry = await storage.updateJournalEntry(req.params.id, validatedData);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid entry data" });
    }
  });

  // Delete a journal entry
  app.delete("/api/entries/:id", async (req, res) => {
    try {
      const success = await storage.deleteJournalEntry(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  // Search journal entries
  app.get("/api/entries/search/:query", async (req, res) => {
    try {
      const entries = await storage.searchJournalEntries(req.params.query);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Export entries
  app.post("/api/export", async (req, res) => {
    try {
      const { format, range, entryIds } = req.body;
      let entries = await storage.getAllJournalEntries();
      
      if (entryIds && entryIds.length > 0) {
        entries = entries.filter(entry => entryIds.includes(entry.id));
      }

      let exportData;
      let contentType;
      let filename;

      switch (format) {
        case 'json':
          exportData = JSON.stringify(entries, null, 2);
          contentType = 'application/json';
          filename = 'journal-export.json';
          break;
        case 'markdown':
          exportData = entries.map(entry => 
            `# ${entry.title}\n\n*${new Date(entry.createdAt).toLocaleDateString()}*\n\n${entry.content}\n\n---\n\n`
          ).join('');
          contentType = 'text/markdown';
          filename = 'journal-export.md';
          break;
        case 'txt':
          exportData = entries.map(entry => 
            `${entry.title}\n${new Date(entry.createdAt).toLocaleDateString()}\n\n${entry.content}\n\n${'='.repeat(50)}\n\n`
          ).join('');
          contentType = 'text/plain';
          filename = 'journal-export.txt';
          break;
        default:
          return res.status(400).json({ message: "Invalid export format" });
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(exportData);
    } catch (error) {
      res.status(500).json({ message: "Export failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
