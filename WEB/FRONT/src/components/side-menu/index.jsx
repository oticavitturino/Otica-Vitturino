import './style.css'
import Button from '../button'
import CreditsModal from '../credits-modal'
import { useNavigate } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { clearToken } from '../../services/api'

function Side_Menu({ isOpen, onClose }) {

    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [isCreditsOpen, setIsCreditsOpen] = useState(false);

    useEffect(() => {
        function handleOutsideTouch(event) {
            if (event.target.closest('.hamburger-btn')) {
                return;
            }

            if (event.target.closest('.modal-overlay')) {
                return;
            }

            if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleOutsideTouch);
        document.addEventListener("touchstart", handleOutsideTouch);

        return () => {
            document.removeEventListener("mousedown", handleOutsideTouch);
            document.removeEventListener("touchstart", handleOutsideTouch);
        };
    }, [isOpen, onClose]);

    function openCredits() {
        setIsCreditsOpen(true);
        onClose();
    }

    return (
        <>
            <aside ref={menuRef} className={`side-menu ${isOpen ? 'open' : ''}`}>

                <div className='menu-items'>
                    <Button className='btn-item' onClick={() => navigate('/usuarios')}>Gerenciar Usuários</Button>
                    <Button className='btn-item' onClick={() => navigate('/agendamentos')}>Gerenciar Agendamentos</Button>
                    <Button className='btn-item' onClick={() => navigate('/status-producao')}>Painel de Produção</Button>
                    <Button className='btn-item' onClick={() => navigate('/historico-ocorrencia')}>Histórico de Ocorrências/Reclamações</Button>
                    <Button className='btn-item' onClick={() => navigate('/editor-de-mensagens')}>Editar Mensagens Pré-Programadas</Button>
                </div>

                <Button className='btn-credits' onClick={openCredits}>Sobre / Créditos</Button>
                <Button className='btn-exit' onClick={() => { clearToken(); navigate('/'); }}>Sair</Button>

            </aside>

            <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
        </>
    )
}

export default Side_Menu
