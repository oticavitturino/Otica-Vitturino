import './style.css'
import Card from '../card'
import XIcon from '../../assets/x.png'

function CreditsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className='modal-overlay' onClick={onClose}>
            <Card className='credits-card' onClick={(e) => e.stopPropagation()}>
                <button className='x-btn' onClick={onClose} type='button'>
                    <img src={XIcon} className='x-btn-img' alt='Fechar' />
                </button>

                <h3>Atribuição de Recursos Visuais</h3>
                <p className='credits-subtitle'>
                    Agradecimento aos autores dos recursos visuais utilizados nesta aplicação:
                </p>

                <div className='credits-scroll-area'>
                    <div className='credit-item'>
                        <strong>Foto de Fundo 3D:</strong>
                        <p>
                            Foto por Steve via{' '}
                            <a href='https://www.pexels.com' target='_blank' rel='noreferrer'>
                                Pexels
                            </a>{' '}
                            (ID: 29506613)
                        </p>
                    </div>

                    <div className='credit-item'>
                        <strong>Ícone de Engrenagem:</strong>
                        <p>
                            Ícone criado por Freepik via{' '}
                            <a href='https://www.flaticon.com' target='_blank' rel='noreferrer'>
                                Flaticon
                            </a>{' '}
                            (ID: 10945800)
                        </p>
                    </div>

                    <div className='credit-item'>
                        <strong>Ilustrações e Personagens:</strong>
                        <p>
                            Ilustrações e vetores por{' '}
                            <a href='https://www.freepik.com' target='_blank' rel='noreferrer'>
                                Freepik / Magnific
                            </a>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default CreditsModal;
