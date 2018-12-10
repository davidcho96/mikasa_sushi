// *Variables globales utilizadas para la generación de rolls
let cantidadPiezasArmaTuPromo = 0;
let cantidadOpcionesCoberturas = 2;
let cantidadOpcionesRellenos = 0;
let arrayRollsCreados = [];
let coberturasPromoAGustoChef = [];
let cantidadSeleccionCoberturasChef = 0;
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
            var detalleTipoCoberturas = JSON.parse(item.ArrayTipoCoberturas);
            var detalleAgregados = JSON.parse(item.ArrayAgregados);
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
              cargaHtml += `<span class="red-text"><strike>Antes: $${
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
            cargaHtml += '<div class="card-reveal">';
            cargaHtml += `<span class="card-title grey-text text-darken-4"><b>${
              item.Nombre
            }</b><i class="material-icons right">close</i></span>`;
            // *Carga el detalle de los tipo de coberturas
            if (detalleTipoCoberturas == null) {
              cargaHtml += `<p>Arma tu promo de ${item.Cantidad} piezas</p>`;
            } else {
              cargaHtml += '<ul>';
              for (let i = 0; i < detalleTipoCoberturas.length; i++) {
                cargaHtml += `<li><p>- ${detalleTipoCoberturas[i]}</p></li>`;
              }
              cargaHtml += '</ul>';
            }

            if (detalleAgregados != null) {
              cargaHtml += `<p><b>Incluye: </b></p>`;
              cargaHtml += '<ul>';
              for (let i = 0; i < detalleAgregados.length; i++) {
                cargaHtml += `<li><p>- ${detalleAgregados[i]}</p></li>`;
              }
              cargaHtml += '</ul>';
            }

            cargaHtml += '<p></p>';
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
            cantidadOpcionesCoberturas = result.length;

            return result;
          }
          var arrayAgrupado = groupBy(arr, 'Indice');
          $.each(arrayAgrupado, function(indice, item) {
            cargaHtml += '<div class="content_coberturas">';
            cargaHtml += `<p>${indice + 1}.- </p>`;
            $.each(item, function(i, elementos) {
              cargaHtml += '<div class="radio_coberturas">';
              cargaHtml += '<p>';
              cargaHtml += '<label>';
              cargaHtml += `<input name='cobertura' type='radio' nombre='${
                elementos.Nombre
              }' value='${elementos.IdCobertura}'></input>`;
              if (elementos.Precio != 0) {
                cargaHtml += `<span>${elementos.Nombre}/+$${
                  elementos.Precio
                }</span>`;
              } else {
                cargaHtml += `<span>${elementos.Nombre}</span>`;
              }
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
          // *Se agrupan y se muestran de forma ordenada
          // *La función recibe el array con los rellenos y los agrupa en uno nuevo
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

            cantidadOpcionesRellenos = result.length;
            return result;
            // *Retorna el nuevo array
          }
          var arrayAgrupado = groupBy(arr, 'Indice');
          // *Se pasa el array y la propiedad por la que se quiere agrupar

          // *Nuevo array con los datos agrupados por indice
          $.each(arrayAgrupado, function(indice, item) {
            // *Se recorre el array en base a los indices
            cargaHtml += '<div class="content_rellenos">';
            cargaHtml += `<p>${indice + 1}.- </p>`;
            // *Se recorre el array de los rellenos
            $.each(item, function(i, elementos) {
              cargaHtml += '<div class="radio_rellenos">';
              cargaHtml += '<p>';
              cargaHtml += '<label class="radio-button-text">';
              cargaHtml += `<input name='relleno${
                elementos.Indice
              }' type='radio' nombre='${elementos.Nombre}' value='${
                elementos.IdRelleno
              }'></input>`;
              if (elementos.Precio != 0) {
                cargaHtml += `<span>${elementos.Nombre}/+$${
                  elementos.Precio
                }</span>`;
              } else {
                cargaHtml += `<span>${elementos.Nombre}</span>`;
              }
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

function cargarComboCantidadRollsArmaTuPromo() {
  // *Recibe la cantidad total de rolls y los divide por diez para distribuir las cantidades opcionales
  var cantidadOpciones = cantidadPiezasArmaTuPromo / 10;
  // *cantidadPiezasArmaTuPromo es una variable global que se actualiza en base las opciones de piezas creadas por el cliente
  var insertHtml = '';
  if (cantidadOpciones != 0) {
    for (var i = 1; i <= cantidadOpciones; i++) {
      insertHtml += `<option value='${i * 10}'>${i * 10}</option>`;
      // *Se cargan las cantidades opcionales en base a la disponibilidad de agregación
    }
  } else {
    insertHtml += '<option value="0">Selección completada</option>';
  }
  $('#cantidad_de_piezas_add_carro').html(insertHtml);
}

// *Comprueba el tipo de preparación de la promo mediante el id
function ComprobarTipoDePromo(id) {
  var idPromo = id;
  var action = 'ComprobarTipoDePromo';
  $.ajax({
    data: {
      action: action,
      id: idPromo
    },
    url: '../app/control/despPromos.php',
    type: 'POST',
    success: function(resp) {
      var arrayResp = JSON.parse(resp);
      $.each(arrayResp, function(indice, item) {
        // *El tipo de promo es arma tu promo por lo que se abre el modal y se cargan los ingredientes
        if (item.IdTipoPreparacion == 2) {
          $('#accion_promo_compra').text(`Arma tu promo ${item.Nombre}`);
          $('#cantidad_piezas_promo_compra').text(`(${item.Cantidad} piezas)`);
          $('#modal_add_arma_tu_promo').modal('open');
          $('#lbl_id_promo_compra').val(idPromo);
          cantidadPiezasArmaTuPromo = item.Cantidad;
          cargarComboCantidadRollsArmaTuPromo();
          cargarRadioButtonCoberturas();
          cargarRadioButtonRellenos();
        } else {
          // *Si el tipo de promo es a gusto del chef se verifica si los tipo de coberturas asociadas poseen más de una opción
          $('#lbl_id_promo_compra_chef').val(idPromo);
          var actionPromoChef = 'ComprobarTipoCoberturasPromoChef';
          var cargaHtml = '';
          $.ajax({
            data: {
              action: actionPromoChef,
              id: idPromo
            },
            url: '../app/control/despPromos.php',
            type: 'POST',
            success: function(resp) {
              var arrayResp = JSON.parse(resp);
              switch (arrayResp) {
                // *No hay tipo de cobertura con más de una opción
                case '1':
                  alert('No hay opciones de selección');
                  break;
                default:
                  if (arrayResp.length > 0) {
                    // *Si existe un tipo de cobertura asociado con más de una opción
                    // *Se abre el modal asociado y se cargan las cobeturas opcionales
                    $('#modal_promo_chef_compra').modal('open');
                    $('#accion_promo_compra_chef').text(
                      `A gusto del chef ${item.Nombre}`
                    );
                    $('#cantidad_piezas_promo_compra_chef').text(
                      `(${item.Cantidad} piezas)`
                    );
                    $.each(arrayResp, function(indice, item) {
                      var index = indice;
                      var a = JSON.stringify(eval(item.Coberturas));
                      var arrayCoberturas = JSON.parse(a);
                      cargaHtml += `<p class="modal-titulo-eleccion-ingredientes">Cobertura ${
                        item.NombreTipoCobertura
                      }</p>`;
                      cargaHtml += '<div class="content_coberturas">';
                      $.each(arrayCoberturas, function(i, elem) {
                        cargaHtml += '<div class="radio_coberturas">';
                        cargaHtml += '<p>';
                        cargaHtml += '<label class="radio-button-text">';
                        cargaHtml += `<input name='coberturaChef${index +
                          1}' type='radio' value='${elem.id}' data-cantidad='${
                          elem.cantidad
                        }'></input>`;
                        cargaHtml += `<span>${elem.nombre}</span>`;
                        cargaHtml += '</label>';
                        cargaHtml += '</p>';
                        cargaHtml += '</div>';
                      });
                      cargaHtml += '</div>';
                      $('#carga_chekbox_coberturas_chef').html(cargaHtml);
                      cantidadSeleccionCoberturasChef++;
                    });
                    // indice++;
                  } else {
                    concretarPromoIngresoPromoChef();
                    // *Si no hay tipos de coberturas con más de una opción se ingresa automaticamente
                  }
                  break;
              }
            },
            error: function() {
              alert(
                'Lo sentimos ha ocurrido un error al comprobar la promo seleccionada'
              );
            }
          });
        }
      });
    },
    error: function() {
      alert(
        'Lo sentimos ha ocurrido un error al comprobar la promo seleccionada'
      );
    }
  });
}

// *Los datos seleccionados se añaden a la lista para llevar la cuenta total de productos
// *Almacena los rolls creados
$('#btn_add_roll_promo').click(function() {
  if (cantidadPiezasArmaTuPromo == 0) {
    alert('Ya haz seleccionado la cantidad posible.');
  } else {
    $('#lista_rolls_compra').empty();
    var arrayRoll = [];
    var arrayCoberturaDetalleRoll = [];
    var arrayRellenoDetalleRoll = [];
    var listaHtml = '';
    var cantidadPiezas = $('#cantidad_de_piezas_add_carro').val();
    // for (var i = 1; i <= cantidadOpcionesCoberturas; i++) {
    var idCobertura = $(`input[name=cobertura]:checked`).val();
    var nombreCobertura = $(`input[name=cobertura]:checked`).attr('nombre');
    // *Se valida que se seleccione una cobertura
    if (idCobertura == null || nombreCobertura == null) {
      M.toast({
        html: 'Debes seleccionar una cobertura',
        displayLength: 3000,
        classes: 'red'
      });
      arrayCoberturaDetalleRoll = [];
    } else {
      // *Si se selecciona se ingresa al array
      arrayCoberturaDetalleRoll.push({
        Id: idCobertura,
        Nombre: nombreCobertura
      });
    }
    // }
    // *Se valida que todas las opciones de relleno posean una selección
    for (var j = 1; j <= cantidadOpcionesRellenos; j++) {
      var idRelleno = $(`input[name=relleno${j}]:checked`).val();
      var nombreRelleno = $(`input[name=relleno${j}]:checked`).attr('nombre');
      // *Si no se elije un relleno válido los array de detalle del roll se vacían
      if (idRelleno != null || nombreRelleno != null) {
        // M.toast({
        //   html: 'Selecciona al menos un relleno por opción.',
        //   displayLength: 3000,
        //   classes: 'red'
        // });
        // arrayCoberturaDetalleRoll = [];
        // arrayRellenoDetalleRoll = [];
        // break;
        // } else {
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
      cantidadPiezasArmaTuPromo -= cantidadPiezas;
      // *La variable global de cantidad de piezas arma tu promo se actualiza con la cantidad disponible
      arrayRoll.push({ Coberturas: arrayCoberturaDetalleRoll });
      arrayRoll.push({ Rellenos: arrayRellenoDetalleRoll });
      // *Si seleccionaron piezas para todas las opciones el roll creado se ingresa a un array
      arrayRollsCreados.push({ arrayRoll: arrayRoll });

      // *Se carga una lista con los rolls creados
      $.each(arrayRollsCreados, function(indice, item) {
        listaHtml += '<li class="collection-item">';
        listaHtml += `<span>${item.arrayRoll[0]} piezas con: </span>`;
        $.each(item.arrayRoll, function(indice, elem) {
          $.each(elem.Coberturas, function(ind, elem) {
            listaHtml += `<span>${elem.Nombre} | </span>`;
          });
          $.each(elem.Rellenos, function(ind, elem) {
            listaHtml += `<span>${elem.Nombre} | </span>`;
          });
        });
        listaHtml += `<a onclick='eliminarRollCompraList(${indice})' href="#">Eliminar<a/>`;
        listaHtml += '</li>';
      });
      // *Se carga el combobox de cantidad de opciones para los rolls creados
      cargarComboCantidadRollsArmaTuPromo();
      $('#lista_rolls_compra').append(listaHtml);
    } else {
      // !Cambio
      M.toast({
        html: 'Asegurate de haber seleccionado los ingredientes.',
        displayLength: 3000,
        classes: 'red'
      });
    }
  }
});

// *Elimina el rol específico de la lista arma tu promo
function eliminarRollCompraList(indice) {
  // *Se elimina un roll creado de la lista de la promo compra
  var listaHtml = '';
  var cantidadEliminada = arrayRollsCreados[indice].arrayRoll[0];
  cantidadPiezasArmaTuPromo =
    parseInt(cantidadPiezasArmaTuPromo) + parseInt(cantidadEliminada);
  arrayRollsCreados.splice(indice, 1);
  // *La variable cantidad de piezas se actualiza con las cantidades disponible después de la eliminación
  $('#lista_rolls_compra').empty();
  $.each(arrayRollsCreados, function(indic, item) {
    listaHtml += '<li class="collection-item">';
    listaHtml += `<span>${item.arrayRoll[0]} piezas con: </span>`;
    $.each(item.arrayRoll, function(indices, elem) {
      $.each(elem.Coberturas, function(ind, elem) {
        listaHtml += `<span>${elem.Nombre} | </span>`;
      });
      $.each(elem.Rellenos, function(indi, elem) {
        listaHtml += `<span>${elem.Nombre} | </span>`;
      });
    });
    listaHtml += `<a onclick='eliminarRollCompraList(${indice})' href="#">Eliminar<a/>`;
    listaHtml += '</li>';
  });
  $('#lista_rolls_compra').append(listaHtml);
  // *Se carga el combobox con las cantidades opcionales de creación de rolls
  cargarComboCantidadRollsArmaTuPromo();
}

$('#cancelar_arma_tu_promo_compra').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_add_arma_tu_promo').modal('close');
  // *Borra los datos de la lista
  cantidadPiezasArmaTuPromo = 0;
  cantidadOpcionesCoberturas = 0;
  cantidadOpcionesRellenos = 0;
  arrayRollsCreados = [];
  // *Al cerrar el modal las variable globales se resetean
});

$('#cancelar_promo_chef_compra').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_promo_chef_compra').modal('close');
  // *Borra los datos de la lista
  cantidadPiezasArmaTuPromo = 0;
  cantidadOpcionesCoberturas = 0;
  cantidadOpcionesRellenos = 0;
  arrayRollsCreados = [];
  cantidadSeleccionCoberturasChef = 0;
  // *Al cerrar el modal las variables globales se resetean
});

$('#form_arma_tu_promo').submit(function(evt) {
  evt.preventDefault();
  if (arrayRollsCreados.length == 0 || cantidadPiezasArmaTuPromo != 0) {
    alert('Por favor selecciona las piezas que deseas comprar');
  } else {
    swal({
      title: 'Espere un momento',
      html: 'Estamos procesando tu pedido',
      timer: 2000,
      onOpen: () => {
        swal.showLoading();
      }
    });
    var dataInfo = ';';
    var action = 'IngresarPromoCompra';
    var arrayRollsAIngresar = JSON.stringify(arrayRollsCreados);
    var id_promo = $('#lbl_id_promo_compra').val();
    dataInfo = {
      rollscompra: arrayRollsAIngresar,
      id_promo: id_promo,
      action: action
    };
    $.ajax({
      data: dataInfo,
      url: '../app/control/despPromoCompra.php',
      type: 'POST',
      success: function(resp) {
        switch (resp) {
          case '1':
            $('#modal_add_arma_tu_promo').modal('close');
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
});

// function pulseBoton() {
//   $('#btn_carrito').toggleClass('pulse-button animated tada');
//   setTimeout(function() {
//     $('#btn_carrito').toggleClass('pulse-button animated tada');
//   }, 6000);
// }

$('#form_arma_tu_promo_chef').submit(function(evt) {
  evt.preventDefault();
  // *Se valida que la cantidad de coberturas opcionales para los tipo de coberturas posean una opción seleccionada
  for (var j = 1; j <= cantidadSeleccionCoberturasChef; j++) {
    var idCobertura = parseInt(
      $(`input[name=coberturaChef${j}]:checked`).val()
    );
    var cantidad = parseInt(
      $(`input[name=coberturaChef${j}]:checked`).attr('data-cantidad')
    );
    if (idCobertura == null || isNaN(idCobertura)) {
      M.toast({
        html: 'Selecciona al menos una cobertura.',
        displayLength: 3000,
        classes: 'red'
      });
      arrayRollsCreados = [];
      break;
      // *Si no selecciona una opción se detiene el foreach
    } else {
      arrayRollsCreados.push({
        Cantidad: cantidad,
        IdCobertura: idCobertura
      });
    }
  }
  if (arrayRollsCreados.length != 0) {
    // alert('Por favor selecciona las piezas que deseas comprar');
    // } else {
    concretarPromoIngresoPromoChef();
  }
});

function concretarPromoIngresoPromoChef() {
  swal({
    title: 'Espera',
    html: 'Estamos procesando tu pedido',
    timer: 3000,
    onOpen: () => {
      swal.showLoading();
    }
  });
  var dataInfo = '';
  var action = 'IngresarPromoCompraChef';
  var id_promo = $('#lbl_id_promo_compra_chef').val();
  var arrayRollsAIngresarChef = JSON.stringify(arrayRollsCreados);
  dataInfo = {
    rollscompra: arrayRollsAIngresarChef,
    id_promo: id_promo,
    action: action
  };
  $.ajax({
    data: dataInfo,
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    success: function(resp) {
      switch (resp) {
        case '1':
          $('#modal_promo_chef_compra').modal('close');
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
