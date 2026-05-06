import './style.css'
import Layout from '../../components/layout'


function Homepage() {

  return (
    <Layout>
      <div className='homepage-wrapper'>
        {/* 1: Container externo (invisível) */}
        <div className='welcome-container'>

          {/* 2: Título */}
          <h2>Olá, <span>admin</span>!</h2>

          {/* 3: Ilustração */}
          <img className='illustration' src="/img/JEMA-GER-1740-05.png" alt="Ilustração de boas-vindas" />
        </div>
      </div>
    </Layout>
  )
}

export default Homepage