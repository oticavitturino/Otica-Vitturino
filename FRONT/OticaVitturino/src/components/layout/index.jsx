import { useState } from 'react';
import Header from '../header';
import SideMenu from '../side-menu';

function Layout({ children }) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  return (
    <div className="layout-container">
 
      <Header toggleMenu={toggleMenu} isOpen={isMobileMenuOpen} />
      <SideMenu isOpen={isMobileMenuOpen} />
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;