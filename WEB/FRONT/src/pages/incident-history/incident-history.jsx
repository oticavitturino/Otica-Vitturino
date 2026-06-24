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


function Incident_History() {

    const [occurrenceToDelete, setOccurrenceToDelete] = useState(null);
    const [occurrences, setOccurrences] = useState([]);

    async function fetchAllOccurences() {
        try {
            const response = await fetch('http://localhost:8080/occurrences/listAll');
            if (response.ok) {
                const data = await response.json();
                setOccurrences(data);
            } else {
                console.error('Falha ao buscar ocorrências.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    async function deleteOccurrence(id) {
        try {
            const response = await fetch(`http://localhost:8080/occurrences/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setOccurrenceToDelete(null);
                fetchAllOccurences();
            } else {
                console.error('Falha ao excluir a ocorrência.');
                alert('Erro ao excluir. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    useEffect(() => {
        fetchAllOccurences();
    }, []);

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
                            <p className="empty-state-text">Nenhuma ocorrência encontrada.</p>
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
                                                <button className="icon-btn chart-btn">
                                                    <img src={ReplyIcon} className="action-icon" alt="Responder" />
                                                </button>

                                                <button className="icon-btn chart-btn" onClick={() => setOccurrenceToDelete(item)}>
                                                    <img src={TrashIcon} className="action-icon" alt="Excluir" />
                                                </button>
                                            </>
                                        }>
                                            <div className="list-row-data">
                                                <span>{item.customerName}</span>
                                                <span>{item.category}</span>
                                                <span>{item.description}</span>
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
                                            <button className="occurrence-x-btn" onClick={() => setOccurrenceToDelete(null)}>
                                                <img src={XIcon} className="occurrence-x-btn-img" alt="Fechar"></img>
                                            </button>

                                            <h3>Deseja excluir essa <br />{occurrenceToDelete.category}?</h3>

                                            <div className='btn-container'>
                                                <Button className='yes-btn' onClick={() => deleteOccurrence(occurrenceToDelete.id)}>Sim</Button>
                                                <Button className='no-btn' onClick={() => setOccurrenceToDelete(null)}>Não</Button>
                                            </div>
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