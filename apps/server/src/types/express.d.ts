import type { SessionPayload } from "src/auth/types/auth.type";

declare global {
  namespace Express {
    interface User extends SessionPayload {}
  }
}
