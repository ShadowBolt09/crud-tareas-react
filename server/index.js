require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, llena todos los campos.' });
  }

  try {
    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE username = ?', username);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, llena todos los campos.' });
  }

  try {
    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE username = ?', username);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'El usuario no se encontro' });
  }

  const user = rows[0];

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'La contraseña no coincide' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Bienvenido', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
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

const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
