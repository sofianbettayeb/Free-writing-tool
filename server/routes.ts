import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJournalEntrySchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get all journal entries (user-aware)
  app.get("/api/entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getAllJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Get a specific journal entry (user-aware)
  app.get("/api/entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entry = await storage.getJournalEntry(req.params.id, userId);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entry" });
    }
  });

  // Create a new journal entry (user-aware)
  app.post("/api/entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(validatedData, userId);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid entry data" });
    }
  });

  // Update a journal entry (user-aware)
  app.patch("/api/entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertJournalEntrySchema.partial().parse(req.body);
      const entry = await storage.updateJournalEntry(req.params.id, validatedData, userId);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid entry data" });
    }
  });

  // Delete a journal entry (user-aware)
  app.delete("/api/entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.deleteJournalEntry(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  // Search journal entries (user-aware)
  app.get("/api/entries/search/:query", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.searchJournalEntries(req.params.query, userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Image upload endpoint (protected)
  app.post("/api/images/upload", isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getImageUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  // Serve images (public)
  app.get("/images/:imagePath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const imageFile = await objectStorageService.getImageFile(req.path);
      objectStorageService.downloadObject(imageFile, res);
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });


  // Export entries (user-aware)
  app.post("/api/export", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { format, range, entryIds } = req.body;
      let entries = await storage.getAllJournalEntries(userId);
      
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
