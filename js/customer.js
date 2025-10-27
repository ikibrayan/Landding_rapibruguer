document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById('formOverlay');
  const overlayBg = document.getElementById('overlayBg');
  const btnPedido = document.getElementById('btnPedido');
  const closeForm = document.getElementById('closeForm');
  const telefonoInput = document.getElementById("telefono");
  const resumenContenedor = document.getElementById('resumenPedido');
  const totalResumen = document.getElementById('totalResumen');

  // === ABRIR PANEL CON FONDO OSCURO ===
  btnPedido?.addEventListener('click', () => {
    overlay.classList.add('active');
    overlayBg?.classList.add('active');

    // animación sutil de entrada
    overlay.style.transform = "translateY(0)";
    overlay.style.opacity = "1";

    document.body.style.overflow = 'hidden';

    const pedido = JSON.parse(localStorage.getItem('pedido')) || JSON.parse(sessionStorage.getItem('pedido'));
    if (!pedido || !pedido.resumen || pedido.resumen.length === 0) return;

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
          <span class="nombre">${item.nombre} (x${item.cantidad})</span>
          <span class="precio">${new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
          }).format(item.subtotal)}</span>
        </div>
      `;
      resumenContenedor.appendChild(div);
    });

    const totalProductos = pedido.resumen.reduce((acc, item) => acc + item.cantidad, 0);
    const totalFormateado = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(pedido.total);
    totalResumen.textContent = `${totalFormateado} (x${totalProductos})`;
  });

  // === CERRAR PANEL Y QUITAR OSCURECIMIENTO ===
  closeForm?.addEventListener('click', () => {
    overlay.classList.remove('active');
    overlayBg?.classList.remove('active');

    // animación de salida
    overlay.style.transform = "translateY(20px)";
    overlay.style.opacity = "0";

    document.body.style.overflow = '';
  });

  // === VALIDAR NÚMERO ===
  if (telefonoInput) {
    telefonoInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
      if (this.value.length > 10) this.value = this.value.slice(0, 10);
    });
  }

  // === ENVIAR PEDIDO A WHATSAPP ===
  window.finalizarPedido = function () {
    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const observacionesCliente = document.getElementById('observaciones').value.trim();
    const pago = document.getElementById('pago').value;
    const entrega = document.getElementById('entrega').value;

    if (!nombre || !direccion || !telefono) {
      alert('Por favor completa todos los datos del cliente.');
      return;
    }

    const pedido = JSON.parse(localStorage.getItem("pedido")) || JSON.parse(sessionStorage.getItem("pedido"));
    if (!pedido || !pedido.resumen || pedido.resumen.length === 0) {
      alert('No se encontró un pedido válido. Regresa al menú.');
      return;
    }

    const formatoCOP = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    });

    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
    const horaStr = fecha.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

    let mensaje = `🍔 *Nuevo pedido desde RapiBurger*\n📅 ${fechaStr} - ${horaStr}\n\n`;

    const carritoGuardado = JSON.parse(sessionStorage.getItem('carrito')) || [];
    pedido.resumen.forEach(item => {
      const detalle = Array.isArray(carritoGuardado)
        ? carritoGuardado.find(p => p.nombre === item.nombre)
        : null;

      mensaje += `• ${item.nombre} x${item.cantidad} – ${formatoCOP.format(item.subtotal)}\n`;

      if (detalle?.opcion && detalle.opcion !== "default") {
        mensaje += `   ↳ Opción: ${detalle.opcion}\n`;
      }

      if (detalle?.observacion) {
        mensaje += `   📝 Nota: ${detalle.observacion}\n`;
      }
    });

    mensaje += `\n💰 Total: ${formatoCOP.format(pedido.total)}\n`;
    mensaje += `\n📍 Dirección: ${direccion}`;
    mensaje += `\n🙋 Nombre: ${nombre}`;
    mensaje += `\n📞 Teléfono: ${telefono}`;
    mensaje += `\n🚚 Entrega: ${entrega}`;
    mensaje += `\n💳 Pago: ${pago}`;

    if (observacionesCliente) mensaje += `\n🧾 Comentario: ${observacionesCliente}`;

    const numero = '573001706295';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    localStorage.removeItem("pedido");
    sessionStorage.removeItem("pedido");

    window.open(url, '_blank');
    overlay.classList.remove('active');
    overlayBg?.classList.remove('active');
    overlay.style.transform = "translateY(20px)";
    overlay.style.opacity = "0";
    document.body.style.overflow = '';
  };
});
