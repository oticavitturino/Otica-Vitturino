import './style.css'
import Layout from '../../components/layout'


function Homepage() {

  return (
    <Layout>
      <div className='homepage-wrapper'>

        <div className='welcome-container'>
          <h2>Olá, <span>admin</span>!</h2>
          <img className='illustration' src="/img/JEMA-GER-1740-05.png" alt="Ilustração de boas-vindas" />
        </div>

      </div>
    </Layout>
  )
}

export default Homepage