const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

const upload = multer({ 
    dest: path.join(__dirname, '../uploads/'),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/', upload.single('image'), async (req, res) => {
  console.log(`[${new Date().toISOString()}] Received image processing request: ${req.file?.originalname}`);
  
  if (!req.file) {
    console.error('No file in request');
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const inputPath = req.file.path;
  const outputPath = `${inputPath}_out.png`;

  try {
    console.log(`Processing ${inputPath} -> ${outputPath}...`);
    const scriptPath = path.join(__dirname, '../process.py');
    const command = `python "${scriptPath}" "${inputPath}" "${outputPath}"`;
    
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log('Python stdout:', stdout);
    if (stderr) console.error('Python stderr:', stderr);

    if (fs.existsSync(outputPath)) {
      console.log('Success! Sending result.');
      res.sendFile(path.resolve(outputPath), () => {
        // Cleanup files after sending
        cleanup(inputPath, outputPath);
      });
    } else {
      console.error('Output file missing after processing');
      throw new Error('Output file not generated');
    }
  } catch (error) {
    console.error('Processing error details:', error);
    cleanup(inputPath, outputPath);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
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
