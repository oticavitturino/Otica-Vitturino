import './style.css'
import Button from './components/button'
import Input from './components/input'
import Container from './components/container'
import LogoVitturino from './assets/upscalemedia-transformed.png'

function Login() {

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.2), rgba(190, 190, 190, 0.8)), url('/img/pexels-steve-29506613.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }

  const logoStyle = {
    width: "22%",
    marginBottom: "90px"
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "100%"
  }

  const titleStyle = {
    color: "#1DA299",
    textAlign: "center",
    marginBottom: "30px",
    fontFamily: "Poppins, sans-serif",
    fontSize: "28px",
    marginTop: "30px",
    marginBottom: "60px"
  }

  return (
    <div style={pageStyle}>

      <img src={LogoVitturino} style={logoStyle}></img>

      <Container width="780px">

        <h2 style={titleStyle}>Fazer Login</h2>

        <form style={formStyle}>

          <Input 
            placeholder="Digite seu e-mail"
            type="email"
            width="350px"
            required
          />

          <Input 
            placeholder="Digite sua senha"
            type="password"
            width="350px"
            required
          />

          <div style={{ marginTop: "30px", marginBottom: "30px" }}>
            <Button type="submit" width="350px">Entrar</Button>
          </div>

        </form>
      </Container>

    </div>
  )
}

export default Login