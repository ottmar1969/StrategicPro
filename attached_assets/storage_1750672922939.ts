interface Consultation {
  id: string;
  category: string;
  businessName: string;
  industry: string;
  description: string;
  specificChallenges: string[];
  goals: string[];
  timeline: string;
  budget: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface Analysis {
  id: string;
  consultationId: string;
  category: string;
  analysis: string;
  recommendations: string[];
  createdAt: string;
  status: 'completed' | 'failed';
}

interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  challenges: string[];
  goals: string[];
  createdAt: string;
  updatedAt: string;
}

class InMemoryStorage {
  private consultations: Map<string, Consultation> = new Map();
  private analyses: Map<string, Analysis> = new Map();
  private businessProfiles: Map<string, BusinessProfile> = new Map();

  // Consultation methods
  async createConsultation(data: Omit<Consultation, 'id' | 'createdAt' | 'status'>): Promise<Consultation> {
    const consultation: Consultation = {
      ...data,
      id: `consultation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    this.consultations.set(consultation.id, consultation);
    return consultation;
  }

  async getConsultation(id: string): Promise<Consultation | null> {
    return this.consultations.get(id) || null;
  }

  async getConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateConsultationStatus(id: string, status: Consultation['status']): Promise<boolean> {
    const consultation = this.consultations.get(id);
    if (!consultation) return false;

    consultation.status = status;
    this.consultations.set(id, consultation);
    return true;
  }

  // Analysis methods
  async saveAnalysis(consultationId: string, analysisData: Omit<Analysis, 'consultationId'>): Promise<Analysis> {
    const analysis: Analysis = {
      ...analysisData,
      consultationId
    };

    this.analyses.set(analysis.id, analysis);
    
    // Update consultation status
    await this.updateConsultationStatus(consultationId, 'completed');
    
    return analysis;
  }

  async getAnalysis(consultationId: string): Promise<Analysis | null> {
    for (const analysis of this.analyses.values()) {
      if (analysis.consultationId === consultationId) {
        return analysis;
      }
    }
    return null;
  }

  async getAllAnalyses(): Promise<Analysis[]> {
    return Array.from(this.analyses.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Business Profile methods
  async createBusinessProfile(data: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessProfile> {
    const profile: BusinessProfile = {
      ...data,
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.businessProfiles.set(profile.id, profile);
    return profile;
  }

  async getBusinessProfile(id: string): Promise<BusinessProfile | null> {
    return this.businessProfiles.get(id) || null;
  }

  async getBusinessProfiles(): Promise<BusinessProfile[]> {
    return Array.from(this.businessProfiles.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateBusinessProfile(id: string, updates: Partial<Omit<BusinessProfile, 'id' | 'createdAt'>>): Promise<BusinessProfile | null> {
    const profile = this.businessProfiles.get(id);
    if (!profile) return null;

    const updatedProfile: BusinessProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.businessProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async deleteBusinessProfile(id: string): Promise<boolean> {
    return this.businessProfiles.delete(id);
  }

  // Statistics and reporting
  async getStatistics() {
    const consultationsByCategory = new Map<string, number>();
    const consultationsByStatus = new Map<string, number>();

    for (const consultation of this.consultations.values()) {
      // Count by category
      const categoryCount = consultationsByCategory.get(consultation.category) || 0;
      consultationsByCategory.set(consultation.category, categoryCount + 1);

      // Count by status
      const statusCount = consultationsByStatus.get(consultation.status) || 0;
      consultationsByStatus.set(consultation.status, statusCount + 1);
    }

    return {
      totalConsultations: this.consultations.size,
      totalAnalyses: this.analyses.size,
      totalBusinessProfiles: this.businessProfiles.size,
      consultationsByCategory: Object.fromEntries(consultationsByCategory),
      consultationsByStatus: Object.fromEntries(consultationsByStatus),
      lastUpdated: new Date().toISOString()
    };
  }

  // Data export/import for backups
  async exportData() {
    return {
      consultations: Array.from(this.consultations.entries()),
      analyses: Array.from(this.analyses.entries()),
      businessProfiles: Array.from(this.businessProfiles.entries()),
      exportedAt: new Date().toISOString()
    };
  }

  async importData(data: any) {
    try {
      if (data.consultations) {
        this.consultations = new Map(data.consultations);
      }
      if (data.analyses) {
        this.analyses = new Map(data.analyses);
      }
      if (data.businessProfiles) {
        this.businessProfiles = new Map(data.businessProfiles);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data (for testing/reset)
  async clearAllData() {
    this.consultations.clear();
    this.analyses.clear();
    this.businessProfiles.clear();
  }
}

export const storage = new InMemoryStorage();

