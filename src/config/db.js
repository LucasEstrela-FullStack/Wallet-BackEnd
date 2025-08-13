import { neon } from "@neondatabase/serverless";
import "dotenv/config.js";

// Criar a conexão baseado no nome no ENV
export const sql = neon(process.env.DATABASE_URL)

export async function initDB() {
  try {
    await sql `CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    createdAt DATE NOT NULL DEFAULT CURRENT_DATE
    )`

    console.log("Database criada com sucesso!");
  } catch (error) {
    console.log("Erro ao Criar Database", error);
    process.exit(1); // Status 1 error falha, 0 ocorreu sucesso
  }
}
