import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/login' 
import Homepage from './pages/homepage/homepage'
import UserManagement from './pages/user-management/user-management' 
import Scheduling_Panel from './pages/scheduling-panel/scheduling-panel'
import Production_Status_Panel from './pages/production-status-panel/production-status-panel'
import Incident_History from './pages/incident-history/incident-history'

function App() {
  return (

    <Routes>
      {/* Rota principal / que é carregada por padrão */}
      <Route path="/" element={<Login />} />
      
      {/* As rotas de dentro do sistema */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/usuarios" element={<UserManagement />} />
      <Route path="/agendamentos" element={<Scheduling_Panel />} />
      <Route path="/status-producao" element={<Production_Status_Panel />} />
      <Route path="/historico-ocorrencia" element={<Incident_History />} />
    </Routes>
  )
}

export default App