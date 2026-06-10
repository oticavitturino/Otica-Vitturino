import './style.css'
import Layout from '../../components/layout'
import Container from '../../components/container'
import List_Item from '../../components/list-item'
import Button from '../../components/button'
import Card from '../../components/card'
import XIcon from '../../assets/x.png'
import CheckIcon from '../../assets/check.png'
import { useState, useEffect } from 'react'

function Scheduling_Panel() {

    const [isAddDateModalOpen, setIsAddDateModalOpen] = useState(false);
    const [dateTimeInput, setDateTimeInput] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);

    // Função de abrir pop-up ao clicar no botão "Adicionar datas disponíveis"
    function addSchedulingDate() {
        setIsAddDateModalOpen(true);
    }

    // Função para buscar os dados na API
    async function fetchAllSchedulings() {
        try {
            const response = await fetch('http://localhost:8080/scheduling/getAllSchedulings');
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else {
                console.error('Falha ao buscar agendamentos');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    // Função para buscar as datas disponíveis na API
    async function fetchAvailableDates() {
        try {
            const response = await fetch('http://localhost:8080/scheduling/getAllDatesAvailable');
            if (response.ok) {
                const data = await response.json();
                const datesOnly = data.map(item => item.date_available);
                setAvailableDates(datesOnly);
            } else {
                console.error('Falha ao buscar datas disponíveis');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    useEffect(() => {
        fetchAllSchedulings();
        fetchAvailableDates();
    }, []);

    // Função de adicionar nova data disponível
    async function handleSaveAvailableDate(event) {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/scheduling/addDateAvailable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date_available: dateTimeInput
                })
            });

            if (response.ok) {
                alert('Data adicionada com sucesso!');
                setDateTimeInput('');
                fetchAvailableDates();
            } else {
                alert('Erro ao adicionar data.')
            }
        } catch (error) {
            console.log('Erro de requisição: ', error)
        }
    }

    // Função de remover data disponível
    async function handleDeleteAvailableDate(dateToDelete) {
        try {
            const response = await fetch('http://localhost:8080/scheduling/deleteDateAvailable', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date_available: dateToDelete
                })
            });

            if (response.ok) {
                setAvailableDates(availableDates.filter(data => data !== dateToDelete));
                alert('Data removida com sucesso!');
            } else {
                alert('Erro ao remover a data.')
            }
        } catch (error) {
            console.error('Erro de requisição: ', error)
        }
    }

    // Função de confirmar ou cancelar agendamento
    async function handleUpdateAppointmentStatus(schedulingId, newStatus) {
        try {
            const url = new URL('http://localhost:8080/scheduling/confirmOrCancelAppointment');
            url.searchParams.append('schedulingId', schedulingId);
            url.searchParams.append('status', newStatus);

            const response = await fetch(url, {
                method: 'POST',
            });

            if (response.ok) {
                alert(`Agendamento ${newStatus.toLowerCase()} com sucesso!`);
            } else {
                alert('Erro ao atualizar o status do agendamento.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    // Função de formatação de data
    function formatBrazilianDate(isoDate) {
        if (!isoDate) return '';

        const [datePart, timePart] = isoDate.split('T');

        const [year, month, day] = datePart.split('-');

        return `${day}/${month}/${year} - ${timePart}`;
    }

    return (
        <Layout>
            <div className='scheduling-page-wrapper'>
                {/* 1: Container externo */}
                <Container className='main-container-scheduling-panel'>

                    {/* 2: Título */}
                    <h2>Gerencie aqui seus agendamentos</h2>

                    {/* 3: Área de scroll */}
                    <div className='scheduling-scroll-area'>
                        {appointments.length === 0 ? (
                            <p className="empty-state-text">Nenhum agendamento cadastrado.</p>
                        ) : (
                            <>
                                {/* 4: Legendas */}
                                <div className='list-legend'>
                                    <span>Usuário</span>
                                    <span>Categoria</span>
                                    <span>Data</span>
                                    <span>Hora</span>
                                    <span>Status</span>
                                    <span></span>
                                </div>

                                {/* 5: Ícones de ação e renderização da lista */}
                                {appointments.map((appointment, index) => {
                                    const [datePart, timePart] = appointment.schedulingDate.split('T');
                                    const [year, month, day] = datePart.split('-');
                                    const formattedDate = `${day}/${month}/${year}`;
                                    const formattedTime = timePart.substring(0, 5);

                                    return (
                                        <List_Item key={appointment.id} actions={
                                            <>
                                                <button
                                                    className="icon-btn chart-btn"
                                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, 'CONFIRMADO')}
                                                >
                                                    <img src={CheckIcon} className="action-icon" alt="Confirmar"></img>
                                                </button>

                                                <button
                                                    className="icon-btn x-btn"
                                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, 'CANCELADO')}
                                                >
                                                    <img src={XIcon} className="action-icon" alt="Cancelar"></img>
                                                </button>
                                            </>
                                        }>
                                            <div className="list-row-data">
                                                <span>{appointment.name}</span>
                                                <span>{appointment.scheduling_type}</span>
                                                <span>{formattedDate}</span>
                                                <span>{formattedTime}</span>
                                                <span>{appointment.status}</span>
                                            </div>
                                        </List_Item>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {/* 7: Botão de adicionar datas disponíveis */}
                    <Button className='btn-add-date' onClick={addSchedulingDate}>Adicionar datas disponíveis</Button>
                </Container>

                {/* 8: Pop-up de adicionar/remover datas de agendamento disponíveis */}
                {isAddDateModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsAddDateModalOpen(false)}>
                        <Card className='add-remove-date-card' onClick={(e) => e.stopPropagation()}>
                            <button className="date-x-btn" onClick={() => setIsAddDateModalOpen(false)}>
                                <img src={XIcon} className="date-x-btn-img" alt="Fechar"></img>
                            </button>

                            <h3>Datas disponíveis</h3>

                            <form className='add-date-form' onSubmit={handleSaveAvailableDate}>
                                <div className='input-group'>
                                    <label>Escolha o dia e o horário:</label>
                                    <input
                                        type='datetime-local'
                                        value={dateTimeInput}
                                        onChange={(e) => setDateTimeInput(e.target.value)}
                                        required
                                    />

                                    {/* 9: Botão de adicionar data disponível */}
                                    <Button type='submit' className='btn-confirm-date'>+</Button>
                                </div>
                            </form>

                            {/* 10: Scroll area das datas adicionadas */}
                            <div className='add-remove-date-scroll-area'>
                                {availableDates.length === 0 ? (
                                    <p className="empty-dates-text">Nenhuma data cadastrada.</p>
                                ) : (
                                    availableDates.map((data, index) => (
                                        <List_Item key={index} actions={
                                            <button
                                                className="icon-btn x-btn"
                                                onClick={() => handleDeleteAvailableDate(data)}
                                            >
                                                <img src={XIcon} className="action-icon" alt="Remover"></img>
                                            </button>
                                        }>
                                            <div className="list-row-data date-only-row">
                                                <span>{formatBrazilianDate(data)}</span>
                                            </div>
                                        </List_Item>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Scheduling_Panel