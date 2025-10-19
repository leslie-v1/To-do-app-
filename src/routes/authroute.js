import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// REGISTER new user endpoint /auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password required" });

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const result = await db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      username,
      hashedPassword
    );

    const userId = result.lastID;
    await db.run("INSERT INTO todos (user_id, task) VALUES (?, ?)", userId, "Hello :) add your first todo!");

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: "Server not configured (JWT_SECRET missing)" });

    const token = jwt.sign({ id: userId }, secret, { expiresIn: "24h" });
    return res.status(201).json({ auth: true, token });
  } catch (error) {
    if (error?.message?.includes("UNIQUE")) {
      return res.status(409).json({ error: "User already exists" });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN endpoint /auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password required" });

  try {
    const user = await db.get("SELECT id, username, password FROM users WHERE username = ?", username);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches) return res.status(401).json({ error: "Invalid credentials" });
    console.log(user);

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: "Server not configured (JWT_SECRET missing)" });

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "24h" });
    return res.json({ auth: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
