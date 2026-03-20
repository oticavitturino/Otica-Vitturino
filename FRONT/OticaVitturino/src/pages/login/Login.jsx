import './style.css'
import Button from '../../components/button'
import Input from '../../components/input'
import Box_Container from '../../components/container'
import LogoVitturino from '../../assets/upscalemedia-transformed.png'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate();

  return (
    <div className='page-container'>

      <img className='logo' src={LogoVitturino}></img>

      <Box_Container className='login-container' maxWidth='700px'>

        <h2>Fazer Login</h2>

        <form>

          <Input placeholder='Digite seu e-mail' type='email' required />

          <Input placeholder='Digite sua senha' type='password' required />

          <Button className='btn-enter' onClick={() => navigate('/home')}>Entrar</Button>

        </form>

      </Box_Container>
    </div>
  )
}

export default Login