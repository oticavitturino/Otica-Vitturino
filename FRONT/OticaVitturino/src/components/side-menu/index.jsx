import './style.css'
import Button from '../button'
import { useNavigate } from 'react-router-dom'

function Side_Menu() {

    const navigate = useNavigate();

    return (
        <div className='side-menu'>
            <div className='menu-items'>
                <Button className='btn-item' onClick={() => navigate('/usuarios')}>Gerenciar Usuários</Button>
                <Button className='btn-item' onClick={() => navigate('/agendamentos')}>Gerenciar Agendamentos</Button>
                <Button className='btn-item' onClick={() => navigate('/status-producao')}>Painel de Produção</Button>
                <Button className='btn-item'>Histórico de Ocorrências/Reclamações</Button>
                <Button className='btn-item'>Editar Mensagens Pré-Programadas</Button>
            </div>

            <Button className='btn-exit' onClick={() => navigate('/')}>Sair</Button>
        </div>
    )

}

export default Side_Menu