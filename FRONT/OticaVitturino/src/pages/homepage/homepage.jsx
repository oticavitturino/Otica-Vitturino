import './style.css'
import Header from '../../components/header'
import Side_Menu from '../../components/side-menu'
import Illustration from '../../public/img/JEMA-GER-1740-05.png'

function Homepage() {

  return (
    <div className='page-container'>
      <Header/>      
      <Side_Menu/>
      <div className='welcome-container'>
        <h2>Olá, <span>admin</span>!</h2>
        <img className='illustration' src={Illustration}/>
      </div>
    </div>
  )
}

export default Homepage