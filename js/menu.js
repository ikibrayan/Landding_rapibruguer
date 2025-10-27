const productos = [
  { categoria: 'hamburguesa', nombre: 'Hamburguesa de Res', precio: 15000, descripcion: 'Jugosa hamburguesa con carne de res y vegetales frescos.', imagen: 'img/burguer-clasic.webp' },
  { categoria: 'hamburguesa', nombre: 'Hamburguesa de Pollo', precio: 19000, descripcion: 'Deliciosa hamburguesa de pollo empanizado con lechuga.', imagen: 'img/burguer-pollo.webp' },
  { categoria: 'hamburguesa', nombre: 'Hamburguesa de Queso', precio: 14000, descripcion: 'Deliciosa hamburguesa de queso con lechuga.', imagen: 'img/burguer-cheese.webp' },
  { categoria: 'hamburguesa', nombre: 'Hamburguesa de Queso y Tocino', precio: 25000, descripcion: 'Deliciosa hamburguesa de queso con Tocino.', imagen: 'img/burguer-tocino.webp' },
  { categoria: 'pizza', nombre: 'Pizza Pepperoni', precio: 25000, descripcion: 'Pizza con pepperoni y queso mozzarella fundido.', imagen: 'img/pizza-clasic.webp' },
  { categoria: 'pizza', nombre: 'Pizza Vegetariana', precio: 32000, descripcion: 'Pizza vegetariana con extra queso y salsa bbq.', imagen: 'img/pizza-vegana.webp' },
  { categoria: 'pizza', nombre: 'Pizza de Pollo', precio: 24500, descripcion: 'Pizza de pollo con champiñones y salsa de tomate.', imagen: 'img/pizza-chicken.webp' },
  { categoria: 'pizza', nombre: 'Pizza Margarita', precio: 23000, descripcion: 'Pizza clásica con tomate, albahaca y queso.', imagen: 'img/pizza-margarita.webp' },
  { categoria: 'taco', nombre: 'Tacos de Res (3 und)', precio: 18000, descripcion: 'Tres tacos de res con guacamole y pico de gallo.', imagen: 'img/tacos.webp' },
  { categoria: 'taco', nombre: 'Tacos al Pastor (3 und)', precio: 26000, descripcion: 'Tres tacos al pastor con guacamole y cebolla.', imagen: 'img/tacos-alpastore.webp' },
  { categoria: 'taco', nombre: 'Tacos Tropicales (3 und)', precio: 32000, descripcion: 'Tres tacos tropicales con piña y lechuga.', imagen: 'img/tacos-tropic.webp' },
  { categoria: 'burrito', nombre: 'Burrito de Pollo', precio: 20000, descripcion: 'Burrito relleno de pollo, arroz, frijoles y queso.', imagen: 'img/burrito.webp' },
  { categoria: 'burrito', nombre: 'Burrito de Carne', precio: 28000, descripcion: 'Burrito relleno de carne, arroz, frijoles y queso.', imagen: 'img/burrito-meat.webp' }
];

let productosFiltrados = [...productos];
let carrito = {};

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0
});

const carritoGuardado = sessionStorage.getItem('carrito');
if (carritoGuardado) carrito = JSON.parse(carritoGuardado);

const pedidoGuardado = sessionStorage.getItem('pedido');
if (pedidoGuardado) {
  const pedido = JSON.parse(pedidoGuardado);
  pedido.resumen.forEach(item => {
    const index = productos.findIndex(p => p.nombre === item.nombre);
    if (index !== -1) carrito[index] = item.cantidad;
  });
}

function renderCarrito() {
  const contenedor = document.querySelector('.cart-items');
  contenedor.innerHTML = '';
  productosFiltrados.forEach((producto) => {
    const index = productos.indexOf(producto);
    const cantidad = carrito[index] || 0;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="info">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="bottom">
          <span>${formatoCOP.format(producto.precio)}</span>
          <div class="qty">
            <button class="mas" data-id="${index}">
              ${cantidad > 0 ? `🛒 ${cantidad}` : '+'}
            </button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(item);
  });
  actualizarTotal();
}

