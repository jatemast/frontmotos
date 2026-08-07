import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Motos from './pages/Motos';
import Ordenes from './pages/Ordenes';
import OrdenForm from './pages/OrdenForm';
import OrdenDetalle from './pages/OrdenDetalle';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="motos" element={<Motos />} />
        <Route path="ordenes" element={<Ordenes />} />
        <Route path="ordenes/nueva" element={<OrdenForm />} />
        <Route path="ordenes/:id" element={<OrdenDetalle />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
