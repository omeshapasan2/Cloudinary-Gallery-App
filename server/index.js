require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

// Get images from Cloudinary
app.get('/api/cloudinary', async (req, res) => {
  try {
    const cloudName = process.env.CLOUD_NAME;

    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder`,
      {
        params: {
          asset_folder: 'React-Gallery-App',
        },
        auth: {
          username: process.env.CLOUDINARY_API_KEY,
          password: process.env.CLOUDINARY_API_SECRET
        }
      }
    );

    const cloudinaryData = response.data.resources.map(resource => ({
      public_id: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
      width: resource.width,
      height: resource.height
    }));

    res.json(cloudinaryData);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from Cloudinary' });
  }
});

// Upload files to Cloudinary
app.post('/api/upload', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'React-Gallery-App',
            resource_type: 'auto', // Automatically detect file type
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
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload files',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});