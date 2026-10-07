/**
 * CORS configuration
 * Handles cross-origin requests from frontend
 */

import cors from "cors";
import { env } from "../lib/env";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://www.darkpyramid.net",
  "https://darkpyramid.net",
  // Vercel preview/production URLs for this project
  "https://greece-hieroglyphs.vercel.app",
  env.corsOrigin,
].filter(Boolean); // Remove any undefined values

export const corsConfig = cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all origins (Replit proxies requests from various domains)
    if (process.env.NODE_ENV !== "production") return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours
});
