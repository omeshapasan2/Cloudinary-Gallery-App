import './App.css'
import {Routes , Route} from 'react-router-dom'
import MainPage from './Pages/MainPage'
import CloudinaryAccManager from './components/CloudinaryAccManager'
import { CloudinaryProvider } from './core/CloudinaryContext'


function App() {


  return (
    <>
      <CloudinaryProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/acc" element={<CloudinaryAccManager />} />
        </Routes>
      </CloudinaryProvider>
    </>
  )
}

export default App
