const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db-books',
});

// Verificar la conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos.');
  }
});

// Endpoints

// Obtener todos los libros
app.get('/books', (req, res) => {
  connection.query('SELECT * FROM books', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo libro
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  connection.query(
    'INSERT INTO books (title, author) VALUES (?, ?)',
    [title, author],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        const newBook = { id: result.insertId, title, author };
        res.status(201).json(newBook);
      }
    }
  );
});

// Obtener un libro por su ID
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  connection.query(
    'SELECT * FROM books WHERE id = ?',
    [bookId],
    (err, results) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.status(404).json({ message: 'Libro no encontrado' });
        }
      }
    }
  );
});

// Actualizar un libro
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author } = req.body;
  connection.query(
    'UPDATE books SET title = ?, author = ? WHERE id = ?',
    [title, author, bookId],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        if (result.affectedRows > 0) {
          const updatedBook = { id: bookId, title, author };
          res.json(updatedBook);
        } else {
          res.status(404).json({ message: 'Libro no encontrado' });
        }
      }
    }
  );
});

// Eliminar un libro
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  connection.query(
    'DELETE FROM books WHERE id = ?',
    [bookId],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        if (result.affectedRows > 0) {
          res.json({ message: 'Libro eliminado correctamente' });
        } else {
          res.status(404).json({ message: 'Libro no encontrado' });
        }
      }
    }
  );
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
