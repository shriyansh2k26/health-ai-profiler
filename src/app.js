import 'dotenv/config';
import express from 'express';
import surveyRoutes from './routes/surveyRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());

// Routes
app.use('/api/v1/health', surveyRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));