const productos = [
  {
    categoria: 'hamburguesa',
    nombre: 'Hamburguesa de Res',
    precio: 15000,
    descripcion: 'Jugosa hamburguesa con carne de res y vegetales frescos.',
    imagen: 'img/burguer-clasic.webp'
  },
  {
    categoria: 'hamburguesa',
    nombre: 'Hamburguesa de Pollo',
    precio: 19000,
    descripcion: 'Deliciosa hamburguesa de pollo empanizado con lechuga.',
    imagen: 'img/burguer-pollo.webp'
  },
  {
    categoria: 'hamburguesa',
    nombre: 'Hamburguesa de Queso',
    precio: 14000,
    descripcion: 'Deliciosa hamburguesa de queso con lechuga.',
    imagen: 'img/burguer-cheese.webp'
  },
  {
    categoria: 'hamburguesa',
    nombre: 'Hamburguesa de Queso y Tocino',
    precio: 25000,
    descripcion: 'Deliciosa hamburguesa de queso con Tocino.',
    imagen: 'img/burguer-tocino.webp'
  },
  {
    categoria: 'pizza',
    nombre: 'Pizza Pepperoni',
    precio: 25000,
    descripcion: 'Pizza con pepperoni y queso mozzarella fundido.',
    imagen: 'img/pizza.webp'
  },
  {
    categoria: 'pizza',
    nombre: 'Pizza Vegetariana',
    precio: 32000,
    descripcion: 'Pizza vegetariana con extra queso y salsa bbq.',
    imagen: 'img/pizza-vegana.webp'
  },
  {
    categoria: 'pizza',
    nombre: 'Pizza de Pollo',
    precio: 24500,
    descripcion: 'Pizza de pollo con champiñones y salsa de tomate.',
    imagen: 'img/pizza-chicken.webp'
  },
  {
    categoria: 'pizza',
    nombre: 'Pizza Margarita',
    precio: 23000,
    descripcion: 'Pizza clásica con tomate, albahaca y queso.',
    imagen: 'img/pizza-margarita.webp'
  },
  {
    categoria: 'taco',
    nombre: 'Tacos de Res (3 und)',
    precio: 18000,
    descripcion: 'Tres tacos de res con guacamole y pico de gallo.',
    imagen: 'img/tacos.webp'
  },
  {
    categoria: 'taco',
    nombre: 'Tacos al Pastor (3 und)',
    precio: 26000,
    descripcion: 'Tres tacos al pastor con guacamole y cebolla.',
    imagen: 'img/tacos-alpastore.webp'
  },
  {
    categoria: 'taco',
    nombre: 'Tacos Tropicales (3 und)',
    precio: 32000,
    descripcion: 'Tres tacos tropicales con piña y lechuga.',
    imagen: 'img/tacos-tropic.webp'
  },
  {
    categoria: 'burrito',
    nombre: 'Burrito de Pollo',
    precio: 20000,
    descripcion: 'Burrito relleno de pollo, arroz, frijoles y queso.',
    imagen: 'img/burrito.webp'
  },
  {
    categoria: 'burrito',
    nombre: 'Burrito de Carne',
    precio: 28000,
    descripcion: 'Burrito relleno de carne, arroz, frijoles y queso.',
    imagen: 'img/burrito-meat.webp'
  }
];

// =============================
// Productos
// =============================
let productosFiltrados = [...productos];

// Carrito: clave = índice del producto, valor = cantidad
let carrito = {};

// =============================
// Formateador a pesos colombianos
// =============================
const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0
});

// =============================
// Restaurar datos guardados
// =============================
const carritoGuardado = sessionStorage.getItem('carrito');
if (carritoGuardado) {
  carrito = JSON.parse(carritoGuardado);
}

const pedidoGuardado = sessionStorage.getItem('pedido');
if (pedidoGuardado) {
  const pedido = JSON.parse(pedidoGuardado);
  pedido.resumen.forEach(item => {
    const index = productos.findIndex(p => p.nombre === item.nombre);
    if (index !== -1) carrito[index] = item.cantidad;
  });
}

// =============================
// Renderizado del carrito
// =============================
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
            <button class="menos" data-id="${index}">−</button>
            <span id="cant_${index}">${cantidad}</span>
            <button class="mas" data-id="${index}">+</button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(item);
  });

  // Asignar eventos a los botones
  document.querySelectorAll('.mas').forEach(btn => {
    btn.addEventListener('click', () => cambiarCantidad(parseInt(btn.dataset.id), 1));
  });

  document.querySelectorAll('.menos').forEach(btn => {
    btn.addEventListener('click', () => cambiarCantidad(parseInt(btn.dataset.id), -1));
  });

  actualizarTotal();
}

// =============================
// Cambiar cantidad
// =============================
function cambiarCantidad(index, delta) {
  carrito[index] = Math.max(0, (carrito[index] || 0) + delta);
  document.getElementById(`cant_${index}`).textContent = carrito[index];
  actualizarTotal();
}

// =============================
// Calcular y actualizar total
// =============================
function actualizarTotal() {
  let total = 0;
  for (const i in carrito) {
    const index = parseInt(i, 10); // 👈 convertir clave a número
    if (productos[index]) {
      total += productos[index].precio * carrito[i];
    }
  }

  const totalTexto = document.getElementById('total-price');
  if (totalTexto) {
    totalTexto.textContent = formatoCOP.format(total);
  }

  // Guardar carrito en sessionStorage
  sessionStorage.setItem('carrito', JSON.stringify(carrito));
}

// =============================
// Filtro de categorías
// =============================
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

// =============================
// Evento de Realizar Pedido
// =============================
document.querySelector('.pay').addEventListener('click', () => {
  const resumen = [];
  let total = 0;

  for (const i in carrito) {
    const index = parseInt(i, 10);
    const producto = productos[index];
    const cantidad = carrito[i];
    if (producto && cantidad > 0) {
      const subtotal = producto.precio * cantidad;

      resumen.push({
        nombre: producto.nombre,
        cantidad,
        subtotal
      });

      total += subtotal;
    }
  }

  const pedido = { resumen, total };

  // Guardar en localStorage y sessionStorage
  localStorage.setItem('pedido', JSON.stringify(pedido));
  sessionStorage.setItem('pedido', JSON.stringify(pedido));

  // No limpiamos el carrito para que siga al volver atrás
  window.location.href = 'customer.html';
});

// =============================
// Inicialización al cargar
// =============================
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
