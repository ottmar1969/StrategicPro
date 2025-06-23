// Content Storage System for ContentScale Platform

export interface ContentUser {
  id: string;
  sessionId: string;
  credits: number;
  freeArticlesUsed: number;
  hasOwnApiKey: boolean;
  userAgent: string;
  ipAddress: string;
  browserFingerprint?: string;
  isFlagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  userId: string;
  provider: "openai" | "gemini";
  encryptedKey: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Article {
  id: string;
  userId: string;
  title: string;
  content: string;
  seoScore: number;
  metadata: any;
  isPaid: boolean;
  paymentMethod: "free" | "credits" | "payment";
  createdAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  articleId?: string;
  amount: number;
  type: "article" | "credits";
  status: "pending" | "completed" | "failed";
  stripePaymentIntentId?: string;
  createdAt: Date;
}

export interface AbuseDetection {
  id: string;
  ipAddress: string;
  browserFingerprint?: string;
  userAgent: string;
  freeArticlesUsed: number;
  usersCreated: number;
  isBanned: boolean;
  isVpn: boolean;
  isProxy: boolean;
  isDataCenter: boolean;
  ipCountry?: string;
  ipRiskScore: number;
  lastActivity: Date;
  createdAt: Date;
}

export interface IContentStorage {
  // Users
  createUser(data: Omit<ContentUser, 'id' | 'createdAt' | 'updatedAt' | 'isFlagged'>): Promise<ContentUser>;
  getUser(id: string): Promise<ContentUser | null>;
  getUserBySession(sessionId: string): Promise<ContentUser | null>;
  updateUser(id: string, data: Partial<Omit<ContentUser, 'id' | 'createdAt'>>): Promise<void>;

  // API Keys
  saveApiKey(data: Omit<ApiKey, 'id' | 'createdAt'>): Promise<ApiKey>;
  getApiKeys(userId: string): Promise<ApiKey[]>;
  getActiveApiKey(userId: string, provider: "openai" | "gemini"): Promise<ApiKey | null>;

  // Articles
  createArticle(data: Omit<Article, 'id' | 'createdAt'>): Promise<Article>;
  getArticle(id: string): Promise<Article | null>;
  getUserArticles(userId: string): Promise<Article[]>;

  // Payments
  createPayment(data: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment>;
  getPayment(id: string): Promise<Payment | null>;
  updatePaymentStatus(id: string, status: Payment['status']): Promise<void>;

  // Abuse Detection
  recordAbuse(data: Omit<AbuseDetection, 'id' | 'createdAt'>): Promise<AbuseDetection>;
  getAbuseRecord(ipAddress: string): Promise<AbuseDetection | null>;
  updateAbuseRecord(id: string, data: Partial<Omit<AbuseDetection, 'id' | 'createdAt'>>): Promise<void>;
}

export class MemContentStorage implements IContentStorage {
  private users: Map<string, ContentUser> = new Map();
  private apiKeys: Map<string, ApiKey> = new Map();
  private articles: Map<string, Article> = new Map();
  private payments: Map<string, Payment> = new Map();
  private abuseRecords: Map<string, AbuseDetection> = new Map();
  private sessionIndex: Map<string, string> = new Map(); // sessionId -> userId

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Users
  async createUser(data: Omit<ContentUser, 'id' | 'createdAt' | 'updatedAt' | 'isFlagged'>): Promise<ContentUser> {
    const id = this.generateId();
    const now = new Date();
    
    const user: ContentUser = {
      ...data,
      id,
      isFlagged: false,
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(id, user);
    this.sessionIndex.set(data.sessionId, id);
    
    return user;
  }

  async getUser(id: string): Promise<ContentUser | null> {
    return this.users.get(id) || null;
  }

  async getUserBySession(sessionId: string): Promise<ContentUser | null> {
    const userId = this.sessionIndex.get(sessionId);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async updateUser(id: string, data: Partial<Omit<ContentUser, 'id' | 'createdAt'>>): Promise<void> {
    const user = this.users.get(id);
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
  }

  // API Keys
  async saveApiKey(data: Omit<ApiKey, 'id' | 'createdAt'>): Promise<ApiKey> {
    const id = this.generateId();
    
    const apiKey: ApiKey = {
      ...data,
      id,
      createdAt: new Date()
    };
    
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }

  async getApiKeys(userId: string): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.userId === userId);
  }

  async getActiveApiKey(userId: string, provider: "openai" | "gemini"): Promise<ApiKey | null> {
    const userKeys = await this.getApiKeys(userId);
    return userKeys.find(key => key.provider === provider && key.isActive) || null;
  }

  // Articles
  async createArticle(data: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    const id = this.generateId();
    
    const article: Article = {
      ...data,
      id,
      createdAt: new Date()
    };
    
    this.articles.set(id, article);
    return article;
  }

  async getArticle(id: string): Promise<Article | null> {
    return this.articles.get(id) || null;
  }

  async getUserArticles(userId: string): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Payments
  async createPayment(data: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
    const id = this.generateId();
    
    const payment: Payment = {
      ...data,
      id,
      createdAt: new Date()
    };
    
    this.payments.set(id, payment);
    return payment;
  }

  async getPayment(id: string): Promise<Payment | null> {
    return this.payments.get(id) || null;
  }

  async updatePaymentStatus(id: string, status: Payment['status']): Promise<void> {
    const payment = this.payments.get(id);
    if (!payment) return;
    
    payment.status = status;
    this.payments.set(id, payment);
  }

  // Abuse Detection
  async recordAbuse(data: Omit<AbuseDetection, 'id' | 'createdAt'>): Promise<AbuseDetection> {
    const id = this.generateId();
    
    const record: AbuseDetection = {
      ...data,
      id,
      createdAt: new Date()
    };
    
    this.abuseRecords.set(data.ipAddress, record);
    return record;
  }

  async getAbuseRecord(ipAddress: string): Promise<AbuseDetection | null> {
    return this.abuseRecords.get(ipAddress) || null;
  }

  async updateAbuseRecord(id: string, data: Partial<Omit<AbuseDetection, 'id' | 'createdAt'>>): Promise<void> {
    // Find record by id and update
    for (const [ip, record] of this.abuseRecords.entries()) {
      if (record.id === id) {
        const updatedRecord = { ...record, ...data };
        this.abuseRecords.set(ip, updatedRecord);
        break;
      }
    }
  }

  // Statistics and utility methods
  async getStats() {
    return {
      totalUsers: this.users.size,
      totalArticles: this.articles.size,
      totalPayments: this.payments.size,
      totalAbuseRecords: this.abuseRecords.size,
      activeApiKeys: Array.from(this.apiKeys.values()).filter(key => key.isActive).length
    };
  }

  async getAllUsers(): Promise<ContentUser[]> {
    return Array.from(this.users.values());
  }

  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
}

// Export singleton instance
export const contentStorage = new MemContentStorage();