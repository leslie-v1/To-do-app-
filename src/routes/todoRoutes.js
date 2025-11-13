import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all todos for a user (query ?user_id=)
router.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id ?? req.userId;
    if (!userId) {
      return res.status(400).json({ error: "user_id is required" });
    }
    const todos = await prisma.todos.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: { id: "asc" },
    });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create todo for user
router.post("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id || req.userId);
    const { task } = req.body;
    if (!task) return res.status(400).json({ error: "task is required" });
    const newTodo = await prisma.todo.create({
      data: {
        task,
        completed: false,
        userId: req.userId,
      },
    });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo (body must include completed)
router.put("/:id", async (req, res) => {
  try {
    const { completed } = req.body;
    const id = Number(req.params.id);
    if (typeof completed !== "boolean" && completed !== 0 && completed !== 1) {
      return res.status(400).json({ error: "completed must be boolean or 0/1" });
    }
    const updated = await prisma.todo.update({
      where: { id: parseInt(id), userId: Number(req.userId) },
      data: { completed: Boolean(completed) },
    });
    res.json({ message: "Todo updated", todo: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete a todo 
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.userId);
    const deleted = await prisma.todo.deleteMany({
      where: { id, userId },
    });
    if (deleted.count === 0) {
      return res.status(404).json({ message: "Todo not found or not owned by user" });
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
