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

    // Função para atualizar o estado quando o usuário digitar algo
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    // Função de abrir pop-up ao clicar no botão "Adicionar produto"
    function addProduct() {
        setIsAddProductModalOpen(true);
    }

    // Função para abrir o modal já com o ID e nome do client do pedido clicado
    function openUpdateModal(order) {
        setUpdateData({ orderId: order.id, newStatus: 'REALIZADO', customerName: order.usuario });
        setIsUpdateModalOpen(true);
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

    // Função de adicionar novo produto
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
            } else {
                alert('Erro ao adicionar produto.');
            }
        } catch (error) {
            console.log('Erro de requisição: ', error);
        }
    }

    // Função de modificar status do pedido
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
            } else {
                alert('Erro ao atualizar status.');
            }
        } catch (error) {
            console.log('Erro de requisição: ', error);
        }
    }

    // Apenas para testes mockados

    const status = [
        {
            id: 1,
            usuario: "Luiza Gurgel",
            produto: "Óculos de Sol Pratti",
            status: "Em produção"
        },
        {
            id: 2,
            usuario: "Pedro Torres",
            produto: "JACK TITANIUM OPTICS",
            status: "Em produção"
        },
        {
            id: 3,
            usuario: "Nádila Correia Costa",
            produto: "Óculos de Grau  Kessy Clássico 315",
            status: "Pedido realizado"
        },
        {
            id: 4,
            usuario: "Francisco Almeida",
            produto: "RB4415VL OPTICS",
            status: "Finalizado"
        },
        {
            id: 5,
            usuario: "Clara Costa",
            produto: "Óculos de Sol Unissex Prada Redondo...",
            status: "Pedido realizado"
        },
        {
            id: 6,
            usuario: "Hector Soares",
            produto: "RB7307M OPTICS SCUDERIA FERRARI C...",
            status: "Em produção"
        },
        {
            id: 7,
            usuario: "Hector Soares",
            produto: "RB7307M OPTICS SCUDERIA FERRARI C...",
            status: "Em produção"
        },
        {
            id: 8,
            usuario: "Hector Soares",
            produto: "RB7307M OPTICS SCUDERIA FERRARI C...",
            status: "Em produção"
        },
        {
            id: 9,
            usuario: "Hector Soares",
            produto: "RB7307M OPTICS SCUDERIA FERRARI C...",
            status: "Em produção"
        },
        {
            id: 10,
            usuario: "Hector Soares",
            produto: "RB7307M OPTICS SCUDERIA FERRARI C...",
            status: "Em produção"
        },
    ];

    return (
        <Layout>
            <div className='production-page-wrapper'>
                {/* 1: Container externo */}
                <Container className='main-container-production-status-panel'>

                    {/* 2: Título */}
                    <h2>Gerencie aqui o status de produção</h2>

                    {/* 3: Área de scroll / List item de teste mockado */}
                    <div className='production-scroll-area'>

                        {/* 4: Legendas */}
                        <div className='list-legend'>
                            <span>Usuário</span>
                            <span>Produto</span>
                            <span>Status</span>
                            <span></span>
                        </div>

                        {/* 5: Ícone de ação */}
                        {status.map((item) => (
                            <List_Item key={item.id} actions={
                                <>
                                    <button className='icon-btn chart-btn' onClick={() => openUpdateModal(item)}>
                                        <img src={ReloadIcon} className='action-icon' alt="Atualizar"></img>
                                    </button>
                                </>
                            }>

                                {/* 6: Dados de cada usuário */}
                                <div className='list-row-data'>
                                    <span>{status.usuario}</span>
                                    <span>{status.produto}</span>
                                    <span>{status.status}</span>
                                    <span></span>
                                </div>

                            </List_Item>
                        ))}
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

                                    {/* Cliente (Select com Nome e ID) */}
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

                                    {/* Select de status */}
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
                                            <option value="REALIZADO">Pedido Realizado</option>
                                            <option value="EM_ANDAMENTO">Em Andamento</option>
                                            <option value="CONCLUIDO">Finalizado</option>
                                        </select>
                                    </div>

                                    <Button type="submit" className='btn-update-status'>Atualizar</Button>
                                </form>
                            </Card>
                        </div>
                    )}
                </Container>
            </div>
        </Layout>
    )
}

export default Production_Status_Panel