import './style.css'
import Layout from '../../components/layout'
import Container from '../../components/container'
import List_Item from '../../components/list-item'
import Card from '../../components/card'
import PenIcon from '../../assets/pen.png'
import PlusIcon from '../../assets/circle-plus.png'
import XIcon from '../../assets/x.png'
import { useState } from 'react'

function Message_Editor() {

    // Mensagens pré-programadas
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'LEMBRETE_15_DIAS',
            title: '15 dias - Mensagem de Adaptação',
            content: ''
        },
        {
            id: 2,
            type: 'LEMBRETE_30_DIAS',
            title: '30 dias - Mensagem de Suporte',
            content: ''
        },
        {
            id: 3,
            type: 'LEMBRETE_90_DIAS',
            title: '3 meses - Mensagem de Check-up',
            content: ''
        },
        {
            id: 4,
            type: 'LEMBRETE_180_DIAS',
            title: '6 meses - Mensagem de Revisão',
            content: ''
        },
        {
            id: 5,
            type: 'LEMBRETE_365_DIAS',
            title: '1 ano - Mensagem de Renovação de Grau',
            content: ''
        },
        {
            id: 6,
            type: 'COMPRA',
            title: 'Mensagem de Confirmação de Pedido',
            content: ''
        },
        {
            id: 7,
            type: 'ANIVERSARIO',
            title: 'Mensagem de Aniversário',
            content: ''
        }
    ])

    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [currentEditing, setCurrentEditing] = useState({
        id: null,
        type: '',
        title: '',
        content: '',
        isNew: true // Identificar se é um POST ou PUT
    });

    // Função para abrir o pop-up com a mensagem selecionada
    const handleOpenModal = (msg) => {
        setCurrentEditing({
            id: msg.id,
            type: msg.type,
            title: msg.title,
            content: msg.content,
            isNew: msg.content === "" // Se estiver vazio, é novo (POST). Se já tiver texto, é edição (PUT).
        });
        setIsMessageModalOpen(true);
    };

    // Função para criar ou atualizar mensagem (dependendo do contexto)
    async function handleSaveMessage(event) {
        event.preventDefault();

        // Verificações se é POST ou PUT
        const endpoint = currentEditing.isNew ? '/create' : '/update';
        const method = currentEditing.isNew ? 'POST' : 'PUT';
        const url = `http://localhost:8080/message-template${endpoint}`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: currentEditing.type,
                    templateText: currentEditing.content
                })
            });

            if (response.ok) {
                alert('Mensagem salva com sucesso!');
                setMessages(messages.map(m =>
                    m.id === currentEditing.id ? { ...m, content: currentEditing.content } : m
                ));
                setIsMessageModalOpen(false);
            } else {
                alert('Erro ao salvar a mensagem.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    return (
        <Layout>
            <div className='message-page-wrapper'>
                {/* 1: Container externo */}
                <Container className='main-container-message-editor'>

                    {/* 2: Título */}
                    <h2>Editor de Mensagens Pré-Programadas</h2>

                    {/* 3: Área de scroll */}
                    <div className='messages-scroll-area'>

                        {/* 4: Ícone de ação */}
                        {messages.map((msg) => (
                            <List_Item key={msg.id} actions={
                                <button className='icon-btn' onClick={() => handleOpenModal(msg)}>
                                    {msg.content === "" ? (
                                        <img src={PlusIcon} className='action-icon' alt='Adicionar'></img>
                                    ) : (
                                        <img src={PenIcon} className='action-icon' alt='Editar'></img>
                                    )}
                                </button>
                            }>
                                {/* 5: Título e conteúdo da mensagem */}
                                <div className='message-content'>
                                    <span className='message-title'>
                                        {msg.title}
                                    </span>

                                    <span className='message-body'>
                                        {msg.content !== "" ? msg.content : <em>Nenhuma mensagem configurada.</em>}
                                    </span>
                                </div>
                            </List_Item>
                        ))}
                    </div>

                    {/* 6: Pop-up de Edição de Mensagem */}
                    {isMessageModalOpen && (
                        <div className='modal-overlay' onClick={() => setIsMessageModalOpen(false)}>
                            <Card className='edit-message-card' onClick={(e) => e.stopPropagation()}>
                                <button className='x-btn' onClick={() => setIsMessageModalOpen(false)}>
                                    <img src={XIcon} className='x-btn-img' alt='Fechar'></img>
                                </button>

                                <h3>{currentEditing.isNew ? 'Criar Mensagem' : 'Editar Mensagem'}</h3>
                                <p className='edit-message-subtitle'>
                                    {currentEditing.title}
                                </p>

                                <form className='edit-message-form' onSubmit={handleSaveMessage}>
                                    <div className='input-group'>
                                        <label>Corpo da Mensagem:</label>

                                        <textarea
                                            value={currentEditing.content}
                                            onChange={(e) => setCurrentEditing({ ...currentEditing, content: e.target.value })}
                                            required
                                            rows="5"
                                            placeholder='Digite o texto da mensagem aqui...'
                                        />
                                    </div>

                                    <button type="submit" className='btn-save-message'>
                                        Salvar
                                    </button>
                                </form>
                            </Card>
                        </div>
                    )}
                </Container>
            </div>
        </Layout>
    )
}

export default Message_Editor