import './App.css'
import {Routes , Route} from 'react-router-dom'
import MainPage from './Pages/MainPage'
import { CloudinaryProvider } from './core/CloudinaryContext'
import Home from './Pages/Home'
import GalleryPage from './Pages/GalleryPage'
import UploadPage from './Pages/UploadPage'


function App() {


  return (
    <>
      <CloudinaryProvider>
        <Routes>
          {/* <Route path="/" element={<MainPage />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </CloudinaryProvider>
    </>
  )
}

export default App
