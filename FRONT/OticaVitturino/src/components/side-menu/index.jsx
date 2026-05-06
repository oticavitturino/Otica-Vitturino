import './style.css'
import Button from '../button'
import { useNavigate } from 'react-router-dom'
import { useRef, useEffect } from 'react'

function Side_Menu({ isOpen, onClose }) {

    const navigate = useNavigate();

    const menuRef = useRef(null);

    useEffect(() => {
        function handleOutsideTouch(event) {
            if (event.target.closest('.hamburger-btn')) {
                return;
            }

            if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                onClose(); //
            }
        }

        document.addEventListener("mousedown", handleOutsideTouch);
        document.addEventListener("touchstart", handleOutsideTouch);

        return () => {
            document.removeEventListener("mousedown", handleOutsideTouch);
            document.removeEventListener("touchstart", handleOutsideTouch);
        };
    }, [isOpen, onClose]);

    return (
        <aside ref={menuRef} className={`side-menu ${isOpen ? 'open' : ''}`}>
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