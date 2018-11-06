// *Variables globales utilizadas para la generación de rolls
let cantidadPiezasArmaTuPromo = 0;
let cantidadOpcionesCoberturas = 2;
let cantidadOpcionesRellenos = 0;
let arrayRollsCreados = [];
// *---------------------------------------------------

function cargarPromosCarta(estado, caracter) {
  var action = 'CargarPromosCarta';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despPromos.php',
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
          $.each(arr, function(indice, item) {
            // *Se cargarán los datos en el menú index
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
            }<i class="material-icons right">more_vert</i></span>`;
            cargaHtml += '<div class="precios-productos">';
            if (item.Descuento > 0) {
              cargaHtml += `<span class="grey-text text-darken-4"><strike>Precio normal: $${
                item.Precio
              }</strike></span>`;
            } else {
              cargaHtml += `<span class="grey-text text-darken-4">Precio normal: $${
                item.Precio
              }</span>`;
            }
            cargaHtml += `<span class="grey-text text-darken-4">Precio descuento: $${item.Precio -
              (item.Precio / 100) * item.Descuento}</span>`;
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';

            if (item.IdTipoPreparacion == 2) {
              cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light black" onclick="ComprobarTipoDePromo(${
                item.IdPromo
              })"><i class="material-icons">add_shopping_cart</i></a>`;
            } else if (item.IdTipoPreparacion == 1) {
              cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light black" onclick="ComprobarTipoDePromo(${
                item.IdPromo
              })"><i class="material-icons">add_shopping_cart</i></a>`;
            }

            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });

          $('#carga_promos_cliente').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para cargar los checkbox de coberturas en arma tu promo
