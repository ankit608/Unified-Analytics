import express from "express";
import cors from 'cors'
import compression from "compression";
import authRouter from "./Routes/auth.js"
import analyticRouter from "./Routes/analytics.js"
import "./auth/auth.js"
import { swaggerDocs } from "./swagger.js";
export const app = express();

app.use(express.json())

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth",authRouter)
app.use("/api/analytics",analyticRouter)
swaggerDocs(app)