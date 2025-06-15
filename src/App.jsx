import './App.css'
import {Routes , Route} from 'react-router-dom'
import MainPage from './Pages/MainPage'
import CloudinaryAccManager from './components/CloudinaryAccManager'

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/acc" element={<CloudinaryAccManager />} />
      </Routes>
    </>
  )
}

export default App
