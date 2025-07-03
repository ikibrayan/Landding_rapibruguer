const productos = [
  {
    categoria: 'hamburguesa',
    nombre: '🍔 Hamburguesa de Res',
    precio: 15000,
    descripcion: 'Jugosa hamburguesa con carne de res y vegetales frescos.',
    detalle: 'Incluye pan artesanal, pepinillos, tomate, cebolla caramelizada y nuestra salsa especial de la casa.',
    imagen: 'img/burguer.webp'
  },
  {
    categoria: 'hamburguesa',
    nombre: '🍔 Hamburguesa de Pollo',
    precio: 19000,
    descripcion: 'Deliciosa hamburguesa de pollo empanizado con lechuga.',
    imagen: 'img/burguer-pollo.webp'
  },
  {
    categoria: 'hamburguesa',
    nombre: '🍔 Hamburguesa de Queso',
    precio: 14000,
    descripcion: 'Deliciosa hamburguesa de queso con lechuga.',
    imagen: 'img/burguer-cheese.webp'
  },
  {
    categoria: 'hamburguesa',
    nombre: '🍔 Hamburguesa de Queso y Tocino',
    precio: 25000,
    descripcion: 'Deliciosa hamburguesa de queso con Tocino.',
    imagen: 'img/burguer-tocino.webp'
  },
  {
    categoria: 'pizza',
    nombre: '🍕 Pizza Pepperoni',
    precio: 25000,
    descripcion: 'Pizza con pepperoni y queso mozzarella fundido.',
    imagen: 'img/pizza.webp'
  },
  {
    categoria: 'pizza',
    nombre: '🍕 Pizza Vegetariana',
    precio: 32000,
    descripcion: 'Pizza vegetariana con extra queso y salsa bbq.',
    imagen: 'img/pizza-vegana.webp'
  },
  {
    categoria: 'pizza',
    nombre: '🍕 Pizza de Pollo',
    precio: 24500,
    descripcion: 'Pizza de pollo con champiñones y salsa de tomate.',
    imagen: 'img/pizza-chicken.webp'
  },
  {
    categoria: 'pizza',
    nombre: '🍕 Pizza Margarita',
    precio: 23000,
    descripcion: 'Pizza clásica con tomate, albahaca y queso.',
    imagen: 'img/pizza-margarita.webp'
  },
  {
    categoria: 'taco',
    nombre: '🌮 Tacos de Res (3 und)',
    precio: 18000,
    descripcion: 'Tres tacos de res con guacamole y pico de gallo.',
    imagen: 'img/tacos.webp'
  },
  {
    categoria: 'taco',
    nombre: '🌮 Tacos al Pastor (3 und)',
    precio: 26000,
    descripcion: 'Tres tacos al pastor con guacamole y cebolla.',
    imagen: 'img/tacos-alpastore.webp'
  },
  {
    categoria: 'taco',
    nombre: '🌮 Tacos Tropicales (3 und)',
    precio: 32000,
    descripcion: 'Tres tacos tropicales con piña y lechuga.',
    imagen: 'img/tacos-tropic.webp'
  },
  {
    categoria: 'burrito',
    nombre: '🌯 Burrito de Pollo',
    precio: 20000,
    descripcion: 'Burrito relleno de pollo, arroz, frijoles y queso.',
    imagen: 'img/burrito.webp'
  },
  {
    categoria: 'burrito',
    nombre: '🌯 Burrito de Carne',
    precio: 28000,
    descripcion: 'Burrito relleno de carne, arroz, frijoles y queso.',
    imagen: 'img/burrito-meat.webp'
  }
];

const carrito = {};
let categoriaActual = '';

function filtrarCategoria(cat) {
  categoriaActual = cat;
  renderProductos();
}

function renderProductos() {
  const cont = document.getElementById('productos');
  cont.innerHTML = '';
  productos.forEach((prod, i) => {
    if (prod.categoria !== categoriaActual) return;
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" class="producto-img">
      <div class="producto-info">
        <h3>${prod.nombre}</h3>
        <p>${prod.descripcion}</p>
        <span class="precio">$${prod.precio.toLocaleString()}</span>
        <div class="cantidad-control">
          <button onclick="event.stopPropagation(); cambiarCantidad(${i}, -1)">-</button>
          <span id="cant_${i}">${carrito[i] || 0}</span>
          <button onclick="event.stopPropagation(); cambiarCantidad(${i}, 1)">+</button>
        </div>
      </div>
    `;
    div.onclick = () => mostrarModal(prod);
    cont.appendChild(div);
    if (!(i in carrito)) carrito[i] = 0;
  });
  actualizarTotal();
}


function cambiarCantidad(index, delta) {
  carrito[index] = Math.max(0, carrito[index] + delta);
  document.getElementById(`cant_${index}`).innerText = carrito[index];
  actualizarTotal();
}

function actualizarTotal() {
  let total = 0;
  for (let i in carrito) {
    total += carrito[i] * productos[i].precio;
  }
  document.getElementById('total').innerText = total.toLocaleString();
}

function guardarYContinuar() {
  const resumen = [];
  let total = 0;

  productos.forEach((p, i) => {
    if (carrito[i] > 0) {
      const subtotal = p.precio * carrito[i];
      resumen.push({
        nombre: p.nombre,
        cantidad: carrito[i],
        subtotal
      });
      total += subtotal;
    }
  });

  if (resumen.length === 0) {
    alert("No has agregado productos al carrito.");
    return;
  }

  const pedido = {
    resumen,
    total
  };

  sessionStorage.setItem("pedido", JSON.stringify(pedido));
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  sessionStorage.setItem("categoriaActual", categoriaActual);
  
  window.location.href = "customer.html";
}

document.getElementById('categoriaSelect').addEventListener('change', (e) => {
  categoriaActual = e.target.value;
  renderProductos();
});


const carritoGuardado = sessionStorage.getItem("carrito");
if (carritoGuardado) {
  Object.assign(carrito, JSON.parse(carritoGuardado));
}

const categoriaGuardada = sessionStorage.getItem("categoriaActual");
if (categoriaGuardada) {
  categoriaActual = categoriaGuardada;
} else {
  categoriaActual = 'hamburguesa';
}

document.getElementById('categoriaSelect').value = categoriaActual;

// Renderizar productos ya con datos restaurados
renderProductos();


function mostrarModal(prod) {
  document.getElementById('modal-img').src = prod.imagen;
  document.getElementById('modal-img').alt = prod.nombre;
  document.getElementById('modal-titulo').innerText = prod.nombre;
  document.getElementById('modal-descripcion').innerText = prod.descripcion;
  document.getElementById('modal-detalle').innerText = prod.detalle || '';
  document.getElementById('modal-precio').innerText = `Precio: $${prod.precio.toLocaleString()}`;
  document.getElementById('modal').classList.remove('hidden');
}


function cerrarModal() {
  document.getElementById('modal').classList.add('hidden');
}

