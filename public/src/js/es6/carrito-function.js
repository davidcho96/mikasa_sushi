function cargarDatosCarrito() {
  var actionPromo = 'ObtenerDatosCarrito';
  var cargaHtml = '';

  //   *Se cargan los datos de las promos creadas en el carrito
  $.ajax({
    data: `action=${actionPromo}`,
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    success: function(respuesta) {
      // *----------------------------------------------------------------------
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          cargaHtml += '<li>';
          $.each(arr, function(indice, item) {
            // *------------------------------------------
            cargaHtml += '<div class="collapsible-header">';
            cargaHtml += `<img src="uploads/${
              item.ImgUrl
            }" alt="" height="85px" width="90px">`;
            cargaHtml += `<p class="collapsible-text">${item.Nombre}</p>`;
            cargaHtml += '<div class="collapsible-price">';
            cargaHtml += `<p>Total: </p><p class='green-text'>$${
              item.PrecioTotal
            }</p>`;
            cargaHtml += `<a class="eliminar-carro" onclick="eliminarPromoCarro(${
              item.IdDetalle
            })"><i class="material-icons red-text">close</i></a>`;
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });
          cargaHtml += '</li>';
          //   *--------------------------------------------------
          $('#carga_items_carrito').html(cargaHtml);
          // console.log(respuesta);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function cargarAgregadosCarrito() {
  var actionAgregados = 'ObtenerDatosAgregadosCarrito';
  var cargaHtmlAgregados = '';
  //   *Se cargan los datos de los ingredientes en el carrito
  $.ajax({
    data: `action=${actionAgregados}`,
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    success: function(respuesta) {
      // *----------------------------------------------------------------------
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          cargaHtmlAgregados += '<li>';
          $.each(arr, function(indice, item) {
            // *------------------------------------------
            cargaHtmlAgregados += '<div class="collapsible-header">';
            cargaHtmlAgregados += `<img src="uploads/${
              item.ImgUrl
            }" alt="" height="85px" width="90px">`;
            cargaHtmlAgregados += `<p class="collapsible-text">${item.Nombre} ${
              item.Unidades
            } Unidades</p>`;
            cargaHtmlAgregados += '<div class="collapsible-price">';
            cargaHtmlAgregados += `<p>Total: </p><p class='green-text'>$${
              item.PrecioTotal
            }</p>`;
            cargaHtmlAgregados += `<a onclick="eliminarAgregadosCarro(${
              item.IdDetalle
            })" class="eliminar-carro"><i class="material-icons red-text">close</i></a>`;
            cargaHtmlAgregados += '</div>';
            cargaHtmlAgregados += '</div>';
          });
          cargaHtmlAgregados += '</li>';
          //   *--------------------------------------------------
          $('#carga_items_carrito').append(cargaHtmlAgregados);

          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function eliminarAgregadosCarro(id) {
  var action = 'EliminarAgregadoCarrito';
  $.ajax({
    data: { action: action, idDetalle: id },
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    success: function(resp) {
      console.log(resp);
      switch (resp) {
        case '1':
          M.toast({
            html: 'Se ha eliminado un producto del carro de compras.',
            displayLength: 2000,
            classes: 'red'
          });
          cargarDatosCarrito();
          cargarAgregadosCarrito();
          ObtenerPrecioTotalCarrito();
          break;
        case '2':
          swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

function eliminarPromoCarro(id) {
  var action = 'EliminarPromoCarrito';
  $.ajax({
    data: { action: action, idDetalle: id },
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    success: function(resp) {
      console.log(resp);
      switch (resp) {
        case '1':
          M.toast({
            html: 'Se ha eliminado un producto del carro de compras.',
            displayLength: 3000,
            classes: 'red'
          });
          cargarAgregadosCarrito();
          cargarDatosCarrito();
          ObtenerPrecioTotalCarrito();
          break;
        case '2':
          swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}
