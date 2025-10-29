console.log("✅ products.js cargado");

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0
});

let producto = JSON.parse(sessionStorage.getItem("productoSeleccionado"));
if (!producto) window.location.href = "menu.html";

let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

// === Referencias DOM ===
const nombreEl = document.getElementById("nombreProducto");
const descripcionEl = document.getElementById("descripcionProducto");
const cantidadEl = document.getElementById("cantidad");
const agregarBtn = document.getElementById("agregarBtn");

// 🔹 Nuevo botón para eliminar producto (si no existe, se crea dinámicamente)
let eliminarBtn = document.getElementById("eliminarBtn");
if (!eliminarBtn) {
  eliminarBtn = document.createElement("button");
  eliminarBtn.id = "eliminarBtn";
  eliminarBtn.classList.add("eliminar");
  eliminarBtn.textContent = "Eliminar producto";
  agregarBtn.insertAdjacentElement("afterend", eliminarBtn);
}

let cantidad = producto.cantidad || 1;
let precioExtra = 0;
let gaseosaSeleccionada = false;

// === Mostrar datos producto ===
nombreEl.textContent = producto.nombre;
descripcionEl.textContent = producto.descripcion;
cantidadEl.textContent = cantidad;

// === Agregar opción gaseosa dinámica ===
const gaseosaDiv = document.createElement("div");
gaseosaDiv.classList.add("opcion-item");
gaseosaDiv.innerHTML = `
  <label>
    <input type="checkbox" id="gaseosa" value="gaseosa"> Agregar gaseosa
  </label>
  <span class="precio">$4.000</span>
`;
document.querySelector(".opciones").appendChild(gaseosaDiv);

const gaseosaInput = document.getElementById("gaseosa");

// === Recuperar producto existente (si lo hay) ===
const existente = carrito.find(p => p.nombre === producto.nombre);
if (existente) {
  cantidad = existente.cantidad || 1;
  gaseosaSeleccionada = existente.gaseosa || false;
  precioExtra = gaseosaSeleccionada ? 4000 : 0;
  gaseosaInput.checked = gaseosaSeleccionada;
  document.getElementById("observacion").value = existente.observacion || "";
  cantidadEl.textContent = cantidad;
}

// === Actualizar botón ===
function actualizarBoton() {
  const total = (producto.precio + precioExtra) * cantidad;
  agregarBtn.textContent = `Guardar ${formatoCOP.format(total)}`;
}
actualizarBoton();

// === Eventos ===
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

gaseosaInput.addEventListener("change", (e) => {
  gaseosaSeleccionada = e.target.checked;
  precioExtra = gaseosaSeleccionada ? 4000 : 0;
  actualizarBoton();
});

document.getElementById("cerrar").addEventListener("click", () => {
  window.location.href = "menu.html";
});

// === Guardar producto ===
agregarBtn.addEventListener("click", () => {
  const observacion = document.getElementById("observacion").value || "";
  const opcion = document.querySelector('input[name="tipo"]:checked')?.value || "default";

  const index = carrito.findIndex(p => p.nombre === producto.nombre);
  const infoGaseosa = gaseosaSeleccionada ? "Con gaseosa" : "Sin gaseosa";

  const totalFinal = producto.precio + precioExtra;

  const itemData = {
    id: producto.id,
    nombre: producto.nombre,
    precio: totalFinal, // 🔹 guarda el precio actualizado
    cantidad,
    opcion,
    observacion,
    gaseosa: gaseosaSeleccionada,
    infoGaseosa
  };

  if (index !== -1) carrito[index] = itemData;
  else carrito.push(itemData);

  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  window.location.href = "menu.html";
});

// === Eliminar producto ===
eliminarBtn.addEventListener("click", () => {
  const index = carrito.findIndex(p => p.nombre === producto.nombre);

  if (index !== -1) {
    carrito.splice(index, 1); // elimina solo ese producto
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
  } 

  window.location.href = "menu.html";
});
