import './style.css'
import Button from '../../components/button'
import Input from '../../components/input'
import Container from '../../components/container'
import Card from '../../components/card'
import LogoVitturino from '../../assets/logovitturino-full.png'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Login() {

    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Função de checkagem de login
    async function handleLogin(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailInput,
                    password: passwordInput
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                setShowError(true);
            }
        } catch (error) {
            console.error("Erro de requisição: ", error);
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='login-page-wrapper'>
            {/* 1: Imagem da logo */}
            <img className='login-logo' src={LogoVitturino}></img>

            {/* 2: Container externo */}
            <Container className='login-container'>

                {/* 3: Título */}
                <h2>Fazer Login</h2>

                {/* 4: Formulário de login */}
                <form className='login-form' onSubmit={handleLogin}>
                    <Input placeholder='Digite seu e-mail' type='email' value={emailInput} onChange={(event) => setEmailInput(event.target.value)} required />
                    <Input placeholder='Digite sua senha' type='password' value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)} required />
                    <Button className='btn-enter' type='submit' disabled={isLoading}>
                        {isLoading ? <span className="spinner"></span> : 'Entrar'}
                    </Button>
                </form>

            </Container>

            {/* 5: Card de erro de login */}
            {showError && (
                <div className="modal-overlay">
                    <Card className="error-card">
                        <h3>Acesso Negado</h3>
                        <p>E-mail ou senha incorretos. Tente novamente.</p>
                        <Button onClick={() => setShowError(false)} className="btn-ok">
                            OK
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default Login