// Session type definitions for TypeScript
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    id: string;
    userId?: string;
    contentUserId?: string;
  }
}