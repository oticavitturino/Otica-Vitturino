import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Homepage from './pages/homepage/homepage'
import UserManagement from './pages/user-management/user-management'
import Scheduling_Panel from './pages/scheduling-panel/scheduling-panel'
import Production_Status_Panel from './pages/production-status-panel/production-status-panel'
import Incident_History from './pages/incident-history/incident-history'
import Message_Editor from './pages/message-editor/message-editor'
import ProtectedRoute from './components/protected-route'

function App() {
  return (

    <Routes>
      {/* Rota principal / que é carregada por padrão */}
      <Route path="/" element={<Login />} />

      {/* As rotas de dentro do sistema */}
      <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
      <Route path="/agendamentos" element={<ProtectedRoute><Scheduling_Panel /></ProtectedRoute>} />
      <Route path="/status-producao" element={<ProtectedRoute><Production_Status_Panel /></ProtectedRoute>} />
      <Route path="/historico-ocorrencia" element={<ProtectedRoute><Incident_History /></ProtectedRoute>} />
      <Route path="/editor-de-mensagens" element={<ProtectedRoute><Message_Editor /></ProtectedRoute>} />
    </Routes>
  )
}

export default App