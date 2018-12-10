// *Cargar combobox de tipo de pago
function cargarComboBoxTipoPago() {
  var action = 'CargarComboBoxTipoPago';
  var cargaHtml = '';

  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despTipoPago.php',
    type: 'POST',
    success: function(respuesta) {
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value="${item.IdTipoPago}">${
          item.Descripcion
        }</option>`;
      });
      $('select[name="combo_tipo_pago"]').html(cargaHtml);
      // *Se inserta en código html en el elemento seleccionado
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

// *Cargar Combobox tipo entrega
function cargarComboBoxTipoEntrega() {
  var action = 'CargarComboBoxTipoEntrega';
  var cargaHtml = '';

  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despTipoEntrega.php',
    type: 'POST',
    success: function(respuesta) {
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option>Tipo de entrega</option>';
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value="${item.IdTipoEntrega}">${
          item.Descripcion
        }</option>`;
      });
      $('select[name="combo_tipo_entrega"]').html(cargaHtml);
      // *Se inserta en código html en el elemento seleccionado
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

function cargarDatosCarritoCompraFinalizarCompra() {
  var actionPromo = 'ObtenerDatosCarrito';
  var actionAgregados = 'ObtenerDatosAgregadosCarrito';
  var cargaHtml = '';
  var cargaHtmlAgregados = '';

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
          $.each(arr, function(indice, item) {
            // *------------------------------------------
            cargaHtml += '<li class="collection-item items-carrito">';
            cargaHtml += `<span>${item.Nombre}</span>`;
            cargaHtml += `<span class='green-text'>$${item.PrecioTotal}</span>`;
            cargaHtml += '</li>';
          });
          //   *--------------------------------------------------
          $('#lista_productos_carrito').append(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });

  //   *Se cargan los datos de los agregados en el carrito
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
          $.each(arr, function(indice, item) {
            // *------------------------------------------
            cargaHtmlAgregados += '<li class="collection-item items-carrito">';
            cargaHtmlAgregados += `<span class="collapsible-text">${
              item.Nombre
            } ${item.Unidades} Unidades</span>`;
            cargaHtmlAgregados += `<span class='green-text'>$${
              item.PrecioTotal
            }</span>`;
            cargaHtmlAgregados += '</li>';
          });
          //   *--------------------------------------------------
          $('#lista_productos_carrito').append(cargaHtmlAgregados);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function verificarListaCarrito() {
  if ($('#lista_productos_carrito').has('li').length == 0) {
    var cargaHtmlEmpty = '';
    cargaHtmlEmpty += '<li class="collection-item items-carrito">';
    cargaHtmlEmpty += `<span>No hay productos en el carrito de compras</span>`;
    cargaHtmlEmpty += '</li>';
    $('#lista_productos_carrito').append(cargaHtmlEmpty);
    // *Verifica la cantidad de items en la lista del carrito
  }
}

// *Si el radio de selección del receptor contiene el texto otro(valor 2)
// *Se muestra en pantalla el campo de texto de especificación
$('input[name="radio_receptor"]').change(function() {
  if ($(this).val() == 2) {
    $('#input_receptor_pedido').removeClass('hide');
    $('#form_compra_cliente').validate(); //sets up the validator
    $('#txt_nombre_receptor').rules('add', {
      required: true,
      minlength: 3,
      maxlength: 100,
      lettersonly: true,
      messages: {
        required: 'Campo requerido *',
        minlength: 'Mínimo 3 caracteres',
        maxlength: 'Máximo 100 caracteres',
        lettersonly: 'Ingresa solo letras'
      }
    });
  } else {
    $(this).rules('remove');
    $('#input_receptor_pedido').addClass('hide');
  }
});

