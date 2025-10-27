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

  let mensaje = `🍔 *Nuevo pedido desde RapiBurger*\n\n`;

  // Leer carrito completo para obtener opciones y observaciones guardadas
  const carritoGuardado = JSON.parse(sessionStorage.getItem('carrito')) || [];
  pedido.resumen.forEach(item => {
    const detalle = Array.isArray(carritoGuardado)
      ? carritoGuardado.find(p => p.nombre === item.nombre)
      : null;

    mensaje += `• ${item.nombre} x${item.cantidad} – ${formatoCOP.format(item.subtotal)}\n`;

    // Mostrar adicional/opción si existe
    if (detalle?.opcion && detalle.opcion !== "default") {
      mensaje += `   ↳ Opción: ${detalle.opcion}\n`;
    }

    // Mostrar observación individual si existe
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

  // Observación general del cliente
  if (observacionesCliente) mensaje += `\n🧾 Comentario: ${observacionesCliente}`;

  const numero = '573001706295';
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  localStorage.removeItem("pedido");
  sessionStorage.removeItem("pedido");

  window.open(url, '_blank');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};
