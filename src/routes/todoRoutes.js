import express from "express";
import dbModule from "../db.js";

const router = express.Router();

// Get all todos for a user (query ?user_id=)
router.get("/", async (req, res) => {
  
});

// Create todo for user
router.post("/:id", async (req, res) => {
  
});

// Update a todo (body must include id)
router.put("/:id", async (req, res) => {
  
});

export default router;
