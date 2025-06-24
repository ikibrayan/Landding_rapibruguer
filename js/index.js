const productos = [
  {
    categoria: 'hamburguesa',
    nombre: '🍔 Hamburguesa de Res',
    precio: 15000,
    descripcion: 'Jugosa hamburguesa con carne de res y vegetales frescos.',
    imagen: 'img/burguer.jpg'
  },
  {
    categoria: 'hamburguesa',
    nombre: '🍔 Hamburguesa de Pollo',
    precio: 19000,
    descripcion: 'Deliciosa hamburguesa de pollo empanizado con lechuga.',
    imagen: 'img/burguer-pollo.jpg'
  },
  {
    categoria: 'hamburguesa',
    nombre: '🍔 Hamburguesa de Queso',
    precio: 14000,
    descripcion: 'Deliciosa hamburguesa de queso con lechuga.',
    imagen: 'img/burguer-cheese.jpg'
  },
  {
    categoria: 'hamburguesa',
    nombre: '🍔 Hamburguesa de Queso y Tocino',
    precio: 25000,
    descripcion: 'Deliciosa hamburguesa de queso con Tocino.',
    imagen: 'img/burguer-tocino.jpg'
  },
  {
    categoria: 'pizza',
    nombre: '🍕 Pizza Pepperoni',
    precio: 25000,
    descripcion: 'Pizza con pepperoni y queso mozzarella fundido.',
    imagen: 'img/pizza.jpg'
  },
  {
    categoria: 'pizza',
    nombre: '🍕 Pizza Vegetariana',
    precio: 32000,
    descripcion: 'Pizza vegetariana con extra queso y salsa bbq.',
    imagen: 'img/pizza-vegana.jpg'
  },
  {
    categoria: 'pizza',
    nombre: '🍕 Pizza de Pollo',
    precio: 24500,
    descripcion: 'Pizza de pollo con champiñones y salsa de tomate.',
    imagen: 'img/pizza-chicken.jpg'
  },
  {
    categoria: 'pizza',
    nombre: '🍕 Pizza Margarita',
    precio: 23000,
    descripcion: 'Pizza clásica con tomate, albahaca y queso.',
    imagen: 'img/pizza-margarita.jpg'
  },
  {
    categoria: 'taco',
    nombre: '🌮 Tacos de Res (3 und)',
    precio: 18000,
    descripcion: 'Tres tacos de res con guacamole y pico de gallo.',
    imagen: 'img/tacos.jpg'
  },
  {
    categoria: 'taco',
    nombre: '🌮 Tacos al Pastor (3 und)',
    precio: 26000,
    descripcion: 'Tres tacos al pastor con guacamole y cebolla.',
    imagen: 'img/tacos-alpastore.jpg'
  },
  {
    categoria: 'taco',
    nombre: '🌮 Tacos Tropicales (3 und)',
    precio: 32000,
    descripcion: 'Tres tacos tropicales con piña y lechuga.',
    imagen: 'img/tacos-tropic.jpg'
  },
  {
    categoria: 'burrito',
    nombre: '🌯 Burrito de Pollo',
    precio: 20000,
    descripcion: 'Burrito relleno de pollo, arroz, frijoles y queso.',
    imagen: 'img/burrito.jpg'
  },
  {
    categoria: 'burrito',
    nombre: '🌯 Burrito de Carne',
    precio: 28000,
    descripcion: 'Burrito relleno de carne, arroz, frijoles y queso.',
    imagen: 'img/burrito-meat.jpg'
  }
];

const carrito = {};
let categoriaActual = '';

function renderSelectorCategorias() {
  const seccion = document.getElementById('menu');
  const categorias = ['hamburguesa', 'pizza', 'taco', 'burrito'];
  const div = document.createElement('div');
  div.className = 'selector-categorias';
  div.innerHTML = categorias.map(cat => `
    <button onclick="filtrarCategoria('${cat}')">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
  `).join('');
  seccion.insertBefore(div, document.getElementById('productos'));
}

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
          <button onclick="cambiarCantidad(${i}, -1)">-</button>
          <span id="cant_${i}">0</span>
          <button onclick="cambiarCantidad(${i}, 1)">+</button>
        </div>
      </div>
    `;
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

function enviarPedido() {
  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const entrega = document.getElementById('entrega').value;
  const pago = document.getElementById('pago').value;

  if (!nombre || !direccion || !telefono) {
    alert('Por favor completa todos los datos del cliente.');
    return;
  }

  let mensaje = `Hola, quiero hacer un pedido:\n`;
  let total = 0;

  productos.forEach((p, i) => {
    if (carrito[i] > 0) {
      const subtotal = p.precio * carrito[i];
      mensaje += `• ${p.nombre} x${carrito[i]} – $${subtotal.toLocaleString()}\n`;
      total += subtotal;
    }
  });

  mensaje += `\nTotal: $${total.toLocaleString()}\n`;
  mensaje += `\n Dirección: ${direccion}`;
  mensaje += `\n Nombre: ${nombre}`;
  mensaje += `\n Tel: ${telefono}`;
  mensaje += `\n Entrega: ${entrega}`;
  mensaje += `\n Pago: ${pago}`;

  const numero = '15551553934';  // Cambiar por el número real
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}




document.getElementById('categoriaSelect').addEventListener('change', (e) => {
  categoriaActual = e.target.value;
  renderProductos();
});
categoriaActual = 'hamburguesa';
renderProductos();
