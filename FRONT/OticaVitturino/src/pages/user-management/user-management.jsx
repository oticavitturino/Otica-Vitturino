import './style.css'
import Layout from '../../components/layout'
import Container from '../../components/container'
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
    },
    {
      id: 3,
      nome: "Pablo Costa",
      login: "p_costa"
    },
    {
      id: 4,
      nome: "Raquel Souza",
      login: "rahsouza"
    },
    {
      id: 5,
      nome: "Marina Sampaio",
      login: "marinasamp"
    },
    {
      id: 6,
      nome: "Douglas Henrique",
      login: "doug_henrique"
    },
    {
      id: 7,
      nome: "Silvia Pamplona Matos",
      login: "silvia_p_m"
    },
    {
      id: 8,
      nome: "João César",
      login: "johncesar"
    },
    {
      id: 9,
      nome: "Humberto Filho",
      login: "humberto_f"
    },
    {
      id: 10,
      nome: "Gabriel Coelho",
      login: "gabcoelho"
    },
    {
      id: 11,
      nome: "Marcos de Paula",
      login: "marcos_p"
    },
    {
      id: 12,
      nome: "Samara Rodrigues",
      login: "samara_rod"
    }
  ]

  return (
    <Layout>
      <div className='user-management-wrapper'>

        <Container className='main-container-user-management'>

          <h2>Gerencie aqui seus usuários</h2>

          <div className='content-wrapper'>

            <Container className='user-registration-container'>

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

            </Container>

            <Container className='registered-users-container'>

              <h3>Usuários registrados</h3>

              {/* List item de teste mockado */}

              <div className='user-management-scroll-area'>
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
              </div>

            </Container>

          </div>

        </Container>
        
      </div>
    </Layout>
  )
}

export default User_Management