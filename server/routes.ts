import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contacts", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: validationError.message 
        });
      }

      const contact = await storage.createContact(result.data);
      
      return res.status(201).json({ 
        message: "Contact form submitted successfully",
        contact 
      });
    } catch (error) {
      console.error("Error creating contact:", error);
      return res.status(500).json({ 
        message: "Failed to submit contact form" 
      });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      return res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({ 
        message: "Failed to fetch contacts" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
