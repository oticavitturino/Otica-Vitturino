import './style.css'
import Header from '../../components/header'
import Side_Menu from '../../components/side-menu'
import Box_Container from '../../components/container'
import Input from '../../components/input'
import Button from '../../components/button'
import List_item from '../../components/list-item'
import CheckIcon from '../../assets/user-round-check.png'
import PenIcon from '../../assets/pen.png'
import TrashIcon from '../../assets/trash-2.png'

function User_Management() {
// Apenas para testes mockados

  const users = [
    {
      id: 1,
      nome: "Carlos Viana",
      login: "carlos_v04"
    },

    {
      id: 2,
      nome: "Maria Heloisa",
      login: "marihelo07"
    }
  ]

  return (
    <div className='page-container'>

      <Header />

      <Side_Menu />

      <Box_Container className='main-container'>

        <h2>Gerencie aqui seus usuários</h2>

        <div className='content-wrapper'>

          <Box_Container className='user-registration-container'>

            <h3>Cadastrar usuário</h3>

            <form className='user-registration-form' type='submit'>

              <Input placeholder='Login' type='text' required />

              <Input placeholder='Nome' type='text' required />

              <Input placeholder='E-mail' type='email' required />

              <Input placeholder='Senha' type='password' required />

              <Input placeholder='Data de nascimento' type='date' required />

              <img src={CheckIcon} className='check-icon-form' />

              <Button className='btn-register'>Cadastrar</Button>

            </form>

          </Box_Container>

          <Box_Container className='registered-users-container'>

            <h3>Usuários registrados</h3>

            {/* List item de teste mockado */}

            {users.map((user) => (
              <List_item key={user.id} actions={
                <>
                  <button className="icon-btn edit-btn">
                    <img src={PenIcon} alt="Editar usuário" className="action-icon" />
                  </button>

                  <button className="icon-btn delete-btn">
                    <img src={TrashIcon} alt="Excluir usuário" className="action-icon" />
                  </button>
                </>
              }>{user.nome} | {user.login}</List_item>
            ))}

          </Box_Container>

        </div>

      </Box_Container>
    </div>
  )
}

export default User_Management