// *Se valida el formulario para dar por finalizada la compra
var formCompra = $('#form_compra_cliente').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function(error, element) {
    $(element)
      .closest('form')
      .find(`label[for=${element.attr('id')}]`) //*Se insertará un label para representar el error
      .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
    if (element.is(':checkbox')) {
      error.appendTo(element.parents('.check_terminos'));
    }
    if (element.is(':radio')) {
      error.appendTo(element.parents('.radio_pago'));
    }
  },
  rules: {
    txt_hora_entrega: {
      required: true
    },
    radio_receptor: {
      required: true
    },
    // combo_tipo_pago: {
    //   required: true
    // },
    check_metodo_pago: {
      required: true
    },
    combo_tipo_entrega: {
      required: true,
      min: 0,
      max: 2
    },
    check_terminos_condiciones: {
      required: true
    },
    txt_comentario_compra: {
      minlength: 0,
      maxlength: 200
    }
  },
  messages: {
    txt_hora_entrega: {
      required: 'Campo requerido *'
    },
    radio_receptor: {
      required: 'Campo requerido *'
    },
    // combo_tipo_pago: {
    //   required: 'Selecciona una opción'
    // },
    combo_tipo_entrega: {
      required: 'Selecciona una opción',
      min: 'Selecciona una opción válida',
      max: 'Selecciona una opción válida'
    },
    check_terminos_condiciones: {
      required: 'Debes aceptar los términos y condiciones de servicio'
    },
    check_metodo_pago: {
      required: 'Selecciona el medio de pago'
    },
    txt_comentario_compra: {
      minlength: 0,
      maxlength: 'Máximo 200 caracteres'
    }
  },
  invalidHandler: function(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function(form) {
    // *Se valida la fecha de la compra y el horario de la entrega
    validarFechaCompra($('#txt_hora_entrega').val()).done(function(data) {
      switch (data) {
        case 'errorDiaEntrega':
          swal(
            'Error!',
            'La compra no puede llevarse a cabo debido a que el local está cerrado.',
            'error'
          );
          break;
        case 'errorHoraEntrega':
          swal('Error!', 'Selecciona una hora válida.', 'error');
          break;
        case 'puedescomprar':
          var action = 'ConsultarFactibilidadCompra';
          $.ajax({
            data: { action: action },
            url: '../app/control/despPromoCompra.php',
            type: 'POST',
            async: false,
            success: function(resp) {
              switch (resp) {
                case '1':
                  $('#modal_pago_webpay').modal('open');
                  // swal(
                  //   'Listo',
                  //   'Su solicitud de compra ha sido enviada por favor espere a que esta sea aceptada.',
                  //   'success'
                  // );
                  // setTimeout(function() {
                  //   location.href = 'index-cliente.php';
                  // }, 1500);
                  // *La función se ejecutó correctamente
                  break;
                case '2':
                  swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                  break;
                case '3':
                  swal(
                    'Error!',
                    'Para generar la compra primero debes haber agregado productos al carro de compras.',
                    'error'
                  );
                  break;
                case '4':
                  swal(
                    'Error!',
                    'Lo sentimos has sobrepasado el precio máximo de compra, si necesitas realizar una compra especial contacte con nosotros.',
                    'error'
                  );
                  break;
                case '5':
                  swal('Error!', 'En el día de hoy no atendemos.', 'error');
                  break;
              }
            },
            error: function() {
              alert('Lo sentimos ha ocurrido un error.');
            }
          });

          break;
      }
    });
  }
});

$('#btn_pagar_webpay').click(function(evt) {
  evt.preventDefault();
  finalizarCompraCliente();
});

