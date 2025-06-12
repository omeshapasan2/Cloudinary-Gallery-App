import './App.css'
import {Routes , Route} from 'react-router-dom'
import MainPage from './Pages/MainPage'

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </>
  )
}

export default App
