import './style.css'
import Layout from '../../components/layout'
import Container from '../../components/container'
import List_Item from '../../components/list-item'
import ReloadIcon from '../../assets/rotate-ccw.png'

function Production_Status_Panel() {
    // Apenas para testes mockados

    const status = [
        {
            id: 1,
            usuario: "Luiza Gurgel",
            produto: "Óculos de Sol Pratti",
            status: "Em produção"
        },
        {
            id: 2,
            usuario: "Pedro Torres",
            produto: "JACK TITANIUM OPTICS",
            status: "Em produção"
        },
        {
            id: 3,
            usuario: "Nádila Correia Costa",
            produto: "Óculos de Grau  Kessy Clássico 315",
            status: "Pedido realizado"
        },
        {
            id: 4,
            usuario: "Francisco Almeida",
            produto: "RB4415VL OPTICS",
            status: "Finalizado"
        },
        {
            id: 5,
            usuario: "Clara Costa",
            produto: "Óculos de Sol Unissex Prada Redondo...",
            status: "Pedido realizado"
        },
        {
            id: 6,
            usuario: "Hector Soares",
            produto: "RB7307M OPTICS SCUDERIA FERRARI C...",
            status: "Em produção"
        }
    ];

    return (
        <Layout>
            <div className='production-page-wrapper'>
                {/* 1: Container externo */}
                <Container className='main-container-production-status-panel'>

                    {/* 2: Título */}
                    <h2>Gerencie aqui o status de produção</h2>

                    {/* 3: Área de scroll / List item de teste mockado */}
                    <div className='production-scroll-area'>

                        {/* 4: Legendas */}
                        <div className='list-legend'>
                            <span>Usuário</span>
                            <span>Produto</span>
                            <span>Status</span>
                            <span></span>
                        </div>

                        {/* 5: Ícone de ação */}
                        {status.map((status) => (
                            <List_Item key={status.id} actions={
                                <>
                                    <button className="icon-btn chart-btn">
                                        <img src={ReloadIcon} className="action-icon"></img>
                                    </button>
                                </>
                            }>

                                {/* 6: Dados de cada usuário */}
                                <div className="list-row-data">
                                    <span>{status.usuario}</span>
                                    <span>{status.produto}</span>
                                    <span>{status.status}</span>
                                    <span></span>
                                </div>

                            </List_Item>
                        ))}
                    </div>
                </Container>
            </div>
        </Layout>
    )
}

export default Production_Status_Panel