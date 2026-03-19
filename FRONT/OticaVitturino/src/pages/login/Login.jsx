import './style.css'
import Button from '../../components/button'
import Input from '../../components/input'
import Box_Container from '../../components/container'
import LogoVitturino from '../../assets/upscalemedia-transformed.png'

function Login() {

  return (
    <div className="page-container">
      <img className="logo" src={LogoVitturino}></img>

      <Container maxWidth="750px">

        <h2>Fazer Login</h2>

        <form>
          <Input placeholder="Digite seu e-mail" type="email" required/>

          <Input placeholder="Digite sua senha" type="password" required/> 

          <Button className="btn-enter">Entrar</Button>

        </form>

      </Container>
    </div>
  )
}

export default Login