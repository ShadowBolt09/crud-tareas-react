import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import routes from '../routes/routes';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleRegister = () => {
    Axios.post(`${API_URL}/Register`, {
      username,
      password,
    })
      .then(() => {
        Swal.fire('¡Registro exitoso!', 'Ahora puedes iniciar sesión', 'success');
        navigate(routes.login);
      })
      .catch((error) => {
        Swal.fire('Error', error.response.data.message || 'No se pudo registrar', 'error');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Registro</h2>
      <div className="form-group">
        <label>Usuario:</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Crea tu usuario"
        />
      </div>
      <div className="form-group mt-3">
        <label>Contraseña:</label>
        <input
          type="password"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Crea tu contraseña"
        />
      </div>
      <button className="btn btn-primary mt-4" onClick={handleRegister}>
        Registrarme
      </button>
      <p className="mt-3">
        ¿Ya tienes cuenta? <a href="/Login">Inicia sesión aquí</a>
      </p>
    </div>
  );
}

export default Register;
