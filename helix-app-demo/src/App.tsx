import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Perfil from './pages/Perfil/Perfil'
import PortalMedico from './pages/PortalMedico/PortalMedico'
import Cadastro from './pages/Cadastro/Cadastro'
import { useAuth } from './hooks/useAuth'
import './App.css'

function App() {
  const { isAuthenticated, role } = useAuth()
  const home = role === 'doctor' ? '/portal-medico' : '/perfil'
  return <BrowserRouter><Routes>
    <Route path="/" element={isAuthenticated ? <Navigate to={home} /> : <Login />} />
    <Route path="/perfil" element={isAuthenticated ? <Perfil /> : <Navigate to="/" />} />
    <Route path="/portal-medico" element={isAuthenticated ? <PortalMedico /> : <Navigate to="/" />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes></BrowserRouter>
}
export default App
