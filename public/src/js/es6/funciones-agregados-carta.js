function cargarAgregadosCarta(estado, caracter) {
  var action = 'CargarCartaAgregados';
  var cargaHtml = '';
  var arrayNoEnCarta = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despAgregados.php',
    type: 'POST',
    success: function(respuesta) {
      console.log('respuesta exitosa');
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
          $.each(arr, function(indice, item) {
            // *Si el item tiene como indice el valor 2 este se ingresará en el array indicado
            if (item.IdEstado == 2) {
              arrayNoEnCarta.push(item.Nombre);
            }

            cargaHtml += '<div class="col s12 m6 l4 xl3">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            if (item.Descuento > 0) {
              cargaHtml += `<div class="descuento"><p class="center-align">-${
                item.Descuento
              }%</p></div>`;
            }
            cargaHtml +=
              '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += `<img class="activator" src="uploads/${item.ImgUrl}">`;
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += `<span class="card-title activator grey-text text-darken-4">${
              item.Nombre
            } ${
              item.Unidades
            }u<i class="material-icons right">more_vert</i></span>`;
            cargaHtml += '<div class="precios-productos">';
            if (item.Descuento > 0) {
              cargaHtml += `<span class="red-text">Antes: <strike>$${
                item.Precio
              }</strike></span>`;
              cargaHtml += `<span class="green-text">Ahora: $${item.Precio -
                (item.Precio / 100) * item.Descuento}</span>`;
            } else {
              cargaHtml += `<span class="green-text">Precio: $${
                item.Precio
              }</span>`;
            }
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light black" onclick="addAgregadosCarrito(${
              item.IdAgregado
            })"><i class="material-icons">add_shopping_cart</i></a>`;
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-reveal">';
            cargaHtml += `<span class="card-title grey-text text-darken-4">${
              item.Nombre
            }<i class="material-icons right">close</i></span>`;
            cargaHtml += `<p>${item.Descripcion}</p>`;
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });

          $('#carga_agregados_cliente').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function addAgregadosCarrito(id) {
  var action = 'IngresarAgregadoCarrito';
  $.ajax({
    data: { action: action, idAgregado: id },
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    success: function(resp) {
      console.log(resp);
      switch (resp) {
        case '1':
          M.toast({
            html: 'Se añadió un producto al carro',
            displayLength: 3000,
            classes: 'light-green accent-3'
          });
          pulseBoton();
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

function pulseBoton() {
  $('#btn_carrito').toggleClass('pulse-button animated tada');
  setTimeout(function() {
    $('#btn_carrito').toggleClass('pulse-button animated tada');
  }, 6000);
}
