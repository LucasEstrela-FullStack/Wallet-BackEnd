import express from "express";
import dotenv from "dotenv";

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("O Servidor está trabalhando");
});

app.listen(PORT,() =>{
  console.log("O Servidor está rodando na Porta:", PORT);
});