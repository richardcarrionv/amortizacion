import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from './pages/login-page.tsx';
import { HomePage } from './pages/home-page.tsx';
import { InstitucionConfigPage } from './pages/inst-config-page.tsx';
import { CreateAdminPage } from './pages/create-admin.tsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/institucion/:id",
    element: <InstitucionConfigPage />,
  },
  {
    path: "/config/crear-admin",
    element: <CreateAdminPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
