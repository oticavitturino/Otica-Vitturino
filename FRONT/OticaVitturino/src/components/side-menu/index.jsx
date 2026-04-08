import './style.css'
import Button from '../button'
import { useNavigate } from 'react-router-dom'

function Side_Menu({ isOpen }) {

    const navigate = useNavigate();

    return (
        <aside className={`side-menu ${isOpen ? 'open' : ''}`}>

            <div className='menu-items'>
                <Button className='btn-item' onClick={() => navigate('/usuarios')}>Gerenciar Usuários</Button>
                <Button className='btn-item' onClick={() => navigate('/agendamentos')}>Gerenciar Agendamentos</Button>
                <Button className='btn-item' onClick={() => navigate('/status-producao')}>Painel de Produção</Button>
                <Button className='btn-item' onClick={() => navigate('/historico-ocorrencia')}>Histórico de Ocorrências/Reclamações</Button>
                <Button className='btn-item' onClick={() => navigate('/editor-de-mensagens')}>Editar Mensagens Pré-Programadas</Button>
            </div>

            <Button className='btn-exit' onClick={() => navigate('/')}>Sair</Button>

        </aside>
    )
}

export default Side_Menu