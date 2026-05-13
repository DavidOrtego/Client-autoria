import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Expenses from '../pages/Expenses';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import LandingPage from '../pages/LandingPage';
import { AuthProvider } from '../context/authContext';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider />,
    children: [
      {
          index: true,
          element: <LandingPage />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/signup',
          element: <SignUp />,
        },
        {
          path: '/vives',
          element: <MainLayout />,
          children: [
            {
              path: 'home',
              element: <Home />,
            },
            {
              path: 'expenses',
              element: <Expenses />,
            },
            {
              path: '*',
              element: (
                <div className="flex flex-col items-center justify-center py-20">
                  <h1 className="text-6xl font-black text-slate-200">404</h1>
                  <p className="text-xl text-slate-500 mt-4">Página no encontrada en Vives</p>
                </div>
              ),
            },
          ],
      },
    ]
    
  },
  
  
]);