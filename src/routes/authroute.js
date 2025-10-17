import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

// Basic register/login placeholders (minimal implementation)
// routes/auth.js
const router = express.Router();

//REGISTER new user endpoint /auth/register
router.post("/register",  (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    res.sendStatus(201);
});

router.post("/login", (req, res) => {
    
});

export default router
