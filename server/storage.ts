import { ConsultationRequest, AnalysisResult, BusinessProfile, InsertConsultationRequest, InsertAnalysisResult, InsertBusinessProfile } from "../shared/schema.js";

export interface IStorage {
  // Consultation Requests
  createConsultationRequest(data: InsertConsultationRequest): Promise<ConsultationRequest>;
  getConsultationRequest(id: string): Promise<ConsultationRequest | null>;
  getAllConsultationRequests(): Promise<ConsultationRequest[]>;
  updateConsultationRequestStatus(id: string, status: "pending" | "analyzing" | "completed"): Promise<void>;

  // Analysis Results
  createAnalysisResult(data: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResult(consultationId: string): Promise<AnalysisResult | null>;
  getAllAnalysisResults(): Promise<AnalysisResult[]>;

  // Business Profiles
  createBusinessProfile(data: InsertBusinessProfile): Promise<BusinessProfile>;
  getBusinessProfile(id: string): Promise<BusinessProfile | null>;
  getAllBusinessProfiles(): Promise<BusinessProfile[]>;
  updateBusinessProfile(id: string, data: Partial<InsertBusinessProfile>): Promise<void>;
}

export class MemStorage implements IStorage {
  private consultationRequests: Map<string, ConsultationRequest> = new Map();
  private analysisResults: Map<string, AnalysisResult> = new Map();
  private businessProfiles: Map<string, BusinessProfile> = new Map();

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Consultation Requests
  async createConsultationRequest(data: InsertConsultationRequest): Promise<ConsultationRequest> {
    const id = this.generateId();
    const now = new Date();
    const consultationRequest: ConsultationRequest = {
      ...data,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.consultationRequests.set(id, consultationRequest);
    return consultationRequest;
  }

  async getConsultationRequest(id: string): Promise<ConsultationRequest | null> {
    return this.consultationRequests.get(id) || null;
  }

  async getAllConsultationRequests(): Promise<ConsultationRequest[]> {
    return Array.from(this.consultationRequests.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateConsultationRequestStatus(id: string, status: "pending" | "analyzing" | "completed"): Promise<void> {
    const consultationRequest = this.consultationRequests.get(id);
    if (consultationRequest) {
      consultationRequest.status = status;
      consultationRequest.updatedAt = new Date();
      this.consultationRequests.set(id, consultationRequest);
    }
  }

  // Analysis Results
  async createAnalysisResult(data: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = this.generateId();
    const analysisResult: AnalysisResult = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.analysisResults.set(data.consultationId, analysisResult);
    return analysisResult;
  }

  async getAnalysisResult(consultationId: string): Promise<AnalysisResult | null> {
    return this.analysisResults.get(consultationId) || null;
  }

  async getAllAnalysisResults(): Promise<AnalysisResult[]> {
    return Array.from(this.analysisResults.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Business Profiles
  async createBusinessProfile(data: InsertBusinessProfile): Promise<BusinessProfile> {
    const id = this.generateId();
    const now = new Date();
    const businessProfile: BusinessProfile = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.businessProfiles.set(id, businessProfile);
    return businessProfile;
  }

  async getBusinessProfile(id: string): Promise<BusinessProfile | null> {
    return this.businessProfiles.get(id) || null;
  }

  async getAllBusinessProfiles(): Promise<BusinessProfile[]> {
    return Array.from(this.businessProfiles.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateBusinessProfile(id: string, data: Partial<InsertBusinessProfile>): Promise<void> {
    const businessProfile = this.businessProfiles.get(id);
    if (businessProfile) {
      Object.assign(businessProfile, data, { updatedAt: new Date() });
      this.businessProfiles.set(id, businessProfile);
    }
  }
}

export const storage = new MemStorage();