import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Criar a conexão baseado no nome no ENV
export const sql = neon(process.env.DATABASE_URL)