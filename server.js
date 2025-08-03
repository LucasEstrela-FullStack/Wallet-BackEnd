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
});

app.get("/api/transactions/:userId", async(req,res) => {
  try {
    const {userId}=req.params
    
    const transactions = await sql `
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY createdAt DESC
    `

    res.status(200).json(transactions);
  } catch (error) {
    console.log("Erro ao buscar informações", error)
    res.status(500).json({message:"Internal Server error"})
  }
});

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
});

app.delete("/api/transactions/:id", async(req,res) => {
  try {
    const {id} = req.params;

    if(isNaN(parseInt(id))){
      return res.status(400).json({message:"Id da transaction inválido"})
    }

    const transactions = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `
    if(result.length === 0){
      return res.status(404).json({message: "Transaction não encontrada"})
    }

    res.status(200).json({message:"Transaction deleteda com sucesso"})
    
  } catch (error) {
    console.log("Erro ao deletar a transação", error)
    res.status(500).json({message:"Internal Server error"})
  }
})

initDB().then(() => {
  app.listen(PORT,() =>{
  console.log("O Servidor está rodando na Porta:", PORT);
});
});