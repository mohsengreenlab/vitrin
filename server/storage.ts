import { type Contact, type InsertContact } from "@shared/schema";
import { db } from "./db";
import { contacts } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export interface IStorage {
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
}

export class SingleStoreStorage implements IStorage {
  async createContact(insertContact: InsertContact): Promise<Contact> {
    try {
      const id = randomUUID();
      const contact = {
        ...insertContact,
        id,
      };
      
      await db.insert(contacts).values(contact);
      
      const [savedContact] = await db.select().from(contacts).where(
        eq(contacts.id, id)
      );
      
      return savedContact;
    } catch (error) {
      console.error("Error creating contact:", error);
      throw new Error("Failed to create contact in database");
    }
  }

  async getAllContacts(): Promise<Contact[]> {
    try {
      return await db.select().from(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw new Error("Failed to fetch contacts from database");
    }
  }
}

export const storage = new SingleStoreStorage();
