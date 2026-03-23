import './style.css'
import Button from '../../components/button'
import Input from '../../components/input'
import Container from '../../components/container'
import LogoVitturino from '../../assets/upscalemedia-transformed.png'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate();

  return (
    <div className='page-container'>

      <img className='login-logo' src={LogoVitturino}></img>

      <Container className='login-container'>

        <h2>Fazer Login</h2>

        <form className='login-form'>

          <Input placeholder='Digite seu e-mail' type='email' required />

          <Input placeholder='Digite sua senha' type='password' required />

          <Button className='btn-enter' onClick={() => navigate('/home')}>Entrar</Button>

        </form>

      </Container>
    </div>
  )
}

export default Login