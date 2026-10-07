/**
 * Contact types
 */

export interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  createdAt: string;
}
