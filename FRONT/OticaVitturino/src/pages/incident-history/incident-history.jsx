import './style.css'
import Header from '../../components/header'
import Side_Menu from '../../components/side-menu'
import Container from '../../components/container'
import List_Item from '../../components/list-item'
import ReplyIcon from '../../assets/message-square-reply.png'
import TrashIcon from '../../assets/trash-2.png'


function Incident_History() {
    // Apenas para testes mockados

    const ocorrencia = [
        {
            id: 1,
            usuario: "Luiza Amanda Vasconcelos",
            categoria: "Ocorrência",
            descricao: "O parafuso da lateral direita do óculos quebrou",
            data: "11/03/2026"
        },
        {
            id: 2,
            usuario: "Guilherme Alves",
            categoria: "Reclamação",
            descricao: "Eu estou achando que meu óculos está demorando demais p...",
            data: "28/01/2026"
        },
        {
            id: 3,
            usuario: "Carlos Viana",
            categoria: "Ocorrência",
            descricao: "Meu óculos está emperrando quando tento fechar ele",
            data: "04/02/2026"
        }
    ];

    return (
        <div className='page-container'>

            <Header />

            <Side_Menu />

            <Container className='main-container-incident-history'>

                <h2>Gerencie aqui as ocorrências/reclamações</h2>

                {/* List item de teste mockado */}

                <div className='incident-scroll-area'>

                    <div className='list-legend'>
                        <span>Usuário</span>
                        <span>Categoria</span>
                        <span>Descrição</span>
                        <span>Data</span>
                        <span></span>
                    </div>

                    {ocorrencia.map((ocorrencia) => (
                        <List_Item key={ocorrencia.id} actions={
                            <>
                                <button className="icon-btn chart-btn">
                                    <img src={ReplyIcon} className="action-icon"></img>
                                </button>

                                <button className="icon-btn chart-btn">
                                    <img src={TrashIcon} className="action-icon"></img>
                                </button>
                            </>
                        }>

                            <div className="list-row-data">
                                <span>{ocorrencia.usuario}</span>
                                <span>{ocorrencia.categoria}</span>
                                <span>{ocorrencia.descricao}</span>
                                <span>{ocorrencia.data}</span>
                                <span></span>
                            </div>

                        </List_Item>
                    ))}
                </div>

            </Container>

        </div>
    )

}

export default Incident_History