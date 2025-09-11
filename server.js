const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Datos en memoria
let usuarios = []; // {email, passwordHash}
let equipos = [
  { id: 1, nombre: "Microscopio", disponible: true },
  { id: 2, nombre: "Centrífuga", disponible: true },
  { id: 3, nombre: "Espectrofotómetro", disponible: false }
];
let reservas = []; // {id, usuario, equipo, fecha, estado}

// Rutas de usuarios
app.post("/registro", async (req, res) => {
  const { email, password } = req.body;
  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ error: "Usuario ya registrado" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  usuarios.push({ email, passwordHash });
  res.json({ message: "Usuario registrado" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });
  const valid = await bcrypt.compare(password, usuario.passwordHash);
  if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });
  res.json({ message: "Login exitoso", usuario: email });
});

// Rutas de equipos
app.get("/equipos", (req, res) => {
  res.json(equipos);
});

// Reservas
app.post("/reservar", (req, res) => {
  const { usuario, equipoId, fecha } = req.body;
  const equipo = equipos.find(e => e.id == equipoId);
  if (!equipo) return res.status(404).json({ error: "Equipo no encontrado" });
  if (!equipo.disponible) return res.status(400).json({ error: "Equipo no disponible" });

  const reserva = {
    id: reservas.length + 1,
    usuario,
    equipo: equipo.nombre,
    fecha,
    estado: "pendiente"
  };
  reservas.push(reserva);
  equipo.disponible = false;
  res.json({ message: "Reserva creada", reserva });
});

app.get("/reservas", (req, res) => {
  const { usuario } = req.query;
  if (usuario) {
    return res.json(reservas.filter(r => r.usuario === usuario));
  }
  res.json(reservas);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
