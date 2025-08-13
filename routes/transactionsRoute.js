import express from "express";
import { sql } from "../config/db.js";
import { getTransactionsByUserId } from "../controllers/getTransactionsByUserId.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.post("/", async (req,res) => {
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

router.delete("/:id", async(req,res) => {
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
});

router.get("/summary/:userId", async(req,res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
    `

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Erro ao buscar o Summary:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
});

export default router;