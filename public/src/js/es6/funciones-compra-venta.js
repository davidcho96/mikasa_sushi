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
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

function cargarComboBoxTipoEntrega() {
  var action = 'CargarComboBoxTipoEntrega';
  var cargaHtml = '';

  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despTipoEntrega.php',
    type: 'POST',
    success: function(respuesta) {
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value="${item.IdTipoEntrega}">${
          item.Descripcion
        }</option>`;
      });
      $('select[name="combo_tipo_entrega"]').html(cargaHtml);
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
      console.log(respuesta);
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
  }
}

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
        maxlength: 'Máximo 3 caracteres',
        lettersonly: 'Ingresa solo letras'
      }
    });
  } else {
    $(this).rules('remove');
    $('#input_receptor_pedido').addClass('hide');
  }
});

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
  },
  rules: {
    txt_hora_entrega: {
      required: true
    },
    txt_direccion_entrega: {
      required: true,
      minlength: 3,
      maxlength: 100
    },
    radio_receptor: {
      required: true
    },
    combo_tipo_pago: {
      required: true
    },
    combo_tipo_entrega: {
      required: true
    }
  },
  messages: {
    txt_hora_entrega: {
      required: 'Campo requerido *'
    },
    txt_direccion_entrega: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    radio_receptor: {
      required: 'Campo requerido *'
    },
    combo_tipo_pago: {
      required: 'Selecciona una opción'
    },
    combo_tipo_entrega: {
      required: 'Selecciona una opción'
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
    validarFechaCompra($('#txt_hora_entrega').val()).done(function(data) {
      console.log(data);
      // if (data == true) {
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
              if ($('input[name=radio_receptor]:checked').val() == 2) {
                receptor = $('#txt_nombre_receptor').val();
              } else {
                receptor = '1';
              }

              dataInfo = {
                action: action,
                tipo_pago: $('#combo_tipo_pago_form_cliente').val(),
                tipo_entrega: $('#combo_tipo_entrega_form').val(),
                hora_entrega: $('#txt_hora_entrega').val(),
                direccion_entrega: $('#txt_direccion_entrega').val(),
                receptor: receptor
              };
              $.ajax({
                data: dataInfo,
                url: '../app/control/despPromoCompra.php',
                type: 'POST',
                async: false,
                success: function(resp) {
                  console.log(dataInfo);
                  switch (resp) {
                    case '1':
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
                        'La tarea no pudo llevarse a cabo',
                        'error'
                      );
                      break;
                    case '3':
                      swal(
                        'Error!',
                        'Para generar la compra primero debes haber agregado productos al carro de compras.',
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
      // } else {
      //   swal(
      //     'Error!',
      //     'La compra no puede llevarse a cabo debido a que el local está cerrado.',
      //     'error'
      //   );
      // }
    });
  }
});

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
          cargaHtml += respuesta;
          //   *--------------------------------------------------
          $('#total_compra').append(cargaHtml);
          $('#total_compra_carro').html(cargaHtml);
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

function CargarTablaIngredientes() {
  var action = 'CargarTablaVentas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despVenta.php',
    type: 'POST',
    success: function(respuesta) {
      console.log(respuesta);
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
            cargaHtml += '<td>' + item.Valor + '</td>';
            cargaHtml += '<td>' + item.EstadoVenta + '</td>';
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVenta(" +
              item.IdVenta +
              ")'><i class='material-icons'>more_vert</i></a></td>";
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light green' onclick='aceptarVenta(" +
              item.IdVenta +
              ")'><i class='material-icons'>done</i></a></td>";
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='cancelarVenta(" +
              item.IdVenta +
              ")'><i class='material-icons'>clear</i></a></td>";
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

$('input[name="radioMotivo"]').change(function() {
  if ($(this).val() == 4) {
    $('#input_motivo_cancelacion').removeClass('hide');
  }
  console.log($(this).val());
});

function cancelarVenta(id) {
  $('#modal_mantenedor_cancelar_compra').modal('open');
  $('#txt_id_compra').val(id);
}

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
