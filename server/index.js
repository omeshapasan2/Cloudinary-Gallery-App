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

// Get folders from Cloudinary
app.post('/api/folders', async (req, res) => {
  const { sessionId, folder } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);
    
    let folders;
    if (!folder || folder === '') {
      // Get root folders
      folders = await cloudinary.api.root_folders();
    } else {
      // Get subfolders
      folders = await cloudinary.api.sub_folders(folder);
    }
    
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get images from Cloudinary (updated to support folders)
app.post('/api/cloudinary', async (req, res) => {
  const { sessionId, folder } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);
    
    const options = { 
      max_results: 100,
      resource_type: 'image',
      type: 'upload'
    };

    let resources;
    
    // If folder is specified, get resources from that folder
    if (folder && folder !== '') {
      const folderPrefix = folder.endsWith('/') ? folder : folder + '/';
      options.prefix = folderPrefix;
      resources = await cloudinary.api.resources(options);
    } else {
      resources = await cloudinary.api.resources(options);
      resources.resources = resources.resources.filter(
        (item) => !item.public_id.includes('/')
      );
    }
    res.json(resources);
    
  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create folder
app.post('/api/create-folder', async (req, res) => {
  const { sessionId, folderPath } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!folderPath) {
      return res.status(400).json({ error: 'Folder path is required' });
    }

    const result = await cloudinary.api.create_folder(folderPath);
    res.json({ 
      success: true, 
      message: 'Folder created successfully',
      result: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename/Update folder
app.post('/api/rename-folder', async (req, res) => {
  const { sessionId, currentFolderPath, newFolderPath } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!currentFolderPath || !newFolderPath) {
      return res.status(400).json({ error: 'Both current and new folder paths are required' });
    }

    // Use update_folder method (equivalent to PUT request)
    const result = await cloudinary.api.update_folder(currentFolderPath, {
      to_folder: newFolderPath
    });
    
    res.json({ 
      success: true, 
      message: 'Folder renamed successfully',
      result: result
    });
  } catch (error) {
    console.error('Rename folder error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete folder
app.post('/api/delete-folder', async (req, res) => {
  const { sessionId, folderPath } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!folderPath) {
      return res.status(400).json({ error: 'Folder path is required' });
    }

    const result = await cloudinary.api.delete_folder(folderPath);
    res.json({ 
      success: true, 
      message: 'Folder deleted successfully',
      result: result
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload files to Cloudinary (updated to support folder upload)
app.post('/api/upload', upload.array('files', 10), async (req, res) => {
  const { sessionId, folder } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          resource_type: 'auto',
        };

        // If folder is specified, upload to that folder
        if (folder && folder !== '') {
          uploadOptions.folder = folder;
        } else {
          uploadOptions.folder = 'React-Gallery-App';
        }

        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
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
app.post('/api/rename', (req, res) => {
  const { sessionId, currentPublicId, newPublicId } = req.body;

  try {
    configureCloudinaryFromSession(sessionId);

    if (!currentPublicId || !newPublicId) {
      return res.status(400).json({ error: 'Both current and new public IDs are required' });
    }

    // Use the rename method to change the public_id
    cloudinary.uploader
      .rename(currentPublicId, newPublicId)
      .then(result => {
        res.json({ 
          success: true, 
          message: 'File renamed successfully',
          result: result
        });
      })
      .catch(error => {
        console.error('Rename error:', error);
        res.status(500).json({ error: error.message });
      });

  } catch (error) {
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
    cloudinary.uploader
      .destroy(publicId)
      .then(result => {
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
      })
      .catch(error => {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
      });
  } catch (error) {
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