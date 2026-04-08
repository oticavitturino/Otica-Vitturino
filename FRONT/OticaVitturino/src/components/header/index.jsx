import './style.css'
import LogoVitturino from '../../assets/upscalemedia-transformed.png'
import MenuIcon from '../../assets/menu.png'

function Header({ toggleMenu }) {

    return (
        <div className='header'>
            <button className="hamburger-btn" onClick={toggleMenu}>
                <img src={MenuIcon} alt="Abrir Menu" />
            </button>

            <img className="header-logo" src={LogoVitturino}></img>
        </div>
    )
}

export default Header