import express from 'express';
import multer from 'multer';
import fs from 'fs/promises'; 
import { processHealthSurvey } from '../services/aiService.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('surveyForm'), async (req, res, next) => {
  try {
    const userInput = req.body.textData;
    const imageFile = req.file;

    //  GUARDRAIL: Pre-check for empty requests 
    if (!userInput && !imageFile) {
      return res.status(400).json({
        status: "error",
        message: "No input provided. Please provide either textData or a surveyForm image."
      });
    }

    
    const result = await processHealthSurvey(userInput, imageFile);

    if (imageFile) {
      await fs.unlink(imageFile.path).catch(err => console.error("Cleanup error:", err));
    }

    res.json(result);
  } catch (error) {

    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error); 
  }
});

export default router;