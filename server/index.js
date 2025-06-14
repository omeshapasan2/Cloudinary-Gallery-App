require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });

});

app.get('/api/cloudinary', async (req, res) => {
    
    try{
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
        )

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});