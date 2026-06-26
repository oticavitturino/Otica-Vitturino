import './style.css'
import { useState } from 'react'
import Layout from '../../components/layout'
import Container from '../../components/container'
import Input from '../../components/input'
import Button from '../../components/button'
import List_item from '../../components/list-item'
import PenIcon from '../../assets/pen.png'
import TrashIcon from '../../assets/trash-2.png'

function User_Management() {

  const [dateInputType, setDateInputType] = useState('text');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    birthDate: ''
  });
  const [users, setUsers] = useState([]);

  // Função para atualizar os dados do formulário a cada digitação
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função de registrar novo usuário
  async function handleUserRegistration(event) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          birthDate: formData.birthDate,
          active: true,
          profile: 'CLIENTE'
        })
      });

      if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
        setFormData({ name: '', email: '', password: '', phone: '', address: '', birthDate: '' });
        setDateInputType('text');
      } else {
        alert('Erro ao cadastrar usuário. Verifique os dados.');
      }
    } catch (error) {
      console.error('Erro de requisição: ', error);
    }
  }

  return (
    <Layout>
      <div className='user-management-wrapper'>
        {/* 1: Container externo */}
        <Container className='main-container-user-management'>

          {/* 2: Título principal */}
          <h2>Gerencie aqui seus usuários</h2>

          {/* 3: Container interno */}
          <div className='content-wrapper'>

            {/* 4: Container de cadastro de usuários */}
            <Container className='user-registration-container'>

              {/* 5: Título secundário 1 */}
              <h3>Cadastrar usuário</h3>

              {/* 6: Formulário de cadastro de usuários */}
              <form className='user-registration-form' onSubmit={handleUserRegistration}>
                <Input placeholder='Nome' type='text' name='name' value={formData.name} onChange={handleInputChange} required />
                <Input placeholder='E-mail' type='email' name='email' value={formData.email} onChange={handleInputChange} required />
                <Input placeholder='Senha' type='password' name='password' value={formData.password} onChange={handleInputChange} required />
                <Input placeholder='Telefone' type='tel' name='phone' value={formData.phone} onChange={handleInputChange} required />
                <Input placeholder='Endereço' type='text' name='address' value={formData.address} onChange={handleInputChange} required />

                <Input
                  placeholder='Data de nascimento'
                  type={dateInputType}
                  name='birthDate'
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (dateInputType !== 'date') {
                      setDateInputType('date');
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setDateInputType('text');
                    }
                  }}
                  required />
                <Button className='btn-register' type='submit'>Cadastrar</Button>
              </form>

            </Container>

            {/* 7: Container de usuários registrados */}
            <Container className='registered-users-container'>

              {/* 8: Título secundário 2 */}
              <h3>Usuários registrados</h3>

              {/* 9: Área de scroll */}
              <div className='user-management-scroll-area'>
                {users.length === 0 ? (
                  <p className="empty-state-text">Nenhum usuário cadastrado.</p>
                ) : (
                  /* 10: Ícones de ação (só renderiza se tiver usuário) */
                  users.map((user) => (
                    <List_item key={user.id} actions={
                      <>
                        <button className="icon-btn edit-btn">
                          <img src={PenIcon} alt="Editar usuário" className="action-icon" />
                        </button>

                        <button className="icon-btn delete-btn">
                          <img src={TrashIcon} alt="Excluir usuário" className="action-icon" />
                        </button>
                      </>
                    }>
                      <span>{user.name} | {user.email}</span>
                    </List_item>
                  ))
                )}                
              </div>
            </Container>
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export default User_Management