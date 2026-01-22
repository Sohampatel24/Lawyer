import {
  type User,
  type InsertUser,
  type DigitalSignature,
  type InsertSignature,
  type PdfDocument,
  type InsertDocument,
  type AppliedSignature,
  type InsertAppliedSignature,
} from "@shared/schema";
import crypto from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser, verificationToken?: string): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Digital signature methods
  createSignature(signature: InsertSignature & {
    certificate: string;
    privateKey: string;
    signatureImage?: string | null;
  }): Promise<DigitalSignature>;
  getUserSignatures(userId: string): Promise<DigitalSignature[]>;
  getSignature(id: string): Promise<DigitalSignature | undefined>;
  deleteSignature(id: string): Promise<void>;

  // PDF document methods
  createDocument(document: InsertDocument): Promise<PdfDocument>;
  getUserDocuments(userId: string): Promise<PdfDocument[]>;
  getDocument(id: string): Promise<PdfDocument | undefined>;
  deleteDocument(id: string): Promise<void>;
  updateDocumentStatus(
    id: string,
    status: string,
    pageCount?: number,
    pageSizes?: string,
  ): Promise<void>;

  // Applied signature methods
  applySignature(
    appliedSignature: InsertAppliedSignature,
    isAllPagesOperation?: boolean,
  ): Promise<AppliedSignature>;
  getDocumentSignatures(documentId: string): Promise<AppliedSignature[]>;
  removeSignature(id: string): Promise<void>;
  removeSignaturesFromPage(documentId: string, pageNumber: number): Promise<void>;
  removeSignaturesFromDocument(documentId: string): Promise<void>;
  updateSignaturePosition(id: string, position: any): Promise<void>;
}

function generateId() {
  return crypto.randomUUID();
}

