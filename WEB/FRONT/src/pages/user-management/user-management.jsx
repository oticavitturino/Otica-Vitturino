import './style.css'
import Layout from '../../components/layout'
import Container from '../../components/container'
import Input from '../../components/input'
import Button from '../../components/button'
import List_item from '../../components/list-item'
import Card from '../../components/card'
import PenIcon from '../../assets/pen.png'
import XIcon from '../../assets/x.png'
import { useState, useEffect } from 'react'

function User_Management() {

  const [dateInputType, setDateInputType] = useState('text');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    birthDate: '',
    referralCode: ''
  });
  const [users, setUsers] = useState([]);
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    birthDate: ''
  });

  // Função para atualizar os dados do formulário a cada digitação
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para atualizar os dados do formulário de edição a cada digitação
  const handleUpdateInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  // Função de abrir pop-up de edição preenchido com os dados do cliente
  function openUpdateModal(user) {
    setUpdateData({
      id: user.id || '',
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      birthDate: user.birthDate || ''
    });
    setIsUpdateModalOpen(true);
  }

  // Função para buscar todos os clientes
  async function fetchAllUsers() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/customer/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        alert('Erro ao buscar clientes.');
      }
    } catch (error) {
      console.error('Erro de requisição: ', error);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Função para registrar novo usuário
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
          profile: 'CUSTOMER',
          referralCode: formData.referralCode
        })
      });

      if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
        setFormData({ name: '', email: '', password: '', phone: '', address: '', birthDate: '', referralCode: '' });
        setDateInputType('text');
        setShowReferralInput(false);
        fetchAllUsers();
      } else {
        alert('Erro ao cadastrar usuário. Verifique os dados.');
      }
    } catch (error) {
      console.error('Erro de requisição: ', error);
    }
  }

  // Função para atualizar dados de um usuário cadastrado
  async function handleUpdateUser(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const url = `http://localhost:8080/customer/update?id=${updateData.id}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updateData.name,
          phone: updateData.phone,
          address: updateData.address,
          birthDate: updateData.birthDate
        })
      });

      if (response.ok) {
        alert('Dados do cliente atualizados com sucesso!');
        setIsUpdateModalOpen(false);
        fetchAllUsers();
      } else {
        alert('Falha ao atualizar os dados do cliente.');
      }
    } catch (error) {
      console.error('Erro de requisição: ', error);
    }
  }

  return (
    <Layout>
      <div className='user-management-wrapper'>
        <Container className='main-container-user-management'>
          <h2>Gerencie aqui seus usuários</h2>
          <div className='content-wrapper'>
            <Container className='user-registration-container'>
              <h3>Cadastrar usuário</h3>
              <form className='user-registration-form' onSubmit={handleUserRegistration}>
                <Input placeholder='Nome' type='text' name='name' value={formData.name} onChange={handleInputChange} required />
                <Input placeholder='E-mail' type='email' name='email' value={formData.email} onChange={handleInputChange} required />
                <Input placeholder='Senha' type='password' name='password' value={formData.password} onChange={handleInputChange} required />
                <Input placeholder='Telefone' type='tel' name='phone' value={formData.phone} onChange={handleInputChange} required />
                <Input placeholder='Endereço' type='text' name='address' value={formData.address} onChange={handleInputChange} required />

                <div className='input-row-inline'>
                  <Input
                    placeholder='Data de nascimento'
                    type={dateInputType}
                    name='birthDate'
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    max='9999-12-31'
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

                  {!showReferralInput ? (
                    <button
                      type='button'
                      className='btn-show-referral'
                      onClick={() => setShowReferralInput(true)}
                    >
                      + Código
                    </button>
                  ) : (
                    <Input
                      placeholder='Cód. (Opcional)'
                      type='text'
                      name='referralCode'
                      value={formData.referralCode}
                      onChange={handleInputChange}
                    />
                  )}
                </div>

                <Button className='btn-register' type='submit'>Cadastrar</Button>
              </form>
            </Container>

            <Container className='registered-users-container'>
              <h3>Usuários registrados</h3>
              <div className='user-management-scroll-area'>
                {users.length === 0 ? (
                  <p className='empty-state-text'>Nenhum usuário cadastrado.</p>
                ) : (
                  users.map((user) => (
                    <List_item key={user.id} actions={
                      <>
                        <button className='icon-btn' onClick={() => openUpdateModal(user)}>
                          <img src={PenIcon} className='action-icon' alt='Editar usuário' />
                        </button>
                      </>
                    }>
                      <span>{user.name} | {user.email}</span>
                    </List_item>
                  ))
                )}
              </div>

              {isUpdateModalOpen && (
                <div className='modal-overlay' onClick={() => setIsUpdateModalOpen(false)}>
                  <Card className='edit-user-card' onClick={(e) => e.stopPropagation()}>
                    <button className='x-btn' onClick={() => setIsUpdateModalOpen(false)}>
                      <img src={XIcon} className='x-btn-img' alt='Fechar'></img>
                    </button>

                    <h3 className='edit-user-title'>
                      Editar Cliente
                    </h3>

                    <form className='edit-user-form' onSubmit={handleUpdateUser}>
                      <div className='input-group'>
                        <label>Nome:</label>
                        <Input
                          placeholder='Nome do cliente'
                          type='text'
                          name='name'
                          value={updateData.name}
                          onChange={handleUpdateInputChange}
                          required
                        />
                      </div>

                      <div className='input-group'>
                        <label>Telefone:</label>
                        <Input
                          placeholder='Telefone de contato'
                          type='tel'
                          name='phone'
                          value={updateData.phone}
                          onChange={handleUpdateInputChange}
                          required
                        />
                      </div>

                      <div className='input-group'>
                        <label>Endereço:</label>
                        <Input
                          placeholder='Endereço residencial'
                          type='text'
                          name='address'
                          value={updateData.address}
                          onChange={handleUpdateInputChange}
                          required
                        />
                      </div>

                      <div className='input-group'>
                        <label>Data de Nascimento:</label>
                        <Input
                          placeholder='Data de nascimento'
                          type='date'
                          name='birthDate'
                          value={updateData.birthDate}
                          onChange={handleUpdateInputChange}
                          max='9999-12-31'
                          required
                        />
                      </div>

                      <Button type='submit' className='btn-save-user'>
                        Salvar Alterações
                      </Button>
                    </form>
                  </Card>
                </div>
              )}
            </Container>
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export default User_Management