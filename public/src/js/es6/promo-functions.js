function cargarMantenedorPromosCliente(estado, caracter) {
  var action = 'CargarMantenedorPromosCliente';
  var cargaHtml = '';
  var arrayNoEnCarta = [];
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
            // *Si el item tiene como indice el valor 2 este se ingresará en el array indicado
            if (item.IdEstado == 2) {
              arrayNoEnCarta.push(item.Nombre);
            }

            cargaHtml += '<div class="col s12 m4 l4">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += `<div class="descuento"><p class="center-align">-${
              item.Descuento
            }%</p></div>`;
            cargaHtml +=
              '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += `<img class="activator" src="uploads/${item.ImgUrl}">`;
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += `<span class="card-title activator grey-text text-darken-4">${
              item.Nombre
            }<i class="material-icons right">more_vert</i></span>`;
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += `<span class="grey-text text-darken-4">Precio normal: $${
              item.Precio
            }</span>`;
            cargaHtml += `<span class="grey-text text-darken-4">Precio descuento: $${item.Precio -
              (item.Precio / 100) * item.Descuento}</span>`;
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';

            if (item.IdTipoPreparacion == 2) {
              cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarPromoCliente(${
                item.IdPromo
              })"><i class="material-icons">edit</i></a>`;
            } else if (item.IdTipoPreparacion == 1) {
              cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarPromoChef(${
                item.IdPromo
              })"><i class="material-icons">edit</i></a>`;
            }

            cargaHtml += `<h5 class="grey-text text-darken-4">${
              item.Estado
            }</h5>`;
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light red" onclick="eliminarPromoM(${
              item.IdPromo
            })"><i class="material-icons">delete</i></a>`;
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            // cargaHtml += '<div class="card-reveal">';
            // cargaHtml += `<span class="card-title grey-text text-darken-4">${
            //   item.Nombre
            // }<i class="material-icons right">close</i></span>`;
            // cargaHtml += `<p>${item.Descripcion}</p>`;
            // cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayNoEnCarta.length > 0) {
            var htmlNoEnCarta = `<div class="mensaje-precaucion-indice" id="mensaje_indice_no_carta_promos"><p><b>Atención!:</b> Existen ${
              arrayNoEnCarta.length
            } promos (${arrayNoEnCarta.join(
              ', '
            )}) que no están en carta. Recuerda que estos no podrán ser adquiridos por el cliente.</p></div>`;
            $('#mensaje_no_carta_promos').html(htmlNoEnCarta);
          } else {
            $('#mensaje_indice_no_carta_promos').remove();
          }

          $('#mant_arma_tu_promo_carga').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Se cargan los combobox del mantenedor
function cargarComboAgregados() {
  var action = 'CargarComboAgregados';
  $('select').formSelect();
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despAgregados.php',
    type: 'POST',
    success: function(respuesta) {
      // *cargaHtml es para los combobox del formulario
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value='${item.IdAgregado}'>${
          item.Nombre
        }</option>`;
      });
      $('select[name="combo_agregados"]').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Se cargan los combobox del mantenedor
function cargarComboTipoCoberturas() {
  var action = 'CargarComboTipoCoberturas';
  $('select').formSelect();
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despTipoCoberturas.php',
    type: 'POST',
    success: function(respuesta) {
      // *cargaHtml es para los combobox del formulario
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value='${item.IdTipoCobertura}'>${
          item.Nombre
        }</option>`;
      });
      $('select[name="combo_tipo_coberturas"]').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Se cargan los combobox del mantenedor
