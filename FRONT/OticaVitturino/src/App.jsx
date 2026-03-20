import { Routes, Route } from 'react-router-dom' 

import Login from './pages/login/login' 
import Homepage from './pages/homepage/homepage'
import UserManagement from './pages/user-management/user-management' 

function App() {
  return (

    <Routes>
      {/* Rota principal / que é carregada por padrão */}
      <Route path="/" element={<Login />} />
      
      {/* As rotas de dentro do sistema */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/usuarios" element={<UserManagement />} />
    </Routes>
  )
}

export default App