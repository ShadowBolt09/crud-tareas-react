import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import routes from '../routes/routes';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleLogin = () => {
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
        Swal.fire('Error', error.response.data.message || 'Credenciales inválidas', 'error');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Iniciar Sesión</h2>
      <div className="form-group">
        <label>Usuario:</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Ingrese su usuario"
        />
      </div>
      <div className="form-group mt-3">
        <label>Contraseña:</label>
        <input
          type="password"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Ingrese su contraseña"
        />
      </div>
      <button className="btn btn-primary mt-4" onClick={handleLogin}>
        Iniciar Sesión
      </button>
      <p className="mt-3">
        ¿No tienes cuenta? <a href={routes.register}>Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;
