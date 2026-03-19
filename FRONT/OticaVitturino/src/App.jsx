import './App.css'
import Header from './components/header'
import Side_Menu from './components/side-menu'
import Box_Container from './components/container'
import Input from './components/input'
import Button from './components/button'
import CheckIcon from './assets/user-round-check.png'

function App() {

  return (
    <div className="page-container">

      <Header />

      <Side_Menu />

      <Box_Container className="main-container">

        <h2>Gerencie aqui seus usuários</h2>

        <div className='content-wrapper'>

          <Box_Container className="user-registration-container">

            <h3>Cadastrar usuário</h3>

            <form className="user-registration-form">

              <Input placeholder="Login" type="text" required />

              <Input placeholder="Nome" type="text" required />

              <Input placeholder="Data de nascimento" type="date" required />

              <Input placeholder="Senha" type="password" required />

              <img src={CheckIcon} className="check-icon-form" />

              <Button className="btn-register">Cadastrar</Button>

            </form>

          </Box_Container>

          <Box_Container className="registered-users-container">

          </Box_Container>
        </div>

      </Box_Container>
    </div>
  )
}

export default App