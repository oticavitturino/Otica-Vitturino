import './style.css'
import Header from '../../components/header'
import Side_Menu from '../../components/side-menu'
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
        <div className='page-container'>

            <Header />

            <Side_Menu />

            <Container className='main-container-production-status-panel'>

                <h2>Gerencia aqui o status de produção</h2>

                <div className='list-legend'>
                    <span>Usuário</span>
                    <span>Produto</span>
                    <span>Status</span>
                    <span></span>
                </div>

                {/* List item de teste mockado */}

                {status.map((status) => (
                    <List_Item key={status.id} actions={
                        <>
                            <button className="icon-btn chart-btn">
                                <img src={ReloadIcon} className="action-icon"></img>
                            </button>
                        </>
                    }>

                        <div className="list-row-data">
                            <span>{status.usuario}</span>
                            <span>{status.produto}</span>
                            <span>{status.status}</span>
                            <span></span>
                        </div>

                    </List_Item>
                ))}

            </Container>

        </div>

    )
}

export default Production_Status_Panel