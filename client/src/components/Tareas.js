import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function Tareas() {
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horas, setHoras] = useState();
  const [tareasList, setTareas] = useState([]);
  const [Editar, setEditar] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('token');
    if (!isAuthenticated) {
      navigate('/Login');
    }
  }, [navigate]);

  const add = () => {
    Axios.post(`${API_URL}/create`, {
      nombre: nombre,
      descripcion: descripcion,
      horas: horas,
    }).then(() => {
      getTareas();
      limpiarCampos();
      Swal.fire({
        title: '<strong>¡Tarea insertada con éxito!</strong>',
        html: `<i>¡La tarea <strong>${nombre}</strong> fue registrada con éxito!</i>`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    });
  };

  const update = () => {
    Axios.put(`${API_URL}/update`, {
      id: id,
      nombre: nombre,
      descripcion: descripcion,
      horas: horas,
    }).then(() => {
      getTareas();
      limpiarCampos();
      Swal.fire({
        title: '<strong>¡Tarea actualizada con éxito!</strong>',
        html: `<i>¡La tarea <strong>${nombre}</strong> fue actualizada con éxito!</i>`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    });
  };

  const deleteTarea = (val) => {
    Swal.fire({
      title: '<strong>Eliminar Tarea</strong>',
      html: `<i>¿Estás seguro de eliminar la tarea <strong>${val.nombre}</strong>?</i>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_URL}/delete/${val.id}`).then(() => {
          getTareas();
          limpiarCampos();
          Swal.fire('¡Eliminado!', 'La tarea fue eliminada con éxito.', 'success');
        });
      } else {
        Swal.fire('¡Cancelado!', 'La tarea no fue eliminada.', 'error');
      }
    });
  };

  const limpiarCampos = () => {
    setNombre('');
    setDescripcion('');
    setHoras('');
    setEditar(false);
  };

  const editarTarea = (val) => {
    setEditar(true);
    setId(val.id);
    setNombre(val.nombre);
    setDescripcion(val.descripcion);
    setHoras(val.horas);
  };

  const getTareas = () => {
    Axios.get(`${API_URL}/tareas`).then((response) => {
      setTareas(response.data);
    });
  };

  useEffect(() => {
    getTareas();
  }, []);

  return (
    <div className="container">
      <div className="card text-center mt-5">
        <div className="card-header">Gestor de Tareas</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre de la Tarea:</span>
            <input
              type="text"
              onChange={(event) => setNombre(event.target.value)}
              className="form-control"
              value={nombre}
              placeholder="Ingrese una Tarea"
              aria-label="Nombre"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Descripción de la Tarea:</span>
            <input
              type="text"
              onChange={(event) => setDescripcion(event.target.value)}
              className="form-control"
              value={descripcion}
              placeholder="Ingrese una Descripción"
              aria-label="Descripción"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Horas de la Tarea:</span>
            <input
              type="number"
              onChange={(event) => setHoras(event.target.value)}
              className="form-control"
              value={horas}
              placeholder="Ingrese las Horas"
              aria-label="Horas"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <div className="card-footer text-center">
          {Editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
              <button className="btn btn-danger m-2" onClick={limpiarCampos}>Cancelar</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={add}>Registrar Nueva Tarea</button>
          )}
        </div>
      </div>

      <table className="table table-striped mt-5">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Horas</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareasList.map((val, key) => (
            <tr key={key}>
              <td>{val.id}</td>
              <td>{val.nombre}</td>
              <td>{val.descripcion}</td>
              <td>{val.horas}</td>
              <td>
                <div className="btn-group" role="group" aria-label="Acciones">
                  <button
                    type="button"
                    onClick={() => editarTarea(val)}
                    className="btn btn-warning"
                  >
                    Editar
                  </button>
                  <button type="button" onClick={() => deleteTarea(val)} className="btn btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tareas;