function cargarComboTipoPromo() {
  var action = 'CargarComboTipoPromo';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despTipoPromo.php',
    type: 'POST',
    success: function(respuesta) {
      // *cargaHtml es para los combobox del formulario
      var arr = JSON.parse(respuesta);
      cargaHtml += `<option disabled selected>Tipo Promo</option>`;
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value='${item.IdTipoPromo}'>${
          item.Nombre
        }</option>`;
      });
      $('select[name="combo_tipo_promo"]').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}
// *---------------------------------------------------------------------------
// * Añade un agregado a la lista de la promo
$('#btn_add_agregados_promo_cliente').click(function() {
  if ($('#txt_cantidad_agregados_chef').val() < 1) {
    M.toast({
      html: 'Debes ingresar una cantidad válida.',
      displayLength: 3000,
      classes: 'red'
    });
  } else {
    var listaHtml = `<li id-agregado='${$(
      '#combo_agregados_promo_form'
    ).val()}' cantidad-agregado='${$('#txt_cantidad_agregados').val()}'>${$(
      '#txt_cantidad_agregados'
    ).val()} - ${$(
      '#combo_agregados_promo_form option:selected'
    ).text()} <a id="eliminar_lista_agregados" href="#">Eliminar<a/></li>`;

    $('#lista_agregados_adicionales').append(listaHtml);
  }
});

// *Elimina el agregado de la lista de la promo
$('body').on('click', '#eliminar_lista_agregados', function() {
  $(this)
    .closest('li')
    .remove();
});

//  *------------------------------------------------------------------------------------------

// * Añade un agregado a la lista de la promo
$('#btn_add_agregados_promo_chef').click(function() {
  if ($('#txt_cantidad_agregados_chef').val() < 1) {
    M.toast({
      html: 'Debes ingresar una cantidad válida.',
      displayLength: 3000,
      classes: 'red'
    });
  } else {
    var listaHtml = `<li id-agregado-chef='${$(
      '#combo_agregados_promo_form_chef'
    ).val()}' cantidad-agregado-chef='${$(
      '#txt_cantidad_agregados_chef'
    ).val()}'>${$('#txt_cantidad_agregados_chef').val()} - ${$(
      '#combo_agregados_promo_form_chef option:selected'
    ).text()} <a id="eliminar_lista_agregados_chef" href="#">Eliminar<a/></li>`;

    $('#lista_agregados_adicionales_chef').append(listaHtml);
  }
});

// *Elimina el agregado de la lista de la promo
$('body').on('click', '#eliminar_lista_agregados_chef', function() {
  $(this)
    .closest('li')
    .remove();
});

// * Añade un tipo de cobertura a la lista de la promo
$('#btn_add_tipo_coberturas_promo_chef').click(function() {
  var total;
  if (obtenerTotalListaTipoCoberturas() != null) {
    total = obtenerTotalListaTipoCoberturas();
  } else {
    total = 0;
  }

  console.log(obtenerTotalListaTipoCoberturas());
  if ($('#txt_cantidad_tipo_coberturas_chef').val() < 10) {
    M.toast({
      html: 'Debes ingresar una cantidad válida (mínimo 10).',
      displayLength: 3000,
      classes: 'red'
    });
  } else if (total < 200) {
    var listaHtml = `<li id-tipo-cobertura-chef='${$(
      '#combo_tipo_coberturas_promo_form_chef'
    ).val()}' cantidad-tipo-cobertura-chef='${$(
      '#txt_cantidad_tipo_coberturas_chef'
    ).val()}'>${$('#txt_cantidad_tipo_coberturas_chef').val()} - ${$(
      '#combo_tipo_coberturas_promo_form_chef option:selected'
    ).text()} <a id="eliminar_lista_tipo_cobertura_chef" href="#">Eliminar<a/></li>`;

    $('#lista_tipo_coberturas_chef').append(listaHtml);
  } else {
    M.toast({
      html: 'Haz sobre pasado las 200 piezas.',
      displayLength: 3000,
      classes: 'red'
    });
  }

  var valor;
  if (obtenerTotalListaTipoCoberturas() != null) {
    valor = obtenerTotalListaTipoCoberturas();
    $('#txt_cantidad_piezas_chef').val(valor);
  }
});

// *Elimina el tipo cobertura de la lista de la promo
$('body').on('click', '#eliminar_lista_tipo_cobertura_chef', function() {
  $(this)
    .closest('li')
    .remove();
  if (obtenerTotalListaTipoCoberturas() != null) {
    valor = obtenerTotalListaTipoCoberturas();
    $('#txt_cantidad_piezas_chef').val(valor);
  } else {
    $('#txt_cantidad_piezas_chef').val(0);
  }
  // $('#txt_cantidad_piezas_chef').val(obtenerTotalListaTipoCoberturas());
});

// *-------------------------------------------------------------------------------------------------
// *Se validan y envian los datos del formulario de arma tu promo
$('#form_mantenedor_promo_cliente').validate({
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
    txt_nombre_promo: {
      required: true,
      minlength: 3,
      maxlength: 100
    },
    txt_cantidad_piezas: {
      required: true,
      min: 10,
      max: 200,
      digits: true
    },
    txt_precio_promo: {
      required: true,
      min: 0,
      max: 1000000,
      digits: true
    },
    txt_descuento_promo: {
      required: true,
      min: 0,
      max: 100,
      digits: true
    },
    combo_estado_elemento: {
      required: true
    },
    imagen_promo: {
      // required: true,
      //   extension: 'jpeg|jpg|png'
    },
    imagen_promo_text: {
      // required: true
    },
    combo_tipo_promo: {
      required: true
    }
  },
  messages: {
    txt_nombre_promo: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_cantidad_piezas: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 10',
      max: 'La cantidad máxima es 200',
      digits: 'Ingresa solo números'
    },
    txt_precio_promo: {
      required: 'Campo requerido *',
      min: 'El valor mínimo es 0',
      max: 'Valor máximo 1000000',
      digits: 'Ingresa solo números'
    },
    txt_descuento_promo: {
      required: 'Campo requerido *',
      min: 'El porcentaje mínimo es 0',
      max: 'El porcentaje máximo es 100',
      digits: 'Ingresa sólo números'
    },
    combo_estado_elemento: {
      required: 'Selecciona una opción'
    },
    imagen_promo: {
      // required: '',
      extension: 'Ingresa un archivo válido (png, jpg, jpeg)'
    },
    imagen_promo_text: {
      // required: 'Selecciona una imagen'
    },
    combo_tipo_promo: {
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
        var agregados = [];

        // *Se añaden los agregados adicionales a un array para luego ingresarlos a Bd
        $('#lista_agregados_adicionales li').each(function() {
          agregados.push([
            $(this).attr('id-agregado'),
            $(this).attr('cantidad-agregado')
          ]);
        });

        agregados = JSON.stringify(agregados);

        // *imgExtension obtiene la extensión de la imagen

        var imgExtension = $('#imagen_promo')
          .val()
          .substr(
            $('#imagen_promo')
              .val()
              .lastIndexOf('.') + 1
          );
        // *La variable formData inicializa el formulario al cual se le pasan los datos usando append
        var formData = new FormData();
        formData.append('nombre', $('#txt_nombre_promo').val());
        formData.append('cantidad', $('#txt_cantidad_piezas').val());
        formData.append('precio', $('#txt_precio_promo').val());
        formData.append('descuento', $('#txt_descuento_promo').val());
        formData.append('estado', $('#combo_estado_elemento_form').val());
        formData.append('tipopromo', $('#combo_tipo_promo_form').val());
        formData.append('agregados', agregados);

        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *Dependiendo de la acción se anexan más datos al formulario (formData)

        if ($('#lbl_id_promo_cliente').text() == '') {
          let action = 'IngresarPromoCliente';
          formData.append('action', action);
          if ($('#imagen_promo').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
            console.log('imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('no imagen');
          }
        } else {
          let actionUpdate = 'ActualizarDatosPromoCliente';
          formData.append('id', $('#lbl_id_promo_cliente').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if (
            $('#imagen_promo').val() != '' ||
            imgExtension == 'jpg' ||
            imgExtension == 'png' ||
            imgExtension == 'jpeg'
          ) {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
            console.log('Imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('No Imagen');
          }
        }

        $.ajax({
          data: formData,
          url: '../app/control/despPromos.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function(resp) {
            console.log(resp);
            switch (resp) {
              case '1':
                $('#modal_mantenedor_promo_cliente').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                cargarMantenedorPromosCliente();
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

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_promo').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_promo_cliente').modal('close');
  // *Borra los datos de la lista
});

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_promo_chef').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_promo_chef').modal('close');
  // *Borra los datos de la lista
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_promo').keyup(function() {
  var precioFinalDescuento =
    $('#txt_precio_promo').val() -
    ($('#txt_precio_promo').val() / 100) * $('#txt_descuento_promo').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo').text('0');
  } else {
    $('#precio_descuento_promo').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_promo').change(function() {
  var precioFinalDescuento =
    $('#txt_precio_promo').val() -
    ($('#txt_precio_promo').val() / 100) * $('#txt_descuento_promo').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo').text('0');
  } else {
    $('#precio_descuento_promo').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_promo').keyup(function() {
  var precioFinalDescuento =
    $('#txt_precio_promo').val() -
    ($('#txt_precio_promo').val() / 100) * $('#txt_descuento_promo').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo').text('0');
  } else {
    $('#precio_descuento_promo').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_promo').change(function() {
  var precioFinalDescuento =
    $('#txt_precio_promo').val() -
    ($('#txt_precio_promo').val() / 100) * $('#txt_descuento_promo').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo').text('0');
  } else {
    $('#precio_descuento_promo').text('$ ' + precioFinalDescuento);
  }
});

// !Añadir handlers para el txt_precio

// *Eliminar promo seleccionda
// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarPromoM(id) {
  var action = 'EliminarPromo';
  swal({
    title: '¿Estás seguro?',
    text:
      'Esta acción es irreversible, al eliminar la promo está ya no podrá ser adquirida en una compra.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.value) {
      $.ajax({
        data: {
          action: action,
          id: id
        },
        url: '../app/control/despPromos.php',
        type: 'POST',
        success: function(resp) {
          console.log(resp);
          switch (resp) {
            case '1':
              swal(
                'Listo',
                'El elemento fue eliminado exitosamente',
                'success'
              );
              cargarMantenedorPromosCliente();
              break;
            case '2':
              swal(
                'Error',
                'Lo sentimos no cuentas con los permisos para realizar esta acción',
                'error'
              );
              break;
          }
        },
        error: function() {
          alert('Lo sentimos ha habido un error inesperado');
        }
      });
    }
  });
}

function actualizarPromoCliente(id) {
  $('#modal_mantenedor_promo_cliente').modal('open');
  $('#accion_promo_cliente').text('Actualizar Arma tu Promo');
  var action = 'CargarModalPromoCliente';
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_promo_cliente"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#mensaje_precaucion_actualizar_promo_cliente').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despPromos.php',
    type: 'POST',
    success: function(respuesta) {
      console.log(respuesta);
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_promo_cliente').text(`${id}`);
        $("label[for='txt_nombre_promo']").addClass('active');
        $('#txt_nombre_promo').val(item.Nombre);
        $(`label[for='txt_cantidad_piezas']`).addClass('active');
        $('#txt_cantidad_piezas').val(item.Cantidad);
        $(`label[for='txt_precio_promo']`).addClass('active');
        $('#txt_precio_promo').val(item.Precio);
        $(`label[for='txt_descuento_promo']`).addClass('active');
        $('#txt_descuento_promo').val(item.Descuento);
        $('#precio_descuento_promo').text(`$
          ${item.Precio - (item.Precio / 100) * item.Descuento}`);
        $('#imagen_promo_text').val(item.ImgUrl);
        $('#combo_estado_elemento_form').val(item.IdEstado);
        $('#combo_tipo_promo_form').val(item.IdTipoPromo);

        if (item.Agregados != null) {
          var arrayAgregados = item.Agregados.split(', ');
          var arrayIdAgregados = item.IdAgregados.split(', ');
          var arrayCantidades = item.Cantidades.split(', ');

          $.each(arrayAgregados, function(indice) {
            var listaHtml = `<li id-agregado='${
              arrayIdAgregados[indice]
            }' cantidad-agregado='${arrayCantidades[indice]}'>${
              arrayCantidades[indice]
            } - ${
              arrayAgregados[indice]
            } <a id="eliminar_lista_agregados" href="#">Eliminar<a/></li>`;

            $('#lista_agregados_adicionales').append(listaHtml);
          });
        } else {
          console.log(item.Agregados);
        }
      });
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

$('#txt_cantidad_agregados').change(function() {
  if ($(this).val() < 0) {
    $(this).val(0);
  }
});

$('#txt_cantidad_agregados').blur(function() {
  if ($(this).val() < 0) {
    $(this).val(0);
  }
});

// *-------------------------------------------------------------------------------------------------

// *Se validan y envian los datos del formulario promo a gusto del chef
$('#form_mantenedor_promo_chef').validate({
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
    txt_nombre_promo_chef: {
      required: true,
      minlength: 3,
      maxlength: 100
    },
    txt_cantidad_piezas_chef: {
      required: true,
      min: 10,
      max: 200,
      digits: true
    },
    txt_precio_promo_chef: {
      required: true,
      min: 0,
      max: 1000000,
      digits: true
    },
    txt_descuento_promo_chef: {
      required: true,
      min: 0,
      max: 100,
      digits: true
    },
    combo_estado_elemento: {
      required: true
    },
    combo_tipo_promo: {
      required: true
    },
    'lista_tipo_coberturas_chef[]': {
      required: true
    }
  },
  messages: {
    txt_nombre_promo_chef: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_cantidad_piezas_chef: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 10',
      max: 'La cantidad máxima es 200',
      digits: 'Ingresa solo números'
    },
    txt_precio_promo_chef: {
      required: 'Campo requerido *',
      min: 'El valor mínimo es 0',
      max: 'Valor máximo 1000000',
      digits: 'Ingresa solo números'
    },
    txt_descuento_promo_chef: {
      required: 'Campo requerido *',
      min: 'El porcentaje mínimo es 0',
      max: 'El porcentaje máximo es 100',
      digits: 'Ingresa sólo números'
    },
    combo_estado_elemento: {
      required: 'Selecciona una opción'
    },
    combo_tipo_promo: {
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
        var agregados = [];
        var tipocoberturas = [];

        // *Se añaden los agregados adicionales a un array para luego ingresarlos a Bd
        $('#lista_agregados_adicionales_chef li').each(function() {
          agregados.push([
            $(this).attr('id-agregado-chef'),
            $(this).attr('cantidad-agregado-chef')
          ]);
        });

        // *Se añaden los tipo de coberturas a un array para luego ingresarlos a Bd
        $('#lista_tipo_coberturas_chef li').each(function() {
          tipocoberturas.push([
            $(this).attr('id-tipo-cobertura-chef'),
            $(this).attr('cantidad-tipo-cobertura-chef')
          ]);
        });

        agregados = JSON.stringify(agregados);
        tipocoberturas = JSON.stringify(tipocoberturas);

        // *imgExtension obtiene la extensión de la imagen
        console.log(agregados);
        console.log(tipocoberturas);
        var imgExtension = $('#imagen_promo_chef')
          .val()
          .substr(
            $('#imagen_promo_chef')
              .val()
              .lastIndexOf('.') + 1
          );
        // *La variable formData inicializa el formulario al cual se le pasan los datos usando append
        var formData = new FormData();
        formData.append('nombre', $('#txt_nombre_promo_chef').val());
        formData.append('cantidad', obtenerTotalListaTipoCoberturas());
        formData.append('precio', $('#txt_precio_promo_chef').val());
        formData.append('descuento', $('#txt_descuento_promo_chef').val());
        formData.append('estado', $('#combo_estado_elemento_form_chef').val());
        formData.append('tipopromo', $('#combo_tipo_promo_form_chef').val());
        formData.append('agregados', agregados);
        formData.append('tipocoberturas', tipocoberturas);

        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *Dependiendo de la acción se anexan más datos al formulario (formData)

        if ($('#lbl_id_promo_chef').text() == '') {
          let action = 'IngresarPromoChef';
          formData.append('action', action);
          if (
            $('#imagen_promo_chef').val() != '' ||
            imgExtension == 'jpg' ||
            imgExtension == 'png' ||
            imgExtension == 'jpeg'
          ) {
            formData.append('imagenUrl', $('#imagen_promo_chef')[0].files[0]);
            console.log('imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('no imagen');
          }
        } else {
          let actionUpdate = 'ActualizarDatosPromoChef';
          formData.append('id', $('#lbl_id_promo_chef').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if (
            $('#imagen_promo_chef').val() != '' ||
            imgExtension == 'jpg' ||
            imgExtension == 'png' ||
            imgExtension == 'jpeg'
          ) {
            formData.append('imagenUrl', $('#imagen_promo_chef')[0].files[0]);
            console.log('Imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('No Imagen');
          }
        }
        console.log(formData);
        $.ajax({
          data: formData,
          url: '../app/control/despPromos.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function(resp) {
            console.log(resp);
            switch (resp) {
              case '1':
                $('#modal_mantenedor_promo_chef').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                cargarMantenedorPromosCliente();
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

// *Validación de tipo coberturas

function validarListaTipoCoberturasForm() {
  if (($('#lista_tipo_coberturas_chef li').length = 0)) {
    return false;
  } else {
    return true;
  }
}
function obtenerTotalListaTipoCoberturas() {
  var arrayTipoCoberturas = $('#lista_tipo_coberturas_chef li').toArray();
  var totalCantidadTipoCoberturas = [];
  if (arrayTipoCoberturas.length > 0) {
    $.each(arrayTipoCoberturas, function() {
      totalCantidadTipoCoberturas.push(
        $(this).attr('cantidad-tipo-cobertura-chef')
      );
    });
  }
  if (totalCantidadTipoCoberturas.length > 0) {
    var total = totalCantidadTipoCoberturas.reduce((a, b) => {
      return parseInt(a) + parseInt(b);
    });
    console.log(total);
    return total;
  }
}

// $('#txt_cantidad_tipo_coberturas_chef').change(function() {
//   var arrayTipoCoberturas = $('#lista_tipo_coberturas_chef li').toArray();
//   var nuevoValor;
//   if (arrayTipoCoberturas.length > 0) {
//     nuevoValor =
//       $('#txt_cantidad_piezas_chef').val() - obtenerTotalListaTipoCoberturas();
//   }
//   if ($(this).val() < 0) {
//     $(this).val(0);
//   }
//   console.log(nuevoValor);
//   if (
//     $('#txt_cantidad_piezas_chef').val() >= 10 &&
//     $(this).val() > nuevoValor
//   ) {
//     $('#txt_cantidad_tipo_coberturas_chef').val(nuevoValor);
//   }
// });

// $('#txt_cantidad_piezas_chef').change(function() {
//   if ($(this).val() < 10) {
//     $(this).val(10);
//   }
//   console.log(obtenerTotalListaTipoCoberturas());
//   if (obtenerTotalListaTipoCoberturas() != null) {
//     var valor = obtenerTotalListaTipoCoberturas();
//     if ($('#txt_cantidad_piezas_chef').val() < valor) {
//       $('#txt_cantidad_piezas_chef').val(valor);
//     }
//     console.log(valor);
//   }
// });

$('#txt_cantidad_piezas_chef').change(function() {
  if (obtenerTotalListaTipoCoberturas() != null) {
    valor = obtenerTotalListaTipoCoberturas();
    $(this).val(valor);
  } else {
    $(this).val(0);
  }
});

$('#txt_cantidad_agregados_chef').change(function() {
  if ($(this).val() < 1) {
    $(this).val(1);
  }
  if ($(this).val() > 200) {
    $(this).val(200);
  }
});

$('#txt_cantidad_tipo_coberturas_chef').change(function() {
  if ($(this).val() < 10) {
    $(this).val(10);
  }
  if ($(this).val() > 200) {
    $(this).val(200);
  }
});

$('#txt_cantidad_agregados').change(function() {
  if ($(this).val() < 1) {
    $(this).val(1);
  }
  if ($(this).val() > 200) {
    $(this).val(200);
  }
});

function actualizarPromoChef(id) {
  console.log(id);
  $('#modal_mantenedor_promo_chef').modal('open');
  $('#accion_promo_chef').text('Actualizar Promo A Gusto del Chef');
  var action = 'CargarModalPromoChef';
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_promo_chef"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#mensaje_precaucion_actualizar_promo_chef').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despPromos.php',
    type: 'POST',
    success: function(respuesta) {
      console.log(respuesta);
      var arr = JSON.parse(respuesta);
      console.log(action);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_promo_chef').text(`${id}`);
        $("label[for='txt_nombre_promo_chef']").addClass('active');
        $('#txt_nombre_promo_chef').val(item.Nombre);
        $(`label[for='txt_cantidad_piezas_chef']`).addClass('active');
        $('#txt_cantidad_piezas_chef').val(item.Cantidad);
        $(`label[for='txt_precio_promo_chef]`).addClass('active');
        $('#txt_precio_promo_chef').val(item.Precio);
        $(`label[for='txt_descuento_promo_chef']`).addClass('active');
        $('#txt_descuento_promo_chef').val(item.Descuento);
        $('#precio_descuento_promo_chef').text(`$
          ${item.Precio - (item.Precio / 100) * item.Descuento}`);
        $('#imagen_promo_text_chef').val(item.ImgUrl);
        $('#combo_estado_elemento_form_chef').val(item.IdEstado);
        $('#combo_tipo_promo_form_chef').val(item.IdTipoPromo);
        $(`label[for='txt_cantidad_agregados_chef]`).addClass('active');

        if (item.Agregados != null) {
          var arrayAgregados = item.Agregados.split(', ');
          var arrayIdAgregados = item.IdAgregados.split(', ');
          var arrayCantidadesAgregados = item.CantidadesAgregados.split(', ');

          $.each(arrayAgregados, function(indice) {
            var listaHtml = `<li id-agregado-chef='${
              arrayIdAgregados[indice]
            }' cantidad-agregado-chef='${arrayCantidadesAgregados[indice]}'>${
              arrayCantidadesAgregados[indice]
            } - ${
              arrayAgregados[indice]
            } <a id="eliminar_lista_agregados_chef" href="#">Eliminar<a/></li>`;

            $('#lista_agregados_adicionales_chef').append(listaHtml);
          });
        } else {
          console.log(item.Agregados);
        }

        if (item.TipoCoberturas != null) {
          var arrayTipoCoberturas = item.TipoCoberturas.split(', ');
          var arrayIdTipoCoberturas = item.IdTipoCoberturas.split(', ');
          var arrayCantidadesTipoCoberturas = item.CantidadesTipoCoberturas.split(
            ', '
          );

          $.each(arrayTipoCoberturas, function(indice) {
            var listaHtml = `<li id-tipo-cobertura-chef='${
              arrayIdTipoCoberturas[indice]
            }' cantidad-tipo-cobertura-chef='${
              arrayCantidadesTipoCoberturas[indice]
            }'>${arrayCantidadesTipoCoberturas[indice]} - ${
              arrayTipoCoberturas[indice]
            } <a id="eliminar_lista_tipo_cobertura_chef" href="#">Eliminar<a/></li>`;

            $('#lista_tipo_coberturas_chef').append(listaHtml);
          });
        } else {
          console.log(item.Agregados);
        }
      });
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_promo_chef').keyup(function() {
  var precioFinalDescuento =
    $('#txt_precio_promo_chef').val() -
    ($('#txt_precio_promo_chef').val() / 100) *
      $('#txt_descuento_promo_chef').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo_chef').text('0');
  } else {
    $('#precio_descuento_promo_chef').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_promo_chef').change(function() {
  var precioFinalDescuento =
    $('#txt_precio_promo_chef').val() -
    ($('#txt_precio_promo_chef').val() / 100) *
      $('#txt_descuento_promo_chef').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo_chef').text('0');
  } else {
    $('#precio_descuento_promo_chef').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_promo_chef').keyup(function() {
  var precioFinalDescuento =
    $('#txt_precio_promo_chef').val() -
    ($('#txt_precio_promo_chef').val() / 100) *
      $('#txt_descuento_promo_chef').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo_chef').text('0');
  } else {
    $('#precio_descuento_promo_chef').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_promo_chef').change(function() {
  var precioFinalDescuento =
    $('#txt_precio_promo_chef').val() -
    ($('#txt_precio_promo_chef').val() / 100) *
      $('#txt_descuento_promo_chef').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo_chef').text('0');
  } else {
    $('#precio_descuento_promo_chef').text('$ ' + precioFinalDescuento);
  }
});
