require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Updated route to handle FormData
app.post('/api/send-details', upload.none(), async (req, res) => {
  const { cloudName, apiKey, apiSecret } = req.body;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  // Configure Cloudinary dynamically with input credentials
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    // Example: list resources in Cloudinary
    const resources = await cloudinary.api.resources({
      max_results: 10,
    });

    return res.json({
      message: 'Success! Used your credentials to fetch resources.',
      resources,
    });
  } catch (error) {
    console.error('Cloudinary error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Get images from Cloudinary
app.post('/api/cloudinary', async (req, res) => {
  const { cloudName, apiKey, apiSecret } = req.body;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  // Configure cloudinary dynamically
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    const resources = await cloudinary.api.resources({
      max_results: 10,
    });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload files to Cloudinary
app.post('/api/upload', upload.array('files', 10), async (req, res) => {
  const { cloudName, apiKey, apiSecret } = req.body;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'React-Gallery-App',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                public_id: result.public_id,
                url: result.secure_url,
                format: result.format,
                width: result.width,
                height: result.height
              });
            }
          }
        );
        
        uploadStream.end(file.buffer);
      });
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    res.json({
      success: true,
      message: `${uploadResults.length} files uploaded successfully`,
      files: uploadResults
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to upload files', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});