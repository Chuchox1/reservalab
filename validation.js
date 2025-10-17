export function validarFormulario({ nombre, fecha, hora, laboratorio }) {
  if (!nombre || !fecha || !hora || !laboratorio) {
    return { valido: false, mensaje: "Todos los campos son obligatorios." };
  }
  if (!/^[a-zA-Z\s]+$/.test(nombre)) {
    return { valido: false, mensaje: "El nombre solo debe contener letras." };
  }
  const fechaSeleccionada = new Date(fecha);
  if (fechaSeleccionada < new Date()) {
    return { valido: false, mensaje: "La fecha debe ser futura." };
  }
  return { valido: true, mensaje: "" };
}
