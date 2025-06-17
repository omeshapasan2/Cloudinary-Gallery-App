import './App.css'
import {Routes , Route} from 'react-router-dom'
import MainPage from './Pages/MainPage'
import { CloudinaryProvider } from './core/CloudinaryContext'


function App() {


  return (
    <>
      <CloudinaryProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </CloudinaryProvider>
    </>
  )
}

export default App
