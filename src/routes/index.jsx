import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';

export const router = createBrowserRouter([
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-6xl font-black text-slate-200">404</h1>
            <p className="text-xl text-slate-500 mt-4">Page not found</p>
          </div>
        ),
      },
    ],
  },
]);
