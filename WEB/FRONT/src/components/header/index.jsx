import './style.css'
import LogoVitturino from '../../assets/logovitturino-full.png'
import MenuIcon from '../../assets/menu.png'

function Header({ toggleMenu, isOpen }) {

    return (
        <div className='header'>
            <button className={`hamburger-btn ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <img src={MenuIcon} alt="Abrir Menu" />
            </button>

            <img className="header-logo" src={LogoVitturino}></img>
        </div>
    )
}

export default Header