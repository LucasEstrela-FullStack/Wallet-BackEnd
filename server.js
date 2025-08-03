import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config()

const app = express()

// Middleware
app.use(express.json());
// app.use((req,res,next) => {
//   console.log("Opa encontramos uma requisição, o metódo é", req.method)
//   next()
// })

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

app.get("/", (req,res) => {
  res.send("Está trabalhando @#")
})

app.post("/api/transactions", async (req,res) => {
  // title, amount, category, user_id
  try {
    const {title, amount, category, user_id} = req.body;

    if(!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({message: "Todos os campos estão preenchidos"});
    }

    const  transactions = await sql`
    INSERT INTO transactions (user_id,title,amount,category)
    VALUES(${user_id},${title},${amount},${category})
    RETURNING * 
    `
    console.log(transactions)
    res.status(201).json(transactions[0])

  } catch (error) {
    console.log("Erro ao criar a transação", error)
    res.status(500).json({message:"Internal Server error"})
  }
})

initDB().then(() => {
  app.listen(PORT,() =>{
  console.log("O Servidor está rodando na Porta:", PORT);
});
});