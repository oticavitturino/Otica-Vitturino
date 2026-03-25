import './style.css'
import Header from '../../components/header'
import Side_Menu from '../../components/side-menu'
import Container from '../../components/container'
import List_Item from '../../components/list-item'
import PenIcon from '../../assets/pen.png'

function Message_Editor() {
    // Mensagens pré-programadas

    const mensagens = [
        {
            id: 1,
            texto: "15 dias:\nOlá, usuário! Como está sendo sua adaptação com o produto?\nComo você avalia nosso serviço até então?"
        },
        {
            id: 2,
            texto: "30 dias:\nComo vai, usuário? Está precisando de algum suporte ou\norientações de como manusear seu produto? Me conta aqui!"
        },
        {
            id: 3,
            texto: "3 meses:\nUsuário, já se passaram 3 meses da sua aquisição!\nQue tal fazer aquele check-up para garantir a longevidade do seu produto?"
        },
        {
            id: 4,
            texto: "6 meses:\n6 meses já se passaram, o que acha de fazer uma\nrevisão no seu produto?"
        },
        {
            id: 5,
            texto: "Aniversário:\nHoje é seu dia, usuário! Nós da Ótica Vitturino desejamos a você um dia\nabençoado e um feliz aniversário!\nQue sua vida seja repleta de felicidade!"
        }
    ];

    return (
        <div className='page-container'>

            <Header />

            <Side_Menu />

            <Container className='main-container-message-editor'>

                <h2>Editor de Mensagens Pré-Programadas</h2>

                <div className="messages-scroll-area">
                    {mensagens.map((msg) => (
                        <List_Item key={msg.id} actions={
                            <button className="icon-btn edit-btn">
                                <img src={PenIcon} className="action-icon" alt="Editar"></img>
                            </button>
                        }>
                            <span className="message-text">{msg.texto}</span>
                        </List_Item>
                    ))}
                </div>

            </Container>

        </div>
    )

}

export default Message_Editor