const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const inputPath = req.file.path;
  const outputPath = `${inputPath}_out.png`;

  try {
    // Use our custom Python script for reliability
    const command = `python process.py "${inputPath}" "${outputPath}"`;
    
    await execPromise(command);

    if (fs.existsSync(outputPath)) {
      res.sendFile(path.resolve(outputPath), () => {
        // Cleanup files after sending
        cleanup(inputPath, outputPath);
      });
    } else {
      throw new Error('Output file not generated');
    }
  } catch (error) {
    console.error('Processing error:', error);
    cleanup(inputPath, outputPath);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

function cleanup(inPath, outPath) {
  try {
    if (fs.existsSync(inPath)) fs.unlinkSync(inPath);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}

module.exports = router;
