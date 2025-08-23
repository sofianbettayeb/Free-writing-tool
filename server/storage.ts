import { 
  type JournalEntry, 
  type InsertJournalEntry, 
  type UpsertUser, 
  type User, 
  users, 
  journalEntries 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, ilike, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Journal entry operations (user-aware)
  getJournalEntry(id: string, userId: string): Promise<JournalEntry | undefined>;
  getAllJournalEntries(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry, userId: string): Promise<JournalEntry>;
  updateJournalEntry(id: string, entry: Partial<InsertJournalEntry>, userId: string): Promise<JournalEntry | undefined>;
  deleteJournalEntry(id: string, userId: string): Promise<boolean>;
  searchJournalEntries(query: string, userId: string): Promise<JournalEntry[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Journal entry operations (user-aware)
  async getJournalEntry(id: string, userId: string): Promise<JournalEntry | undefined> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id) && eq(journalEntries.userId, userId));
    return entry;
  }

  async getAllJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async createJournalEntry(insertEntry: InsertJournalEntry, userId: string): Promise<JournalEntry> {
    const [entry] = await db
      .insert(journalEntries)
      .values({
        ...insertEntry,
        wordCount: insertEntry.wordCount || "0",
        userId,
      })
      .returning();
    return entry;
  }

  async updateJournalEntry(
    id: string, 
    updateData: Partial<InsertJournalEntry>, 
    userId: string
  ): Promise<JournalEntry | undefined> {
    const [updated] = await db
      .update(journalEntries)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
      .returning();
    return updated;
  }

  async deleteJournalEntry(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async searchJournalEntries(query: string, userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(
        and(
          eq(journalEntries.userId, userId),
          or(
            ilike(journalEntries.title, `%${query}%`),
            ilike(journalEntries.content, `%${query}%`)
          )
        )
      )
      .orderBy(desc(journalEntries.createdAt));
  }
}

export const storage = new DatabaseStorage();
