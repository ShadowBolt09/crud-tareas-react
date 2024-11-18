import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import routes from '../routes/routes';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    Axios.post(`${API_URL}/Login`, {
      username,
      password,
    })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem('token', token);
        Swal.fire('¡Inicio de sesión exitoso!', 'Bienvenido', 'success');
        navigate(routes.tareas);
      })
      .catch((error) => {
        Swal.fire('Error', error.response?.data?.message || 'Credenciales inválidas', 'error');
      });
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Iniciar Sesión</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formUsername">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4 w-100">
          Iniciar Sesión
        </Button>
      </Form>
      <div className="mt-3 text-center">
        ¿No tienes una cuenta?{' '}
        <Link to={routes.register}>Regístrate aquí</Link>
      </div>
    </Container>
  );
}

export default Login;