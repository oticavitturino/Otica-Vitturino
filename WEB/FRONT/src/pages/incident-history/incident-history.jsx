import './style.css'
import Layout from '../../components/layout'
import Container from '../../components/container'
import List_Item from '../../components/list-item'
import Button from '../../components/button'
import Card from '../../components/card'
import ReplyIcon from '../../assets/message-square-reply.png'
import TrashIcon from '../../assets/trash-2.png'
import XIcon from '../../assets/x.png'
import { useState, useEffect } from 'react'
import { apiFetch } from '../../services/api'

function formatOccurrenceCategory(category) {
    if (!category) return '';

    const normalized = category.trim().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (normalized === 'ocorrencia') return 'Ocorrência';
    if (normalized === 'reclamacao') return 'Reclamação';

    return category;
}

function Incident_History() {

    const [occurrenceToDelete, setOccurrenceToDelete] = useState(null);
    const [occurrenceToRespond, setOccurrenceToRespond] = useState(null);
    const [occurrenceDescriptionToView, setOccurrenceDescriptionToView] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [occurrences, setOccurrences] = useState([]);

    // Função para buscar todas as ocorrências
    async function fetchAllOccurences() {
        try {
            const response = await apiFetch('/occurrences/listAll');
            if (response.ok) {
                const data = await response.json();
                const sorted = [...data].sort((a, b) => {
                    const dateA = new Date(a.sentAt || 0).getTime();
                    const dateB = new Date(b.sentAt || 0).getTime();
                    if (dateB !== dateA) return dateB - dateA;
                    return (b.id ?? 0) - (a.id ?? 0);
                });
                setOccurrences(sorted);
            } else {
                console.error('Falha ao buscar ocorrências.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    useEffect(() => {
        fetchAllOccurences();
    }, []);

    function openRespondModal(occurrence) {
        setOccurrenceToRespond(occurrence);
        setResponseMessage('');
    }

    function closeRespondModal() {
        setOccurrenceToRespond(null);
        setResponseMessage('');
    }

    // Função de deletar ocorrência
    async function deleteOccurrence(id) {
        try {
            const response = await apiFetch(`/occurrences/delete?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setOccurrenceToDelete(null);
                fetchAllOccurences();
            } else {
                alert('Erro ao excluir. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    // Função de responder ocorrência por e-mail
    async function handleSendResponse(event) {
        event.preventDefault();

        if (!occurrenceToRespond) {
            return;
        }

        try {
            const response = await apiFetch('/occurrences/respond', {
                method: 'POST',
                body: JSON.stringify({
                    occurrenceId: occurrenceToRespond.id,
                    message: responseMessage,
                }),
            });

            if (response.ok) {
                alert('Resposta enviada com sucesso!');
                closeRespondModal();
            } else {
                let errorMessage = 'Erro ao enviar resposta. Tente novamente.';
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch {
                    // ignore parse errors
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    return (
        <Layout>
            <div className='incident-page-wrapper'>
                {/* 1: Container externo */}
                <Container className='main-container-incident-history'>

                    {/* 2: Título */}
                    <h2>Gerencie aqui as ocorrências/reclamações</h2>

                    {/* 3: Área de scroll */}
                    <div className='incident-scroll-area'>
                        {occurrences.length === 0 ? (
                            <p className='empty-state-text'>Nenhuma ocorrência encontrada.</p>
                        ) : (
                            <>
                                {/* 4: Legendas */}
                                <div className='list-legend'>
                                    <span>Usuário</span>
                                    <span>Categoria</span>
                                    <span>Descrição</span>
                                    <span>Data</span>
                                    <span></span>
                                </div>

                                {/* 5: Ícones de ação e renderização da lista */}
                                {occurrences.map((item) => {
                                    const rawDate = item.sentAt || "";
                                    let formattedDate = rawDate;
                                    let formattedTime = "";

                                    if (rawDate.includes('T')) {
                                        const [datePart, timePart] = rawDate.split('T');
                                        const [year, month, day] = datePart.split('-');
                                        formattedDate = `${day}/${month}/${year}`;
                                        formattedTime = timePart.substring(0, 5);
                                    }

                                    return (
                                        <List_Item key={item.id} actions={
                                            <>
                                                <button
                                                    className='icon-btn'
                                                    onClick={() => openRespondModal(item)}
                                                >
                                                    <img src={ReplyIcon} className='action-icon' alt='Responder' />
                                                </button>

                                                <button className='icon-btn' onClick={() => setOccurrenceToDelete(item)}>
                                                    <img src={TrashIcon} className='action-icon' alt='Excluir' />
                                                </button>
                                            </>
                                        }>
                                            <div className='list-row-data'>
                                                <span>{item.customerName}</span>
                                                <span>{formatOccurrenceCategory(item.category)}</span>
                                                <span
                                                    className='occurrence-description-preview'
                                                    title='Clique para ver a descrição completa'
                                                    onClick={() => setOccurrenceDescriptionToView(item)}
                                                >
                                                    {item.description}
                                                </span>
                                                <span>{formattedDate} {formattedTime}</span>
                                                <span></span>
                                            </div>
                                        </List_Item>
                                    );
                                })}

                                {/* 6: Pop-up de exclusão de ocorrência/reclamação */}
                                {occurrenceToDelete && (
                                    <div className='modal-overlay' onClick={() => setOccurrenceToDelete(null)}>
                                        <Card className='exclude-occurrence-card' onClick={(e) => e.stopPropagation()}>
                                            <button className='x-btn' onClick={() => setOccurrenceToDelete(null)}>
                                                <img src={XIcon} className='x-btn-img' alt='Fechar'></img>
                                            </button>

                                            <h3>Deseja excluir essa <br />{occurrenceToDelete.category}?</h3>

                                            <div className='btn-container'>
                                                <Button className='yes-btn' onClick={() => deleteOccurrence(occurrenceToDelete.id)}>Sim</Button>
                                                <Button className='no-btn' onClick={() => setOccurrenceToDelete(null)}>Não</Button>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {/* 7: Pop-up de resposta à ocorrência/reclamação */}
                                {occurrenceToRespond && (
                                    <div className='modal-overlay' onClick={closeRespondModal}>
                                        <Card className='respond-occurrence-card' onClick={(e) => e.stopPropagation()}>
                                            <button className='x-btn' onClick={closeRespondModal}>
                                                <img src={XIcon} className='x-btn-img' alt='Fechar'></img>
                                            </button>

                                            <h3>Responder {formatOccurrenceCategory(occurrenceToRespond.category)}</h3>
                                            <p className='respond-occurrence-subtitle'>
                                                {occurrenceToRespond.customerName}
                                            </p>
                                            <p className='respond-occurrence-description'>
                                                {occurrenceToRespond.description}
                                            </p>

                                            <form className='respond-occurrence-form' onSubmit={handleSendResponse}>
                                                <div className='input-group'>
                                                    <label>Sua resposta:</label>
                                                    <textarea
                                                        value={responseMessage}
                                                        onChange={(e) => setResponseMessage(e.target.value)}
                                                        required
                                                        rows="5"
                                                        placeholder='Digite a resposta que será enviada por e-mail...'
                                                    />
                                                </div>

                                                <button type='submit' className='btn-send-response'>
                                                    Enviar
                                                </button>
                                            </form>
                                        </Card>
                                    </div>
                                )}

                                {/* 8: Pop-up de descrição completa */}
                                {occurrenceDescriptionToView && (
                                    <div className='modal-overlay' onClick={() => setOccurrenceDescriptionToView(null)}>
                                        <Card className='view-description-card' onClick={(e) => e.stopPropagation()}>
                                            <button className='x-btn' onClick={() => setOccurrenceDescriptionToView(null)}>
                                                <img src={XIcon} className='x-btn-img' alt='Fechar'></img>
                                            </button>

                                            <p className='view-description-text'>
                                                {occurrenceDescriptionToView.description}
                                            </p>
                                        </Card>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Container>
            </div>
        </Layout>
    )
}

export default Incident_History
