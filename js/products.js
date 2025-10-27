const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0
});

let producto = JSON.parse(sessionStorage.getItem("productoSeleccionado"));
if (!producto) window.location.href = "menu.html";

let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

const nombreEl = document.getElementById("nombreProducto");
const descripcionEl = document.getElementById("descripcionProducto");
const cantidadEl = document.getElementById("cantidad");
const agregarBtn = document.getElementById("agregarBtn");

let cantidad = 1;
let opcionSeleccionada = "";
let observacionGuardada = "";

// Buscar si el producto ya estaba en carrito
const existente = carrito.find(p => p.id === producto.id);
if (existente) {
  cantidad = existente.cantidad;
  opcionSeleccionada = existente.opcion || "";
  observacionGuardada = existente.observacion || "";
}

nombreEl.textContent = producto.nombre;
descripcionEl.textContent = producto.descripcion;
cantidadEl.textContent = cantidad;

if (observacionGuardada) {
  document.getElementById("observacion").value = observacionGuardada;
}

if (opcionSeleccionada) {
  const opcionInput = document.querySelector(`input[value="${opcionSeleccionada}"]`);
  if (opcionInput) opcionInput.checked = true;
}

function actualizarBoton() {
  const total = producto.precio * cantidad;
  agregarBtn.textContent = `Guardar ${formatoCOP.format(total)}`;
}
actualizarBoton();

document.getElementById("mas").addEventListener("click", () => {
  cantidad++;
  cantidadEl.textContent = cantidad;
  actualizarBoton();
});

document.getElementById("menos").addEventListener("click", () => {
  if (cantidad > 1) cantidad--;
  cantidadEl.textContent = cantidad;
  actualizarBoton();
});

document.getElementById("cerrar").addEventListener("click", () => {
  window.location.href = "menu.html";
});

agregarBtn.addEventListener("click", () => {
  const observacion = document.getElementById("observacion").value || "";
  const opcion = document.querySelector('input[name="tipo"]:checked')?.value || "";

  const existente = carrito.find(p => p.id === producto.id);
  if (existente) {
    existente.cantidad = cantidad;
    existente.opcion = opcion;
    existente.observacion = observacion;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      opcion,
      observacion
    });
  }

  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  window.location.href = "menu.html";
});