function cargarRadioButtonCoberturas(estado, caracter) {
  var action = 'CargarCoberturasCarta';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function(respuesta) {
      // *----------------------------------------------------------------------
      var arr = JSON.parse(respuesta);
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          // *Las coberturas se cargan de forma ordenada según su índice
          function groupBy(collection, property) {
            var i = 0,
              val,
              index,
              values = [],
              result = [];
            for (; i < collection.length; i++) {
              val = collection[i][property];
              index = values.indexOf(val);
              if (index > -1) result[index].push(collection[i]);
              else {
                values.push(val);
                result.push([collection[i]]);
              }
            }
            return result;
          }
          var obj = groupBy(arr, 'Indice');
          $.each(obj, function(indice, item) {
            cargaHtml += '<div class="content_coberturas">';
            cargaHtml += `<p>${indice + 1}.- </p>`;
            $.each(item, function(i, elementos) {
              cargaHtml += '<div class="radio_coberturas">';
              cargaHtml += '<p>';
              cargaHtml += '<label>';
              cargaHtml += `<input name='cobertura${
                elementos.Indice
              }' type='radio' nombre='${elementos.Nombre}' value='${
                elementos.IdCobertura
              }'></input>`;
              cargaHtml += `<span>${elementos.Nombre}</span>`;
              cargaHtml += '</label>';
              cargaHtml += '</p>';
              cargaHtml += '</div>';
            });
            cargaHtml += '</div>';
            $('#carga_chekbox_cobertura').html(cargaHtml);
          });
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para cargar los checkbox de rellenos en arma tu promo
function cargarRadioButtonRellenos(estado, caracter) {
  var action = 'CargarRellenosCarta';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despRellenos.php',
    type: 'POST',
    success: function(respuesta) {
      // *----------------------------------------------------------------------
      var arr = JSON.parse(respuesta);
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          // *Los rellenos se cargan de forma ordenada según su índice
          function groupBy(collection, property) {
            var i = 0,
              val,
              index,
              values = [],
              result = [];
            for (; i < collection.length; i++) {
              val = collection[i][property];
              index = values.indexOf(val);
              if (index > -1) result[index].push(collection[i]);
              else {
                values.push(val);
                result.push([collection[i]]);
              }
            }
            return result;
          }
          var obj = groupBy(arr, 'Indice');
          $.each(obj, function(indice, item) {
            cargaHtml += '<div class="content_rellenos">';
            cargaHtml += `<p>${indice + 1}.- </p>`;
            $.each(item, function(i, elementos) {
              cargaHtml += '<div class="radio_rellenos">';
              cargaHtml += '<p>';
              cargaHtml += '<label>';
              cargaHtml += `<input name='relleno${
                elementos.Indice
              }' type='radio' nombre='${elementos.Nombre}' value='${
                elementos.IdRelleno
              }'></input>`;
              cargaHtml += `<span>${elementos.Nombre}</span>`;
              cargaHtml += '</label>';
              cargaHtml += '</p>';
              cargaHtml += '</div>';
            });
            cargaHtml += '</div>';
            $('#carga_chekbox_rellenos').html(cargaHtml);
          });
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Comprueba el tipo de preparación de la promo mediante el id
function ComprobarTipoDePromo(id) {
  $('#modal_add_arma_tu_promo').modal('open');
  cargarRadioButtonCoberturas();
  cargarRadioButtonRellenos();
  // var action = 'ComprobarTipoDePromo';
  // $.ajax({
  //   data: {
  //     action: action,
  //     id: id
  //   },
  //   url: '../app/control/despPromos.php',
  //   type: 'POST',
  //   success: function(resp) {
  //     if (resp == 2) {
  //     }
  //   }
  // });
}

// *Los datos seleccionados se añaden a la lista para llevar la cuenta total de productos
// *Almacena los rolls creados
$('#btn_add_roll_promo').click(function() {
  $('#lista_rolls_compra').empty();
  var arrayRoll = [];
  var arrayCoberturaDetalleRoll = [];
  var arrayRellenoDetalleRoll = [];
  var listaHtml = '';
  var cantidadPiezas = $('#cantidad_de_piezas_add_carro').val();
  for (var i = 1; i <= 3; i++) {
    var idCobertura = $(`input[name=cobertura${i}]:checked`).val();
    var nombreCobertura = $(`input[name=cobertura${i}]:checked`).attr('nombre');
    if (idCobertura == null || nombreCobertura == null) {
      M.toast({
        html: 'Selecciona al menos una cobertura por opción.',
        displayLength: 3000,
        classes: 'red'
      });
      arrayCoberturaDetalleRoll = [];
      break;
    } else {
      arrayCoberturaDetalleRoll.push({
        Id: idCobertura,
        Nombre: nombreCobertura
      });
    }
  }
  for (var j = 1; j <= 1; j++) {
    var idRelleno = $(`input[name=relleno${j}]:checked`).val();
    var nombreRelleno = $(`input[name=relleno${j}]:checked`).attr('nombre');
    if (idRelleno == null || nombreRelleno == null) {
      M.toast({
        html: 'Selecciona al menos un relleno por opción.',
        displayLength: 3000,
        classes: 'red'
      });
      arrayCoberturaDetalleRoll = [];
      arrayRellenoDetalleRoll = [];
      break;
    } else {
      arrayRellenoDetalleRoll.push({
        Id: idRelleno,
        Nombre: nombreRelleno
      });
    }
  }
  if (
    arrayCoberturaDetalleRoll.length > 0 &&
    arrayRellenoDetalleRoll.length > 0
  ) {
    arrayRoll.push(cantidadPiezas);
    arrayRoll.push({ Coberturas: arrayCoberturaDetalleRoll });
    arrayRoll.push({ Rellenos: arrayRellenoDetalleRoll });
    arrayRollsCreados.push({ arrayRoll: arrayRoll });

    $.each(arrayRollsCreados, function(indice, item) {
      listaHtml += '<li>';
      listaHtml += `<span>${item.arrayRoll[0]} piezas con: </span>`;
      $.each(item.arrayRoll, function(indice, elem) {
        $.each(elem.Coberturas, function(ind, elem) {
          listaHtml += `<span>${elem.Nombre}/ </span>`;
        });
        $.each(elem.Rellenos, function(ind, elem) {
          listaHtml += `<span>${elem.Nombre}/ </span>`;
        });
      });
      listaHtml += `<a onclick='eliminarRollCompraList(${indice})' href="#">Eliminar<a/>`;
      listaHtml += '</li>';
    });
    $('#lista_rolls_compra').append(listaHtml);
  }
});

// *Elimina el rol específico de la lista arma tu promo
function eliminarRollCompraList(indice) {
  var listaHtml = '';
  arrayRollsCreados.splice(indice);
  $('#lista_rolls_compra').empty();
  $.each(arrayRollsCreados, function(indice, item) {
    listaHtml += '<li>';
    listaHtml += `<span>${item.arrayRoll[0]} piezas con: </span>`;
    $.each(item.arrayRoll, function(indice, elem) {
      $.each(elem.Coberturas, function(ind, elem) {
        listaHtml += `<span>${elem.Nombre}/ </span>`;
      });
      $.each(elem.Rellenos, function(ind, elem) {
        listaHtml += `<span>${elem.Nombre}/ </span>`;
      });
    });
    listaHtml += `<a onclick='eliminarRollCompraList(${indice})' href="#">Eliminar<a/>`;
    listaHtml += '</li>';
  });
  $('#lista_rolls_compra').append(listaHtml);
}
