import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <header>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer>
      </footer>
    </div>
  );
};

export default MainLayout;