function finalizarCompraCliente() {
  validarFechaCompra($('#txt_hora_entrega').val()).done(function(data) {
    switch (data) {
      case 'errorDiaEntrega':
        swal(
          'Error!',
          'La compra no puede llevarse a cabo debido a que el local está cerrado.',
          'error'
        );
        break;
      case 'errorHoraEntrega':
        swal('Error!', 'Selecciona una hora válida.', 'error');
        break;
      case 'puedescomprar':
        var pagoWebpay = '3';
        swal({
          title: '¿Estás seguro?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'Cancelar'
        }).then(result => {
          if (result.value) {
            swal({
              title: 'Espera',
              html: 'Estamos procesando tu compra.',
              timer: 1800,
              onOpen: () => {
                swal.showLoading();
              }
            });
            var action = 'GenerarVenta';
            var dataInfo = '';
            var receptor = '';
            // *Si el receptor asignado es otro se ingresa el texto ingresado en el texto
            if ($('input[name=radio_receptor]:checked').val() == 2) {
              receptor = $('#txt_nombre_receptor').val();
            } else {
              receptor = '1';
              // *Si el mismo cliente recibirá el pedido se ingresa el valor 1 que en el procedimiento
              // *Guarda el nombre del cliente como receptor
            }
            var direccion = '';
            if ($('#combo_tipo_entrega_form').val() == 1) {
              direccion = `${$('#txt_direccion_entrega').val()} ${$(
                '#txt_direccion_numero'
              ).val()}`;
            } else {
              direccion = '';
            }

            dataInfo = {
              action: action,
              tipo_pago: pagoWebpay,
              tipo_entrega: $('#combo_tipo_entrega_form').val(),
              hora_entrega: $('#txt_hora_entrega').val(),
              direccion_entrega: direccion,
              comentario: $('#txt_comentario_compra').val(),
              receptor: receptor
            };

            $.ajax({
              data: dataInfo,
              url: '../app/control/despPromoCompra.php',
              type: 'POST',
              success: function(resp) {
                console.log(resp);

                switch (resp) {
                  case '1':
                    $('#modal_pago_webpay').modal('close');
                    swal(
                      'Listo',
                      'Su solicitud de compra ha sido enviada por favor espere a que esta sea aceptada.',
                      'success'
                    );
                    setTimeout(function() {
                      location.href = 'index-cliente.php';
                    }, 1500);
                    // *La función se ejecutó correctamente
                    break;
                  case '2':
                    swal(
                      'Error!',
                      'Ha ocurrido un error al realizar la venta prueba de nuevo más tarde',
                      'error'
                    );
                    setTimeout(function() {
                      location.href = 'index-cliente.php';
                    }, 1500);
                    break;
                  case '3':
                    swal(
                      'Error!',
                      'No cuentas con saldo suficiente para realizar la compra',
                      'error'
                    );
                    break;
                }
              },
              error: function() {
                alert('Lo sentimos ha ocurrido un error.');
              }
            });
          }
        });
        break;
    }
  });
}

