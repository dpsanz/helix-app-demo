import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Auth/Login'
import Perfil from './pages/Perfil/Perfil'
import PortalMedico from './pages/PortalMedico/PortalMedico'
import Cadastro from './pages/Cadastro/Cadastro'

import './App.css'

function App() {

  return (
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/perfil' element={<Perfil/>}/>
            <Route path='/portal-medico' element={<PortalMedico/>}/>
            <Route path='/cadastro' element={<Cadastro/>}/>
        </Routes>
     </BrowserRouter>
  )
}

export default App

