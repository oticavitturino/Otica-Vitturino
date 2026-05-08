import './style.css'
import Layout from '../../components/layout'
import Container from '../../components/container'
import List_Item from '../../components/list-item'
import Button from '../../components/button'
import XIcon from '../../assets/x.png'
import ChartIcon from '../../assets/file-chart-column.png'

function Scheduling_Panel() {

    // Apenas para testes mockados
    const agendamentos = [
        {
            id: 1,
            usuario: "Luiz Geraldo",
            categoria: "Limpeza",
            data: "20/05/2026",
            hora: "11:30",
            status: "Confirmado"
        },
        {
            id: 2,
            usuario: "Ana Júlia Fonseca",
            categoria: "Consulta",
            data: "21/05/2026",
            hora: "09:00",
            status: "Pendente"
        },
        {
            id: 3,
            usuario: "Marcos Silva",
            categoria: "Limpeza",
            data: "21/05/2026",
            hora: "14:15",
            status: "Confirmado"
        },
        {
            id: 4,
            usuario: "Beatriz Costa",
            categoria: "Manutenção",
            data: "22/05/2026",
            hora: "10:00",
            status: "Cancelado"
        },
        {
            id: 5,
            usuario: "Roberto Carlos",
            categoria: "Consulta",
            data: "23/05/2026",
            hora: "16:45",
            status: "Pendente"
        },
        {
            id: 6,
            usuario: "José Paiva",
            categoria: "Limpeza",
            data: "02/06/2026",
            hora: "10:00",
            status: "Confirmado"
        },
        {
            id: 7,
            usuario: "Rubens da Costa",
            categoria: "Consulta",
            data: "07/07/2026",
            hora: "15:00",
            status: "Pendente"
        },
        {
            id: 8,
            usuario: "Sarah Nunes",
            categoria: "Consulta",
            data: "15/04/2026",
            hora: "14:00",
            status: "Confirmado"
        },
        {
            id: 9,
            usuario: "Cláudio Abrãao",
            categoria: "Manutenção",
            data: "10/04/2026",
            hora: "17:00",
            status: "Confirmado"
        },
        {
            id: 10,
            usuario: "Rose Maria",
            categoria: "Limpeza",
            data: "19/04/2026",
            hora: "09:00",
            status: "Cancelado"
        }
    ];

    function addSchedulingDate() {

    }

    return (
        <Layout>
            <div className='scheduling-page-wrapper'>
                {/* 1: Container externo */}
                <Container className='main-container-scheduling-panel'>

                    {/* 2: Título */}
                    <h2>Gerencie aqui seus agendamentos</h2>

                    {/* 3: Área de scroll / List item de teste mockado */}
                    <div className='scheduling-scroll-area'>

                        {/* 4: Legendas */}
                        <div className='list-legend'>
                            <span>Usuário</span>
                            <span>Categoria</span>
                            <span>Data</span>
                            <span>Hora</span>
                            <span>Status</span>
                            <span></span>
                        </div>

                        {/* 5: Ícones de ação */}
                        {agendamentos.map((agendamento) => (
                            <List_Item key={agendamento.id} actions={
                                <>
                                    <button className="icon-btn chart-btn">
                                        <img src={ChartIcon} className="action-icon"></img>
                                    </button>

                                    <button className="icon-btn x-btn">
                                        <img src={XIcon} className="action-icon"></img>
                                    </button>
                                </>
                            }>

                                {/* 6: Dados de cada usuário */}
                                <div className="list-row-data">
                                    <span>{agendamento.usuario}</span>
                                    <span>{agendamento.categoria}</span>
                                    <span>{agendamento.data}</span>
                                    <span>{agendamento.hora}</span>
                                    <span>{agendamento.status}</span>
                                </div>

                            </List_Item>
                        ))}
                    </div>

                    {/* 7: Botão de adicionar datas disponíveis */}
                    <Button className='btn-add-date' onPress={addSchedulingDate}>Adicionar datas disponíveis</Button>
                </Container>
            </div>
        </Layout>
    )
}

export default Scheduling_Panel