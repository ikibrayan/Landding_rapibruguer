document.addEventListener("DOMContentLoaded", () => {
  // === Referencias del DOM ===
  const btnPedido = document.getElementById('btnPedido');
  const overlay = document.getElementById('formOverlay');
  const closeForm = document.getElementById('closeForm');
  const telefonoInput = document.getElementById("telefono");
  const resumenContenedor = document.getElementById('resumenPedido');
  const totalResumen = document.getElementById('totalResumen');

  // === Mostrar panel ===
  btnPedido?.addEventListener('click', () => {
    // Mostrar panel
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evita scroll del fondo

    // Generar resumen dinámico del pedido
    const pedido = JSON.parse(localStorage.getItem('pedido'));
    if (!pedido || !pedido.resumen || pedido.resumen.length === 0) return;

    // Limpiar el contenedor antes de agregar productos
    resumenContenedor.innerHTML = '';

    // Crear cada producto como un bloque independiente
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
        </div>
      `;
      resumenContenedor.appendChild(div);
    });

    // Calcular número total de productos
    const totalProductos = pedido.resumen.reduce((acc, item) => acc + item.cantidad, 0);

    // Formatear el total y mostrar con (xN)
    const totalFormateado = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(pedido.total);

    totalResumen.textContent = `${totalFormateado} (x${totalProductos})`;
  });

  // === Ocultar panel ===
  closeForm?.addEventListener('click', () => {
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restaura scroll
  });

  // === Validar número de teléfono ===
  if (telefonoInput) {
    telefonoInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, ""); // Solo números
      if (this.value.length > 10) this.value = this.value.slice(0, 10);
    });
  }

  // === Función principal de envío ===
  window.finalizarPedido = function () {
    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const observaciones = document.getElementById('observaciones').value.trim();
    const pago = document.getElementById('pago').value;
    const entrega = document.querySelector('input[name="entrega"]:checked')?.value;

    const urlParams = new URLSearchParams(window.location.search);
    const esOferta = urlParams.get('oferta') === 'true';

    if (!nombre || !direccion || !telefono) {
      alert('Por favor completa todos los datos del cliente.');
      return;
    }

    const pedido = JSON.parse(localStorage.getItem("pedido"));

    if (!esOferta && (!pedido || !pedido.resumen || pedido.resumen.length === 0)) {
      alert('No se encontró un pedido válido. Regresa al menú.');
      return;
    }

    // Formateador COP
    const formatoCOP = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    });

    // Construir mensaje para WhatsApp
    let mensaje = `Hola, quiero hacer un pedido:\n`;

    if (!esOferta) {
      pedido.resumen.forEach(item => {
        mensaje += `• ${item.nombre} x${item.cantidad} – ${formatoCOP.format(item.subtotal)}\n`;
      });
      mensaje += `\nTotal: ${formatoCOP.format(pedido.total)}\n`;
    } else {
      mensaje += `Esta es una solicitud de oferta directa sin productos seleccionados.\n`;
    }

    mensaje += `\n📍 Dirección: ${direccion}`;
    mensaje += `\n🙋 Nombre: ${nombre}`;
    mensaje += `\n📞 Teléfono: ${telefono}`;
    mensaje += `\n🚚 Tipo de entrega: ${entrega}`;
    mensaje += `\n💳 Método de pago: ${pago}`;

    if (observaciones) {
      mensaje += `\n📝 Observaciones: ${observaciones}`;
    }

    // Número de destino (modifica aquí el tuyo)
    const numero = '573001706295';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    // Limpiar pedido después de enviarlo
    localStorage.removeItem("pedido");
    sessionStorage.removeItem("pedido");

    // Abrir WhatsApp
    window.open(url, '_blank');

    // Cerrar el panel después de enviar
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
});
