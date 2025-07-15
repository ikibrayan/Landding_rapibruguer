function finalizarPedido() {
  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const entrega = document.getElementById('entrega').value;
  const pago = document.getElementById('pago').value;

  // Detectar si viene desde una oferta (URL contiene ?oferta=true)
  const urlParams = new URLSearchParams(window.location.search);
  const esOferta = urlParams.get('oferta') === 'true';

  if (!nombre || !direccion || !telefono) {
    alert('Por favor completa todos los datos del cliente.');
    return;
  }

  const pedido = JSON.parse(sessionStorage.getItem("pedido"));

  // Si no es oferta, validar que haya productos
  if (!esOferta && (!pedido || !pedido.resumen || pedido.resumen.length === 0)) {
    alert('No se encontró un pedido válido. Regresa al menú.');
    return;
  }

  let mensaje = `Hola, quiero hacer un pedido:\n`;

  if (!esOferta) {
    pedido.resumen.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} – $${item.subtotal.toLocaleString()}\n`;
    });

    mensaje += `\nTotal: $${pedido.total.toLocaleString()}\n`;
  } else {
    mensaje += `Esta es una solicitud de oferta directa sin productos seleccionados.\n`;
  }

  mensaje += `\n📍 Dirección: ${direccion}`;
  mensaje += `\n🙋 Nombre: ${nombre}`;
  mensaje += `\n📞 Teléfono: ${telefono}`;
  mensaje += `\n🚚 Tipo de entrega: ${entrega}`;
  mensaje += `\n💳 Método de pago: ${pago}`;

  const numero = '15551553934'; // ← Cambia este número por el real
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  sessionStorage.removeItem("pedido");
  window.open(url, '_blank');
}
