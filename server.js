import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5001;

async function initDB() {
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

app.get("/", (req, res) => {
  res.send("O Servidor está trabalhando");
});

initDB().then(() => {
  app.listen(PORT,() =>{
  console.log("O Servidor está rodando na Porta:", PORT);
});
});