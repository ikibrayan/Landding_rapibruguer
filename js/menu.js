const productos = [
  {
    categoria: 'hamburguesa',
    nombre: 'Hamburguesa de Res',
    precio: 15000,
    descripcion: 'Jugosa hamburguesa con carne de res y vegetales frescos.',
    imagen: 'img/burguer.webp'
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


// 2. Carrito (clave: índice del producto, valor: cantidad)
const carrito = {};

// 3. Renderizar productos dinámicamente
function renderCarrito() {
  const contenedor = document.querySelector('.cart-items');
  contenedor.innerHTML = '';

  productos.forEach((producto, index) => {
    // Inicializar cantidad si no existe
    if (!(index in carrito)) carrito[index] = 1;

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="info">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="bottom">
          <span>$ ${(producto.precio / 100).toFixed(2)}</span>
          <div class="qty">
            <button class="menos" data-id="${index}">−</button>
            <span id="cant_${index}">${carrito[index]}</span>
            <button class="mas" data-id="${index}">+</button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(item);
  });

  // Asignar eventos dinámicamente después de renderizar
  document.querySelectorAll('.mas').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.id);
      cambiarCantidad(i, 1);
    });
  });

  document.querySelectorAll('.menos').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.id);
      cambiarCantidad(i, -1);
    });
  });

  actualizarTotal();
}

// 4. Cambiar cantidad
function cambiarCantidad(index, delta) {
  carrito[index] = Math.max(1, (carrito[index] || 1) + delta);
  document.getElementById(`cant_${index}`).textContent = carrito[index];
  actualizarTotal();
}

// 5. Total
function actualizarTotal() {
  let total = 0;
  for (const i in carrito) {
    total += productos[i].precio * carrito[i];
  }

  const totalTexto = document.querySelector('.cart-footer span');
  if (totalTexto) {
    totalTexto.textContent = `$${(total / 100).toFixed(2)}`;
  }
}

// 6. Iniciar
renderCarrito();
