import CancellationIllustration from '../../assets/thumbs-down.png'

function Cancellation_Email_Template() {
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
                color: '#C75C50'
            }}>Seu agendamento foi cancelado!</h1>

            {/* Ilustração */}
            <img src={CancellationIllustration} style={{
                position: 'absolute',
                top: '5%',
                bottom: 0,
                left: 0,
                right: '8%',
                margin: 'auto',
                width: '25%',
                objectFit: 'cover',
                zIndex: -1,
                opacity: '0.7'
            }} />
        </div>
    )
}

export default Cancellation_Email_Template