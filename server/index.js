require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post('/create', (req, res) => {
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const horas = req.body.horas;
    const query = 'INSERT INTO tareas (nombre, descripcion, horas) VALUES (?, ?, ?)';
    db.query(query, [nombre, descripcion, horas], (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

app.get('/tareas', (req, res) => {
    const query = 'SELECT * FROM tareas';
    db.query(query, (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

app.put('/update', (req, res) => {
  const id = req.body.id;
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const horas = req.body.horas;
  const query = 'UPDATE tareas SET nombre = ?, descripcion = ?, horas = ? WHERE id = ?';
  db.query(query, [nombre, descripcion, horas, id], (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM tareas WHERE id = ?';
  db.query(query, id, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.listen(3001, () => {
  console.log('Corriendo en el puerto 3001');
});