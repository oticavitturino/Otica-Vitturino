import './style.css'
import Layout from '../../components/layout'
import Container from '../../components/container'
import List_Item from '../../components/list-item'
import Button from '../../components/button'
import Card from '../../components/card'
import ReloadIcon from '../../assets/rotate-ccw.png'
import XIcon from '../../assets/x.png'
import { useState, useEffect } from 'react'

function Production_Status_Panel() {

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        orderStatus: 'REALIZADO',
        customerId: ''
    })
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateData, setUpdateData] = useState({
        orderId: '',
        newStatus: 'REALIZADO',
        customerName: ''
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Função para atualizar o estado quando o usuário digitar algo
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    // Função para abrir pop-up ao clicar no botão "Adicionar produto"
    function addProduct() {
        setIsAddProductModalOpen(true);
    }

    // Função para abrir pop-up de atualizar status
    function openUpdateModal(order) {
        const clientName = customers.find(c => c.id === order.customerId)?.name || `ID: ${order.customerId}`;

        setUpdateData({
            orderId: order.id,
            newStatus: 'REALIZADO',
            customerName: clientName
        });
        setIsUpdateModalOpen(true);
    }

    // Função para abrir o pop-up de deletar produto
    function openDeleteModal(order) {
        const clientName = customers.find(c => c.id === order.customerId)?.name || `ID: ${order.customerId}`;

        setItemToDelete({ ...order, customerName: clientName });
        setIsDeleteModalOpen(true);
    }

    // Função de buscar todos os clientes (para adicionar o nome ao lado do ID para ficar visivelmente melhor de identificar)
    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await fetch('http://localhost:8080/users');
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                }
            } catch (error) {
                console.error('Erro de requisição: ', error);
            }
        }
        fetchCustomers();
    }, []);

    // Função para buscar todos os produtos em produção
    async function fetchAllProducts() {
        try {
            const response = await fetch('http://localhost:8080/orders/getAllOrders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error('Falha ao buscar produtos.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    useEffect(() => {
        fetchAllProducts();
    }, []);

    // Função para adicionar novo produto
    async function handleAddProduct(event) {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/orders/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    orderStatus: formData.orderStatus,
                    customerId: Number(formData.customerId)
                })
            });

            if (response.ok) {
                alert('Produto adicionado com sucesso!');
                setFormData({ name: '', orderStatus: 'REALIZADO', customerId: '' })
                setIsAddProductModalOpen(false);
                fetchAllProducts();
            } else {
                alert('Erro ao adicionar produto.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    // Função para modificar status do produto
    async function updateProductStatus(event) {
        event.preventDefault();

        const url = `http://localhost:8080/orders/modifyOrderStatus?orderId=${updateData.orderId}&newStatus=${updateData.newStatus}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Status atualizado com sucesso!');
                setIsUpdateModalOpen(false);
                fetchAllProducts();
            } else {
                alert('Erro ao atualizar status.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    // Função para deletar produto da lista
    async function confirmDeleteProduct(event) {
        event.preventDefault();

        if (!itemToDelete) return;

        const url = `http://localhost:8080/orders/deleteOrder?orderId=${itemToDelete.id}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Produto removido com sucesso!');
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
                fetchAllProducts();
            } else {
                alert('Erro ao remover produto.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    return (
        <Layout>
            <div className='production-page-wrapper'>
                {/* 1: Container externo */}
                <Container className='main-container-production-status-panel'>

                    {/* 2: Título */}
                    <h2>Gerencie aqui o status de produção</h2>

                    {/* 3: Área de scroll */}
                    <div className='production-scroll-area'>
                        {orders.length === 0 ? (
                            <p className='empty-state-text'>Nenhum produto em produção no momento.</p>
                        ) : (
                            <>
                                {/* 4: Legendas */}
                                <div className='list-legend'>
                                    <span>Usuário</span>
                                    <span>Produto</span>
                                    <span>Status</span>
                                    <span></span>
                                </div>

                                {/* 5: Ícones de ação e renderização da lista */}
                                {orders.map((item) => {
                                    // Procura o nome do cliente na lista de usuários através do ID
                                    const clientName = customers.find(c => c.id === item.customerId)?.name || `ID: ${item.customerId}`;

                                    return (
                                        <List_Item key={item.id} actions={
                                            <>
                                                <button className='icon-btn' onClick={() => openUpdateModal(item)}>
                                                    <img src={ReloadIcon} className='action-icon' alt="Atualizar"></img>
                                                </button>

                                                <button className='icon-btn' onClick={() => openDeleteModal(item)}>
                                                    <img src={XIcon} className='action-icon' alt="Deletar"></img>
                                                </button>
                                            </>
                                        }>
                                            {/* 6: Dados vindos das propriedades do seu OrderDTO */}
                                            <div className='list-row-data'>
                                                <span>{clientName}</span>
                                                <span>{item.name}</span>
                                                <span>{item.orderStatus}</span>
                                                <span></span>
                                            </div>
                                        </List_Item>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {/* 7: Botão de adicionar produto */}
                    <Button className='btn-add-product' onClick={addProduct}>Adicionar produto</Button>

                    {/* 8: Pop-up de adicionar produto */}
                    {isAddProductModalOpen && (
                        <div className='modal-overlay' onClick={() => setIsAddProductModalOpen(false)}>
                            <Card className='add-product-card' onClick={(e) => e.stopPropagation()}>
                                <button className='x-btn' onClick={() => setIsAddProductModalOpen(false)}>
                                    <img src={XIcon} className='x-btn-img' alt='Fechar'></img>
                                </button>

                                <h3>Adicione um novo produto</h3>

                                <form className='add-product-form' onSubmit={handleAddProduct}>
                                    {/* Nome do produto */}
                                    <div className='input-group'>
                                        <label>Nome do Produto:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ex: Óculos de Grau"
                                        />
                                    </div>

                                    {/* Cliente */}
                                    <div className='input-group'>
                                        <label>Cliente:</label>
                                        <select
                                            name="customerId"
                                            value={formData.customerId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" disabled>Selecione um cliente...</option>

                                            {customers.map((customer) => (
                                                <option key={customer.id} value={customer.id}>
                                                    {customer.name} (ID: {customer.id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className='input-group'>
                                        <label>Status do Pedido:</label>
                                        <select
                                            name="orderStatus"
                                            value={formData.orderStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="REALIZADO">Pedido Realizado</option>
                                            <option value="EM_ANDAMENTO">Em Andamento</option>
                                            <option value="CONCLUIDO">Finalizado</option>
                                        </select>
                                    </div>

                                    <Button type="submit" className='btn-confirm-product'>Adicionar</Button>
                                </form>
                            </Card>
                        </div>
                    )}

                    {/* 9: Pop-up de atualizar status do produto */}
                    {isUpdateModalOpen && (
                        <div className='modal-overlay' onClick={() => setIsUpdateModalOpen(false)}>
                            <Card className='update-status-card' onClick={(e) => e.stopPropagation()}>
                                <button className='x-btn' onClick={() => setIsUpdateModalOpen(false)}>
                                    <img src={XIcon} className='x-btn-img' alt='Fechar'></img>
                                </button>

                                <h3>Atualizar Status do Pedido</h3>
                                <p>Pedido ID: <b>{updateData.orderId}</b> | Cliente: <b>{updateData.customerName}</b></p>

                                <form className='update-status-form' onSubmit={updateProductStatus}>

                                    <div className='input-group'>
                                        <label>Novo Status:</label>
                                        <select
                                            value={updateData.newStatus}
                                            onChange={(e) => setUpdateData({ ...updateData, newStatus: e.target.value })}
                                            required
                                        >
                                            <option value='REALIZADO'>Pedido Realizado</option>
                                            <option value='EM_ANDAMENTO'>Em Andamento</option>
                                            <option value='CONCLUIDO'>Finalizado</option>
                                        </select>
                                    </div>

                                    <Button type='submit' className='btn-update-status'>Atualizar</Button>
                                </form>
                            </Card>
                        </div>
                    )}

                    {/* 10: Pop-up de delete de produto */}
                    {isDeleteModalOpen && itemToDelete && (
                        <div className='modal-overlay' onClick={() => setIsDeleteModalOpen(false)}>
                            <Card className='delete-product-card' onClick={(e) => e.stopPropagation()}>
                                <button className='x-btn' onClick={() => setIsDeleteModalOpen(false)}>
                                    <img src={XIcon} className='x-btn-img' alt='Fechar'></img>
                                </button>

                                <h3>Excluir Pedido</h3>

                                <p style={{ fontFamily: 'Poppins', color: '#666', fontSize: '1.05rem', margin: '15px 0' }}>
                                    Tem certeza que deseja apagar o pedido <b>{itemToDelete.id}</b> do(a) cliente <b>{itemToDelete.customerName}</b>? <br />
                                    <span style={{ fontSize: '0.9rem', color: '#c0392b' }}>Esta ação não pode ser desfeita.</span>
                                </p>

                                <div className='delete-btn-group'>
                                    <button className='btn-cancel-delete' onClick={() => setIsDeleteModalOpen(false)}>
                                        Cancelar
                                    </button>
                                    <button className='btn-confirm-delete' onClick={confirmDeleteProduct}>
                                        Sim, apagar
                                    </button>
                                </div>
                            </Card>
                        </div>
                    )}
                </Container>
            </div>
        </Layout>
    )
}

export default Production_Status_Panel