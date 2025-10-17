// server.js
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authroute.js';
import todoRoutes from './routes/todoRoutes.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
// serve the public directory
app.use(express.static(path.join(__dirname, '../public')));


// SPA fallback (move after API routes) — use '/*' instead of '*'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'public', 'index.html'));
});

//routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}...`);
});