export class InMemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private signatures = new Map<string, DigitalSignature>();
  private documents = new Map<string, PdfDocument>();
  private appliedSignatures = new Map<string, AppliedSignature>();
  private verificationTokens = new Map<string, string>(); // token -> userId

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const userId = this.verificationTokens.get(token);
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  async createUser(insertUser: InsertUser, verificationToken?: string): Promise<User> {
    const id = generateId();
    const now = new Date();

    const user: User = {
      id,
      email: insertUser.email,
      password: insertUser.password,
      fullName: insertUser.fullName,
      companyName: insertUser.companyName ?? null,
      isVerified: (insertUser as any).isVerified ?? false,
      verificationToken: verificationToken ?? null,
      createdAt: now,
    };

    this.users.set(id, user);

    if (verificationToken) {
      this.verificationTokens.set(verificationToken, id);
    }

    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;

    const updated: User = {
      ...existing,
      ...updates,
    };

    this.users.set(id, updated);

    if (updated.verificationToken) {
      this.verificationTokens.set(updated.verificationToken, id);
    }

    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Digital signature methods
  async createSignature(
    insertSignature: InsertSignature & {
      certificate: string;
      privateKey: string;
      signatureImage?: string | null;
    },
  ): Promise<DigitalSignature> {
    const id = generateId();
    const now = new Date();

    const signature: DigitalSignature = {
      id,
      userId: insertSignature.userId,
      name: insertSignature.name,
      fullName: insertSignature.fullName,
      companyName: insertSignature.companyName,
      location: insertSignature.location,
      timeZone: insertSignature.timeZone,
      certificate: insertSignature.certificate,
      privateKey: insertSignature.privateKey,
      signatureImage: insertSignature.signatureImage ?? null,
      password: (insertSignature as any).password ?? null,
      createdAt: now,
    };

    this.signatures.set(id, signature);
    return signature;
  }

  async getUserSignatures(userId: string): Promise<DigitalSignature[]> {
    return Array.from(this.signatures.values()).filter(
      (sig) => sig.userId === userId,
    );
  }

  async getSignature(id: string): Promise<DigitalSignature | undefined> {
    return this.signatures.get(id);
  }

  async deleteSignature(id: string): Promise<void> {
    // Remove applied signatures referencing this signature
    for (const [appliedId, applied] of this.appliedSignatures) {
      if (applied.signatureId === id) {
        this.appliedSignatures.delete(appliedId);
      }
    }

    this.signatures.delete(id);
  }

  // PDF document methods
  async createDocument(insertDocument: InsertDocument): Promise<PdfDocument> {
    const id = generateId();
    const now = new Date();

    const document: PdfDocument = {
      id,
      userId: insertDocument.userId,
      fileName: insertDocument.fileName,
      originalName: insertDocument.originalName,
      fileSize: insertDocument.fileSize as number,
      filePath: insertDocument.filePath,
      pageCount: insertDocument.pageCount as number,
      pageSizes: insertDocument.pageSizes ?? null,
      status: (insertDocument as any).status ?? "pending",
      uploadedAt: now,
    };

    this.documents.set(id, document);
    return document;
  }

  async getUserDocuments(userId: string): Promise<PdfDocument[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.userId === userId,
    );
  }

  async getDocument(id: string): Promise<PdfDocument | undefined> {
    return this.documents.get(id);
  }

  async deleteDocument(id: string): Promise<void> {
    // Remove applied signatures for this document
    for (const [appliedId, applied] of this.appliedSignatures) {
      if (applied.documentId === id) {
        this.appliedSignatures.delete(appliedId);
      }
    }

    this.documents.delete(id);
  }

  async updateDocumentStatus(
    id: string,
    status: string,
    pageCount?: number,
    pageSizes?: string,
  ): Promise<void> {
    const existing = this.documents.get(id);
    if (!existing) return;

    const updated: PdfDocument = {
      ...existing,
      status,
      pageCount: pageCount ?? existing.pageCount,
      pageSizes: (pageSizes as any) ?? existing.pageSizes,
    };

    this.documents.set(id, updated);
  }

  // Applied signature methods
  async applySignature(
    insertAppliedSignature: InsertAppliedSignature,
    isAllPagesOperation: boolean = false,
  ): Promise<AppliedSignature> {
    // Validate required fields
    if (!insertAppliedSignature.documentId) {
      throw new Error("documentId is required");
    }
    if (!insertAppliedSignature.signatureId) {
      throw new Error("signatureId is required");
    }
    if (!insertAppliedSignature.pageNumber || (insertAppliedSignature.pageNumber as number) < 1) {
      throw new Error("pageNumber is required and must be >= 1");
    }
    if (
      !insertAppliedSignature.position ||
      typeof insertAppliedSignature.position !== "object" ||
      insertAppliedSignature.position === null
    ) {
      throw new Error("position object is required");
    }

    const position = insertAppliedSignature.position as any;
    if (
      !position.gridPosition ||
      typeof position.gridPosition !== "string" ||
      position.gridPosition.trim() === ""
    ) {
      throw new Error(
        "position.gridPosition is required and must be a non-empty string",
      );
    }

    // Check if an applied signature already exists for this document/signature/page
    const existingOnPage = Array.from(this.appliedSignatures.values()).filter(
      (applied) =>
        applied.documentId === insertAppliedSignature.documentId &&
        applied.pageNumber === insertAppliedSignature.pageNumber &&
        applied.signatureId === insertAppliedSignature.signatureId,
    );

    if (existingOnPage.length > 0 && !isAllPagesOperation) {
      // Update existing signature position instead of creating duplicate
      const existing = existingOnPage[0];
      await this.updateSignaturePosition(existing.id, insertAppliedSignature.position);
      return existing;
    }

    const id = generateId();
    const applied: AppliedSignature = {
      id,
      documentId: insertAppliedSignature.documentId,
      signatureId: insertAppliedSignature.signatureId,
      pageNumber: insertAppliedSignature.pageNumber as number,
      position: insertAppliedSignature.position as any,
      appliedAt: new Date(),
    };

    this.appliedSignatures.set(id, applied);
    return applied;
  }

  async getDocumentSignatures(documentId: string): Promise<AppliedSignature[]> {
    return Array.from(this.appliedSignatures.values()).filter(
      (sig) => sig.documentId === documentId,
    );
  }

  async removeSignature(id: string): Promise<void> {
    this.appliedSignatures.delete(id);
  }

  async removeSignaturesFromPage(
    documentId: string,
    pageNumber: number,
  ): Promise<void> {
    for (const [appliedId, applied] of this.appliedSignatures) {
      if (applied.documentId === documentId && applied.pageNumber === pageNumber) {
        this.appliedSignatures.delete(appliedId);
      }
    }
  }

  async removeSignaturesFromDocument(documentId: string): Promise<void> {
    for (const [appliedId, applied] of this.appliedSignatures) {
      if (applied.documentId === documentId) {
        this.appliedSignatures.delete(appliedId);
      }
    }
  }

  async updateSignaturePosition(id: string, position: any): Promise<void> {
    const existing = this.appliedSignatures.get(id);
    if (!existing) {
      throw new Error(`Signature with ID ${id} not found for position update`);
    }

    const updated: AppliedSignature = {
      ...existing,
      position: position as any,
    };

    this.appliedSignatures.set(id, updated);
  }
}

export const storage = new InMemoryStorage();
