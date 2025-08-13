import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js"

dotenv.config()

const app = express()

// Middleware
app.use(rateLimiter)
app.use(express.json());

// app.use((req,res,next) => {
//   console.log("Opa encontramos uma requisição, o metódo é", req.method)
//   next()
// })

const PORT = process.env.PORT || 5001;


app.get("/health", (req,res) => {
  res.send("Está trabalhando @#")
});

app.use("/api/transactions", transactionsRoute)

initDB().then(() => {
  app.listen(PORT,() =>{
  console.log("O Servidor está rodando na Porta:", PORT);
});
});