require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
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

// Rename/Move file in Cloudinary
app.post('/api/rename', async (req, res) => {
  const { sessionId, currentPublicId, newPublicId } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!currentPublicId || !newPublicId) {
      return res.status(400).json({ error: 'Both current and new public IDs are required' });
    }

    // Use the rename method to change the public_id
    const result = await cloudinary.uploader.rename(currentPublicId, newPublicId);
    
    res.json({ 
      success: true, 
      message: 'File renamed successfully',
      result: result
    });
  } catch (error) {
    console.error('Rename error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete file from Cloudinary
app.post('/api/delete', async (req, res) => {
  const { sessionId, publicId } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    // Delete the resource from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ 
        success: true, 
        message: 'File deleted successfully',
        result: result
      });
    } else {
      res.status(400).json({ 
        error: 'Failed to delete file',
        result: result
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Batch delete multiple files
app.post('/api/delete-batch', async (req, res) => {
  const { sessionId, publicIds } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({ error: 'Array of public IDs is required' });
    }

    // Delete multiple resources
    const result = await cloudinary.api.delete_resources(publicIds);
    
    res.json({ 
      success: true, 
      message: `Batch delete completed`,
      result: result
    });
  } catch (error) {
    console.error('Batch delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});