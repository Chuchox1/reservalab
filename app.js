import { validarFormulario } from "./utils/validation.js";

document.getElementById("reservaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const laboratorio = document.getElementById("laboratorio").value;
  const mensaje = document.getElementById("mensaje");

  const validacion = validarFormulario({ nombre, fecha, hora, laboratorio });
  if (!validacion.valido) {
    mensaje.textContent = validacion.mensaje;
    mensaje.style.color = "red";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/reservar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, fecha, hora, laboratorio })
    });

    const data = await response.json();
    mensaje.textContent = data.mensaje;
    mensaje.style.color = data.success ? "green" : "red";
  } catch (error) {
    mensaje.textContent = "Error al conectar con el servidor.";
    mensaje.style.color = "red";
  }
});
