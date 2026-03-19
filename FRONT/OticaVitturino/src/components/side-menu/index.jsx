import './style.css'
import Button from '../button'

function Side_Menu() {

    return (
        <div className='side-menu'>
            <div className='menu-items'>
                <Button className='btn-item'>Gerenciar Usuários</Button>
                <Button className='btn-item'>Gerenciar Agendamentos</Button>
                <Button className='btn-item'>Painel de Produção</Button>
                <Button className='btn-item'>Histórico de Ocorrências/Reclamações</Button>
                <Button className='btn-item'>Editar Mensagens Pré-Programadas</Button>
            </div>

            <Button className='btn-exit'>Sair</Button>
        </div>
    )

}

export default Side_Menu