import ConfirmationIllustration from '../../assets/ilustracao-de-elogio-desenhada-de-mao.png'

function Confirmation_Email_Template() {
    return (
        // Container
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative',
            zIndex: 0,
            width: '100%',
            height: '100vh',
            padding: '5%',
            backgroundImage: "linear-gradient(rgba(231, 231, 231, 0.5), rgba(231, 231, 231, 0.5)), url('/img/pexels-steve-29506613.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}>

            {/* Título */}
            <h1 style={{
                fontFamily: 'Poppins',
                fontSize: '2.2rem',
                fontWeight: 600,
                color: '#3C7975'
            }}>Seu agendamento foi confirmado com sucesso!</h1>

            {/* Ilustração */}
            <img src={ConfirmationIllustration} style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: 'auto',
                width: '25%',
                objectFit: 'cover',
                zIndex: -1,
                opacity: '0.7'
            }} />
        </div>
    )
}

export default Confirmation_Email_Template