function ObtenerPrecioTotalCarrito() {
  var action = 'ObtenerPrecioTotalCarrito';
  var cargaHtml = '';
  //   *Se cargan los datos de los ingredientes en el carrito
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    success: function(respuesta) {
      // *----------------------------------------------------------------------
      // var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          cargaHtml += `$${respuesta}`;
          //   *--------------------------------------------------
          $('#total_compra').append(cargaHtml);
          $('#total_compra_carro').html(cargaHtml);
          $('#precio_total_carrito_webpay').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function validarFechaCompra(hora) {
  var action = 'ValidarFechaCompra';
  return $.ajax({
    data: { action: action, horaEntrega: hora },
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    async: false,
    success: function(resp) {
      return resp;
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function CargarTablaVentasPendientes() {
  var action = 'CargarTablaVentas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despVenta.php',
    type: 'POST',
    success: function(respuesta) {
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
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.CodigoVenta + '</td>';
            cargaHtml += '<td>' + item.NombreCliente + '</td>';
            cargaHtml += '<td>' + item.Fecha + '</td>';
            cargaHtml += '<td>' + item.TipoEntrega + '</td>';
            if (item.Direccion == null) {
              cargaHtml += '<td>En local</td>';
            } else {
              cargaHtml += '<td>' + item.Direccion + '</td>';
            }
            cargaHtml += '<td>' + item.TipoVenta + '</td>';
            cargaHtml += '<td>' + item.HoraEntrega + '</td>';
            cargaHtml += '<td>$' + item.Valor + '</td>';
            cargaHtml += '<td>' + item.EstadoVenta + '</td>';
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVenta(" +
              item.IdVenta +
              ")'><i class='material-icons'>more_vert</i></a></td>";
            cargaHtml += `<td><a class='btn-floating btn-medium waves-effect waves-light green' onclick='aceptarVenta("${
              item.IdVenta
            }", "${
              item.CodigoVenta
            }")'><i class='material-icons'>done</i></a></td>`;
            cargaHtml += `<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='cancelarVenta("${
              item.IdVenta
            }", "${
              item.CodigoVenta
            }")'><i class='material-icons'>clear</i></a></td>`;
            cargaHtml += '</tr>';
          });

          $('#body_tabla_ventas_mikasa').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Si el motivo de cancelación es otro se muestra el campo de texto de especificación de motivo
$('input[name="radioMotivo"]').change(function() {
  if ($(this).val() == 4) {
    $('#input_motivo_cancelacion').removeClass('hide');
    $('#form_cancelar_venta').validate(); //sets up the validator
    $('#txt_motivo_cancelacion').rules('add', {
      required: true,
      minlength: 3,
      maxlength: 200,
      messages: {
        required: 'Campo requerido *',
        minlength: 'Mínimo 3 caracteres',
        maxlength: 'Máximo 200 caracteres'
      }
    });
  } else {
    $(this).rules('remove');
    $('#input_motivo_cancelacion').addClass('hide');
  }
});

// *Al presionar cancelar venta se abre el modal para la selección del motivo
function cancelarVenta(id, codigoVenta) {
  $('#modal_mantenedor_cancelar_compra').modal('open');
  $('#txt_id_venta_cancelar').val(id);
  $('#txt_codigo_venta_cancelar').val(codigoVenta);
}

var markerMap = '';
// *Variable global que recibe las coordenadas seleccionadas en el mapa
var mapVenta;
// *Variable global que garantiza que solo se selecciona una ubicación
function aceptarVenta(id, codigoCompra) {
  var action = 'ValidarTipoEntrega';
  $.ajax({
    data: { action: action, idVenta: id },
    url: '../app/control/despVenta.php',
    type: 'POST',
    // async: false,
    success: function(resp) {
      switch (resp) {
        // *Si el tipo de entrega es en local no se ingresan latitud ni longitud
        case 'Local':
          aceptarVentaPedido(id, resp, codigoCompra);
          break;
        case 'Domicilio':
          $('#modal_mantenedor_aceptar_compra').modal('open');
          $('#txt_id_compra_mapa').val(id);
          $('#txt_entrega_compra_mapa').val(resp);
          $('#txt_codigo_compra_mapa').val(codigoCompra);
          // *Se inicializa el mapa en leaflet utilizando la API de openstreetmap
          var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib =
              '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(
              'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
              {
                maxZoom: 16,
                attribution:
                  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              }
            );
          mapVenta = L.map('map')
            .setView([-37.465, -72.3693], 15)
            .addLayer(osm);
          // *Centra el mapa para mejor visualización

          var marker;
          mapVenta.on('click', function(e) {
            // *Al hacer click en el mapa se añade un solo marcador
            // *Si hay otro este se elimina
            if (typeof marker === 'undefined') {
              marker = new L.marker(e.latlng, { draggable: true });
              marker.addTo(mapVenta);
            } else {
              marker.setLatLng(e.latlng);
            }
            markerMap = marker.getLatLng();
          });
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

// *Se cierra el modal al presionar el botón cancelar
$('#cancelar_modal_canc_compra').click(function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_cancelar_compra').modal('close');
});

// *Función para filtrar los datos en la tabla
$('#txt_buscar_ventas').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#body_tabla_ventas_mikasa tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

function aceptarVentaPedido(id, tipoEntrega, codigoCompra) {
  var action = 'AceptarVenta';
  var lat = '';
  var lng = '';
  // *Dependiendo del tipo de entrega las coordenadas son ingresadas en formato null

  // *Se valida que se haya seleccionado una ubicación en el mapa
  if (tipoEntrega == 'Domicilio') {
    if (markerMap == '' || markerMap == null) {
      M.toast({
        html: 'Por favor completa los campos requeridos',
        displayLength: 3000,
        classes: 'red'
      });
      // *Valida que se haya seleccionado una ubicación
    } else {
      lat = markerMap.lat;
      lng = markerMap.lng;
    }
  } else {
    lat = null;
    lng = null;
  }
  swal({
    title: '¿Estás seguro?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.value) {
      swal({
        title: 'Espera',
        html: 'Estamos procesando la solicitud.',
        timer: 9000,
        onOpen: () => {
          swal.showLoading();
        }
      });
      $.ajax({
        data: {
          action: action,
          idVenta: id,
          lng: lng,
          lat: lat,
          CodigoVenta: codigoCompra
        },
        url: '../app/control/despVenta.php',
        type: 'POST',
        success: function(resp) {
          console.log(resp);

          switch (resp) {
            case '1':
              swal('Listo', 'La venta ha sido aceptada.', 'success');
              markerMap = '';
              $('#modal_mantenedor_aceptar_compra').modal('close');
              CargarTablaVentasPendientes();
              break;
            case '2':
              swal('Error!', 'La compra no pudo ser aceptada.', 'error');
              break;
            case '3':
              swal(
                'Ha ocurrido un error',
                'El correo de notificación no pudo ser enviado',
                'error'
              );
              break;
            case '4':
              swal(
                'Ha ocurrido un error',
                'Hay uno o más <a href="mantenedor-ingredientes.php">ingredientes</a> que no tienen stock',
                'error'
              );
              break;
            case '5':
              swal(
                'Ha ocurrido un error',
                'No hay suficiente stock de coberturas',
                'error'
              );
              break;
          }
        },
        error: function() {
          alert('Lo sentimos ha ocurrido un error.');
        }
      });
    }
  });
}

// *Se cierra el modal de aceptar venta y se limpia la variable global de ubicación en el mapa seleccionada
$('#cancelar_modal_aceptar_compra').on('click', function(evt) {
  evt.preventDefault();
  markerMap = '';
  $('#modal_mantenedor_aceptar_compra').modal('close');
});

$('#form_aceptar_compra').submit(function(evt) {
  evt.preventDefault();
  var id = $('#txt_id_compra_mapa').val();
  var entrega = $('#txt_entrega_compra_mapa').val();
  var codigoCompra = $('#txt_codigo_compra_mapa').val();
  aceptarVentaPedido(id, entrega, codigoCompra);
});

// *Se valida el formulario de cancelar compra
var formCompra = $('#form_cancelar_venta').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function(error, element) {
    $(element)
      .closest('form')
      .find(`label[for=${element.attr('id')}]`) //*Se insertará un label para representar el error
      .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    radioMotivo: {
      required: true
    }
  },
  messages: {
    radioMotivo: {
      required: 'Campo requerido *'
    }
  },
  invalidHandler: function(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function(form) {
    var action = 'CancelarVenta';
    var idMotivo = $('input[name=radioMotivo]:checked').val();
    var motivo = $('#txt_motivo_cancelacion').val();
    var idVenta = $('#txt_id_venta_cancelar').val();
    var codigoVenta = $('#txt_codigo_venta_cancelar').val();
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        swal({
          title: 'Espera',
          html: 'Se está procesando la solicitud.',
          timer: 9000,
          onOpen: () => {
            swal.showLoading();
          }
        });
        $.ajax({
          data: {
            action: action,
            idVenta: idVenta,
            idMotivo: idMotivo,
            codigoVenta: codigoVenta,
            motivo: motivo
          },
          url: '../app/control/despVenta.php',
          type: 'POST',
          success: function(resp) {
            console.log(resp);
            switch (resp) {
              case '1':
                swal('Listo', 'La venta ha sido cancelada', 'success');
                CargarTablaVentasPendientes();
                $('#modal_mantenedor_cancelar_compra').modal('close');
                // *La función se ejecutó correctamente
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
  }
});

// *Función para ver el detalle de al venta
function verDetalleVenta(idVenta) {
  $('#modal_detalle_venta_pendientes').modal('open');
  // *Se abre el modal
  var actionPromoCompra = 'VerDetalleVentaPromoCompra';
  var cargaHtml = '';
  $.ajax({
    data: { action: actionPromoCompra, IdVenta: idVenta },
    url: '../app/control/despVenta.php',
    type: 'POST',
    sync: false,
    success: function(resp) {
      var arrayDetalleVenta = JSON.parse(resp);
      // *El json se convierte a array
      var arrAgregados = arrayDetalleVenta[1];
      // *Array de agregados vinculado a la venta
      var arr = arrayDetalleVenta[0];
      // *Se obtiene el comnetario vinculado a la venta
      if (arrayDetalleVenta[2] != null) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
        cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
        cargaHtml += '</ul>';
      }
      // *Si no existe un comentario no e muestra en pantalla
      $.each(arr, function(i, item) {
        if (item.NombrePromo != null) {
          var arrayDetalle = JSON.stringify(eval(arr[i]));
          // *Se convierte a astring parte del array e formato JSON
          var arrayDosDetalle = JSON.parse(arrayDetalle);
          // *Se convierte nuevamente a array
          var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
          // *Se parsea el json con el detalle de piezas de la promo creada
          var arrayTresParse = JSON.parse(arrayTres);

          cargaHtml += '<ul class="collection">';
          cargaHtml += `<li class="collection-item"><b>${
            item.NombrePromo
          }</b></li>`;
          $.each(arrayTresParse, function(e, elem) {
            cargaHtml += `<li class="collection-item">${elem.Piezas} ${
              elem.Detalle
            }</li>`;
            // *Se crea una estructura html que cargue los datos de la venta
          });
          cargaHtml += '</ul>';
        }
      });
      if (arrAgregados.length > 0) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
        $.each(arrAgregados, function(a, agregado) {
          cargaHtml += `<li class="collection-item">${
            agregado.NombreAgregado
          }</li>`;
          // *Esta estructura html carga los datos de los agregados vinculados a la venta
        });
        cargaHtml += '</ul>';
      }
      $('#cargar_detalle_venta').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para cargar la tabla de ventas canceladas
function cargarTablaVentasCanceladas() {
  var action = 'CargarTablaVentasCanceladas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despVenta.php',
    type: 'POST',
    success: function(respuesta) {
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
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.CodigoVenta + '</td>';
            cargaHtml += '<td>' + item.NombreCliente + '</td>';
            cargaHtml += '<td>' + item.Fecha + '</td>';
            cargaHtml += '<td>' + item.TipoEntrega + '</td>';
            cargaHtml += '<td>' + item.TipoPago + '</td>';
            cargaHtml += '<td>$' + item.Valor + '</td>';
            cargaHtml += '<td>' + item.Motivo + '</td>';
            cargaHtml += '<td>' + item.Empleado + '</td>';
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaCancelada(" +
              item.IdVenta +
              ")'><i class='material-icons'>more_vert</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_ventas_canceladas_mikasa').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function verDetalleVentaCancelada(idVenta) {
  $('#modal_detalle_venta_cancelada').modal('open');
  var actionPromoCompra = 'VerDetalleVentaPromoCompra';
  var cargaHtml = '';
  $.ajax({
    data: { action: actionPromoCompra, IdVenta: idVenta },
    url: '../app/control/despVenta.php',
    type: 'POST',
    sync: false,
    success: function(resp) {
      var arrayDetalleVenta = JSON.parse(resp);
      // *El json se convierte a array
      var arrAgregados = arrayDetalleVenta[1];
      // *Array de agregados vinculado a la venta
      var arr = arrayDetalleVenta[0];
      // *Se obtiene el comnetario vinculado a la venta
      if (arrayDetalleVenta[2] != null) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
        cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
        cargaHtml += '</ul>';
      }
      // *Si no existe un comentario no e muestra en pantalla
      $.each(arr, function(i, item) {
        if (item.NombrePromo != null) {
          var arrayDetalle = JSON.stringify(eval(arr[i]));
          // *Se convierte a astring parte del array e formato JSON
          var arrayDosDetalle = JSON.parse(arrayDetalle);
          // *Se convierte nuevamente a array
          var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
          // *Se parsea el json con el detalle de piezas de la promo creada
          var arrayTresParse = JSON.parse(arrayTres);

          cargaHtml += '<ul class="collection">';
          cargaHtml += `<li class="collection-item"><b>${
            item.NombrePromo
          }</b></li>`;
          $.each(arrayTresParse, function(e, elem) {
            cargaHtml += `<li class="collection-item">${elem.Piezas} ${
              elem.Detalle
            }</li>`;
            // *Se crea una estructura html que cargue los datos de la venta
          });
          cargaHtml += '</ul>';
        }
      });
      if (arrAgregados.length > 0) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
        $.each(arrAgregados, function(a, agregado) {
          cargaHtml += `<li class="collection-item">${
            agregado.NombreAgregado
          }</li>`;
          // *Esta estructura html carga los datos de los agregados vinculados a la venta
        });
        cargaHtml += '</ul>';
      }
      $('#cargar_detalle_venta_cancelada').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_ventas_canceladas').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#body_tabla_ventas_canceladas_mikasa tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

// *Se carga el precio máximo permitido por compra para mostrarlo en pantalla
function cargarPrecioMaximoCompra() {
  var action = 'CargarPrecioMaximoCompra';
  var cargaHtml = '';
  $.ajax({
    data: { action: action },
    url: '../app/control/despVenta.php',
    type: 'POST',
    success: function(resp) {
      if (resp != null || parseInt(resp) != 0) {
        cargaHtml += `<p>Precio Máximo permitido: $${resp}</p>`;
      } else {
        cargaHtml += '<p>Precio Máximo permitido: No Definido</p>';
      }
      $('#precio_maximo').html(cargaHtml);
    },
    error: function() {
      cargaHtml += cargaHtml += '<p>Precio Máximo permitido: No Definido</p>';
      $('#precio_maximo').html(cargaHtml);
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_ventas_historial').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#body_tabla_historial_ventas_mikasa tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

// *Función para cargar la tabla de ventas canceladas
function cargarTablaHistorialVentas() {
  var action = 'CargarTablaHistorialVentas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despVenta.php',
    type: 'POST',
    success: function(respuesta) {
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
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.CodigoVenta + '</td>';
            cargaHtml += '<td>' + item.NombreCliente + '</td>';
            cargaHtml += '<td>' + item.Fecha + '</td>';
            cargaHtml += '<td>' + item.TipoEntrega + '</td>';
            cargaHtml += '<td>' + item.TipoPago + '</td>';
            cargaHtml += '<td>' + item.TipoVenta + '</td>';
            cargaHtml += '<td>' + item.HoraEntrega + '</td>';
            cargaHtml += '<td>$' + item.Valor + '</td>';
            cargaHtml += '<td>' + item.EstadoVenta + '</td>';
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaHistorial(" +
              item.IdVenta +
              ")'><i class='material-icons'>more_vert</i></a></td>";
            cargaHtml += '</tr>';
          });
          $('#body_tabla_historial_ventas_mikasa').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function verDetalleVentaHistorial(idVenta) {
  $('#modal_detalle_venta_historial').modal('open');
  var actionPromoCompra = 'VerDetalleVentaPromoCompra';
  var cargaHtml = '';
  $.ajax({
    data: { action: actionPromoCompra, IdVenta: idVenta },
    url: '../app/control/despVenta.php',
    type: 'POST',
    sync: false,
    success: function(resp) {
      console.log(resp);

      var arrayDetalleVenta = JSON.parse(resp);
      // *El json se convierte a array
      var arrAgregados = arrayDetalleVenta[1];
      // *Array de agregados vinculado a la venta
      var arr = arrayDetalleVenta[0];
      // *Se obtiene el comnetario vinculado a la venta
      if (arrayDetalleVenta[2] != null) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
        cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
        cargaHtml += '</ul>';
      }
      // *Si no existe un comentario no e muestra en pantalla
      $.each(arr, function(i, item) {
        if (item.NombrePromo != null) {
          var arrayDetalle = JSON.stringify(eval(arr[i]));
          // *Se convierte a astring parte del array e formato JSON
          var arrayDosDetalle = JSON.parse(arrayDetalle);
          // *Se convierte nuevamente a array
          var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
          // *Se parsea el json con el detalle de piezas de la promo creada
          var arrayTresParse = JSON.parse(arrayTres);

          cargaHtml += '<ul class="collection">';
          cargaHtml += `<li class="collection-item"><b>${
            item.NombrePromo
          }</b></li>`;
          $.each(arrayTresParse, function(e, elem) {
            cargaHtml += `<li class="collection-item">${elem.Piezas} ${
              elem.Detalle
            }</li>`;
            // *Se crea una estructura html que cargue los datos de la venta
          });
          cargaHtml += '</ul>';
        }
      });
      if (arrAgregados.length > 0) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
        $.each(arrAgregados, function(a, agregado) {
          cargaHtml += `<li class="collection-item">${
            agregado.NombreAgregado
          }</li>`;
          // *Esta estructura html carga los datos de los agregados vinculados a la venta
        });
        cargaHtml += '</ul>';
      }
      $('#cargar_detalle_venta_historial').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_ventas_canceladas').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#body_tabla_ventas_canceladas_mikasa tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

// *Se cargan las ordenes pendientes de entrega para que sean visualizadas por el cliente
function cargarTrackingMisOrdenes() {
  var action = 'CargarTrackingMisOrdenes';
  var cargaHtml = '';
  $.ajax({
    data: { action: action },
    url: '../app/control/despEntregas.php',
    type: 'POST',
    success: function(resp) {
      var arr = JSON.parse(resp);
      cargaHtml += '<ul class="collection">';
      if (arr.length > 0) {
        $.each(arr, function(i, item) {
          cargaHtml += '<li class="collection-item avatar">';
          cargaHtml += `<i class="material-icons circle green">${
            item.Icono
          }</i>`;
          cargaHtml += `<p class="green-text">Estado Entrega: ${
            item.EstadoEntrega
          }</p>`;
          cargaHtml += '<p>';
          cargaHtml += `Código Venta: ${item.CodigoVenta} </br>`;
          cargaHtml += `Precio: $${item.Valor} </br>`;
          cargaHtml += `TipoEntrega: ${item.TipoEntrega} </br>`;
          cargaHtml += `Receptor: ${item.Receptor}`;
          cargaHtml += '</p>';
          cargaHtml += `<a href="#!" class="secondary-content black-text" onclick="verDetalleTrackingMiEntrega(${
            item.IdVenta
          })"><i class="material-icons">more_horiz</i></a>`;
          cargaHtml += '</li>';
        });
        cargaHtml += '</ul>';
      } else {
        cargaHtml += '<li class="collection-item">';
        cargaHtml += '<p>No tienes entregas pendientes.</p>';
        cargaHtml += '</li>';
      }
      $('#cargar_tracking_mis_ordenes').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error al cargar los datos');
    }
  });
}

function verDetalleTrackingMiEntrega(idVenta) {
  $('#modal_detalle_venta_tracking').modal('open');
  var actionPromoCompra = 'VerDetalleVentaPromoCompra';
  var cargaHtml = '';
  $.ajax({
    data: { action: actionPromoCompra, IdVenta: idVenta },
    url: '../app/control/despVenta.php',
    type: 'POST',
    sync: false,
    success: function(resp) {
      var arrayDetalleVenta = JSON.parse(resp);
      // *El json se convierte a array
      var arrAgregados = arrayDetalleVenta[1];
      // *Array de agregados vinculado a la venta
      var arr = arrayDetalleVenta[0];
      // *Se obtiene el comnetario vinculado a la venta
      if (arrayDetalleVenta[2] != null) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
        cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
        cargaHtml += '</ul>';
      }
      // *Si no existe un comentario no e muestra en pantalla
      $.each(arr, function(i, item) {
        if (item.NombrePromo != null) {
          var arrayDetalle = JSON.stringify(eval(arr[i]));
          // *Se convierte a astring parte del array e formato JSON
          var arrayDosDetalle = JSON.parse(arrayDetalle);
          // *Se convierte nuevamente a array
          var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
          // *Se parsea el json con el detalle de piezas de la promo creada
          var arrayTresParse = JSON.parse(arrayTres);

          cargaHtml += '<ul class="collection">';
          cargaHtml += `<li class="collection-item"><b>${
            item.NombrePromo
          }</b></li>`;
          $.each(arrayTresParse, function(e, elem) {
            cargaHtml += `<li class="collection-item">${elem.Piezas} ${
              elem.Detalle
            }</li>`;
            // *Se crea una estructura html que cargue los datos de la venta
          });
          cargaHtml += '</ul>';
        }
      });
      if (arrAgregados.length > 0) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
        $.each(arrAgregados, function(a, agregado) {
          cargaHtml += `<li class="collection-item">${
            agregado.NombreAgregado
          }</li>`;
          // *Esta estructura html carga los datos de los agregados vinculados a la venta
        });
        cargaHtml += '</ul>';
      }
      $('#cargar_detalle_venta_tracking').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function ObtenerDineroCartera() {
  var action = 'ObtenerDineroCartera';
  var cargaHtml = '';
  //   *Se cargan los datos de los ingredientes en el carrito
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despPromoCompra.php',
    type: 'POST',
    success: function(respuesta) {
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          cargaHtml += `$${respuesta}`;
          //   *--------------------------------------------------
          $('#total_cartera_webpay').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

$('#combo_tipo_entrega_form').change(function(e) {
  if ($(this).val() == 1) {
    $('#direccion_content').removeClass('hide');
    $('#form_compra_cliente').validate(); //sets up the validator
    $('#txt_direccion_entrega').rules('add', {
      required: true,
      minlength: 3,
      maxlength: 100,
      lettersonly: true,
      messages: {
        required: 'Campo requerido *',
        minlength: 'Mínimo 3 caracteres',
        maxlength: 'Máximo 100 caracteres',
        lettersonly: 'Ingresa solo letras'
      }
    });
    $('#txt_direccion_numero').rules('add', {
      required: true,
      min: 100,
      max: 99999,
      digits: true,
      messages: {
        required: 'Campo requerido *',
        min: 'Ingresa un número válido',
        max: 'Ingresa un número válido',
        digits: 'Ingresa solo números'
      }
    });
  } else {
    $(this).rules('remove');
    $('#direccion_content').addClass('hide');
  }
});
