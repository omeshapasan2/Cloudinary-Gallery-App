require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

const { v4: uuidv4 } = require('uuid');
const sessions = {}; // In-memory session store (reset on server restart)

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.post('/api/send-details', (req, res) => {
  const { cloudName, apiKey, apiSecret } = req.body;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const sessionId = uuidv4(); // Generate a unique session ID

  sessions[sessionId] = {
    cloudName,
    apiKey,
    apiSecret
  };

  return res.json({ message: 'Session created', sessionId });
});

// Helper function to get credentials
function configureCloudinaryFromSession(sessionId) {
  const session = sessions[sessionId];
  if (!session) {
    throw new Error('Invalid session ID');
  }

  cloudinary.config({
    cloud_name: session.cloudName,
    api_key: session.apiKey,
    api_secret: session.apiSecret,
  });
}

// Get images from Cloudinary
app.post('/api/cloudinary', async (req, res) => {
  const { sessionId } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);
    const resources = await cloudinary.api.resources({ max_results: 10 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Upload files to Cloudinary
app.post('/api/upload', upload.array('files', 10), async (req, res) => {
  const { sessionId } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder: 'React-Gallery-App',
          resource_type: 'auto',
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });

        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.json({ success: true, files: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});