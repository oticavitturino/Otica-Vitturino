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

  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      email: "caiovtech@outlook.com",
      password: "123456"
    },
    {
      id: 2,
      email: "danieldanielsilva08@gmail.com",
      password: "123456"
    }
  ]

  function checkLogin(event) {
    event.preventDefault();

    const userFound = users.find(
      (user) => user.email === emailInput && user.password === passwordInput
    );

    if (userFound) {
      navigate('/home');
    } else {
      setShowError(true);
    }
  }

  return (
    <div className='login-page-wrapper'>

      <img className='login-logo' src={LogoVitturino}></img>

      <Container className='login-container'>

        <h2>Fazer Login</h2>

        <form className='login-form' onSubmit={checkLogin}>
          <Input placeholder='Digite seu e-mail' type='email' value={emailInput} onChange={(event) => setEmailInput(event.target.value)} required />
          <Input placeholder='Digite sua senha' type='password' value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)} required />
          <Button className='btn-enter' type='submit'>Entrar</Button>
        </form>

      </Container>

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