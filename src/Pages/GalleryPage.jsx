import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CopyButton from '../components/CopyButton';

function GalleryPage() {

  const [ images, setImages ] = useState([]);

  useEffect(() => {
    axios.get('https://cloudinary-gallery-app-production.up.railway.app/api/cloudinary')
      .then((res) => {
        setImages(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
      });
  }, []);


  return (
    <div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {images.map((image) => (
          <div key={image.public_id} className="border rounded-lg overflow-hidden shadow-md">
            <img src={image.url} alt={image.public_id} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{image.public_id}</h3>
              <p className="text-sm text-gray-500">Format: {image.format}</p>
              <p className="text-sm text-gray-500">Dimensions: {image.width}x{image.height}</p>
            </div>
            <CopyButton image={image} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default GalleryPage