function actualizarTotal() {
  let total = 0;
  const carritoGuardado = sessionStorage.getItem('carrito');
  if (carritoGuardado) {
    const data = JSON.parse(carritoGuardado);
    if (Array.isArray(data)) {
      data.forEach(p => {
        if (p.cantidad > 0) total += p.precio * p.cantidad;
      });
    } else {
      for (const i in data) {
        const cantidad = data[i];
        const producto = productos[i];
        if (producto && cantidad > 0) total += producto.precio * cantidad;
      }
    }
  }
  const totalEl = document.getElementById("total-price");
  if (totalEl) totalEl.textContent = formatoCOP.format(total);
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('mas')) {
    const id = parseInt(e.target.dataset.id);
    const producto = { ...productos[id], id, precio: Number(productos[id].precio) };
    sessionStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = `./products.html?producto=${id}`;
  }
});

function filtrarBotonCategoria(boton, categoria) {
  document.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('active'));
  boton.classList.add('active');
  localStorage.setItem('categoriaSeleccionada', categoria);
  filtrarCategoria(categoria);
}

function filtrarCategoria(categoria) {
  productosFiltrados = productos.filter(producto => producto.categoria === categoria);
  renderCarrito();
}

document.querySelector('.pay').addEventListener('click', () => {
  const resumen = [];
  let total = 0;

  const carritoGuardado = sessionStorage.getItem('carrito');
  let data = carritoGuardado ? JSON.parse(carritoGuardado) : {};

  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.cantidad > 0) {
        resumen.push({
          nombre: item.nombre,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad
        });
        total += item.precio * item.cantidad;
      }
    });
  } else {
    for (const i in data) {
      const cantidad = data[i];
      const producto = productos[i];
      if (producto && cantidad > 0) {
        const subtotal = producto.precio * cantidad;
        resumen.push({ nombre: producto.nombre, cantidad, subtotal });
        total += subtotal;
      }
    }
  }

  const pedido = { resumen, total };
  localStorage.setItem('pedido', JSON.stringify(pedido));
  sessionStorage.setItem('pedido', JSON.stringify(pedido));

  const overlay = document.getElementById('formOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  const resumenContenedor = document.getElementById('resumenPedido');
  const totalResumen = document.getElementById('totalResumen');
  if (resumenContenedor && totalResumen) {
    resumenContenedor.innerHTML = '';
    pedido.resumen.forEach(item => {
      const producto = productos.find(p => p.nombre === item.nombre);
      const imagen = producto ? producto.imagen : './img/default.png';
      const div = document.createElement('div');
      div.classList.add('producto-item');
      div.innerHTML = `
        <div class="img-wrapper">
          <img src="${imagen}" alt="${item.nombre}">
        </div>
        <div class="info">
          <span class="nombre">${item.nombre} <span class="cantidad">(x${item.cantidad})</span></span>
          <span class="precio">${formatoCOP.format(item.subtotal)}</span>
        </div>
      `;
      resumenContenedor.appendChild(div);
    });

    const totalProductos = pedido.resumen.reduce((acc, i) => acc + i.cantidad, 0);
    totalResumen.textContent = `${formatoCOP.format(pedido.total)} (x${totalProductos})`;
  }
});

const categoriaGuardada = localStorage.getItem('categoriaSeleccionada');
if (categoriaGuardada) {
  const boton = [...document.querySelectorAll('.categoria-btn')]
    .find(btn => btn.getAttribute('onclick').includes(categoriaGuardada));
  if (boton) {
    boton.classList.add('active');
    filtrarCategoria(categoriaGuardada);
  } else {
    productosFiltrados = [...productos];
    renderCarrito();
  }
} else {
  productosFiltrados = [...productos];
  renderCarrito();
}

actualizarTotal();
