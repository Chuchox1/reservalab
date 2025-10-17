import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

let reservas = [];

app.post("/reservar", (req, res) => {
  const { nombre, fecha, hora, laboratorio } = req.body;

  if (!nombre || !fecha || !hora || !laboratorio) {
    return res.status(400).json({ success: false, mensaje: "Datos incompletos." });
  }

  const conflicto = reservas.find(r => r.fecha === fecha && r.hora === hora && r.laboratorio === laboratorio);
  if (conflicto) {
    return res.status(400).json({ success: false, mensaje: "Ya existe una reserva para ese horario." });
  }

  reservas.push({ nombre, fecha, hora, laboratorio });
  return res.status(201).json({ success: true, mensaje: "Reserva registrada exitosamente." });
});

app.get("/reservas", (req, res) => res.json(reservas));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));

