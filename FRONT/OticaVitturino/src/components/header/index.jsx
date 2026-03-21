import './style.css'
import LogoVitturino from '../../assets/upscalemedia-transformed.png'

function Header() {

    return (
        <div className='header'>
            <img className="header-logo" src={LogoVitturino}></img>
        </div>
    )

}

export default Header