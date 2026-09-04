import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Auth/Login'
import Perfil from './pages/Perfil/Perfil'
import PortalMedico from './pages/PortalMedico/PortalMedico'
import Cadastro from './pages/Cadastro/Cadastro'
import { useAuth } from './hooks/useAuth'

import './App.css'

function App() {
  const {isAuthenticated} = useAuth()

  return (
     <BrowserRouter>
        <Routes>
            <Route path='/' element={isAuthenticated ? <Navigate to="/perfil" /> : <Login />}/>
            <Route path='/perfil' element={<Perfil/>}/>
            <Route path='/portal-medico' element={<PortalMedico/>}/>
            <Route path='/cadastro' element={<Cadastro/>}/>
        </Routes>
     </BrowserRouter>
  )
}

export default App

