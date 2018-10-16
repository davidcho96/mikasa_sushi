function cargarMantenedorPromosCliente(estado, caracter) {
  var action = 'CargarMantenedorPromosCliente';
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
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarPromoCliente(${
              item.IdPromo
            })"><i class="material-icons">edit</i></a>`;
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
  var listaHtml = `<li id-agregado='${$(
    '#combo_agregados_promo_form'
  ).val()}' cantidad-agregado='${$('#txt_cantidad_agregados').val()}'>${$(
    '#txt_cantidad_agregados'
  ).val()} - ${$(
    '#combo_agregados_promo_form option:selected'
  ).text()} <a id="eliminar_lista_agregados" href="#">Eliminar<a/></li>`;

  $('#lista_agregados_adicionales').append(listaHtml);
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
  var listaHtml = `<li id-agregado-chef='${$(
    '#combo_agregados_promo_chef_form'
  ).val()}' cantidad-agregado-chef='${$(
    '#txt_cantidad_agregados_chef'
  ).val()}'>${$('#txt_cantidad_agregados_chef').val()} - ${$(
    '#combo_agregados_promo_form_chef option:selected'
  ).text()} <a id="eliminar_lista_agregados_chef" href="#">Eliminar<a/></li>`;

  $('#lista_agregados_adicionales_chef').append(listaHtml);
});

// *Elimina el agregado de la lista de la promo
$('body').on('click', '#eliminar_lista_agregados_chef', function() {
  $(this)
    .closest('li')
    .remove();
});

// * Añade un tipo de cobertura a la lista de la promo
$('#btn_add_tipo_coberturas_promo_chef').click(function() {
  var listaHtml = `<li id-tipo-cobertura='${$(
    '#combo_agregados_promo_chef_form'
  ).val()}' cantidad-tipo-cobertura='${$(
    '#txt_cantidad_tipo_coberturas_chef'
  ).val()}'>${$('#txt_cantidad_tipo_coberturas_chef').val()} - ${$(
    '#combo_tipo_coberturas_promo_form_chef option:selected'
  ).text()} <a id="eliminar_lista_tipo_cobertura_chef" href="#">Eliminar<a/></li>`;

  $('#lista_tipo_coberturas_chef').append(listaHtml);
});

// *Elimina el agregado de la lista de la promo
$('body').on('click', '#eliminar_lista_tipo_cobertura_chef', function() {
  $(this)
    .closest('li')
    .remove();
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
      max: 140,
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
      max: 'La cantidad máxima es 140',
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
          if (
            $('#imagen_promo').val() != '' ||
            imgExtension == 'jpg' ||
            imgExtension == 'png' ||
            imgExtension == 'jpeg'
          ) {
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
            $('#imagen_agregados').val() != '' ||
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
              swal('Listo', 'El elemento fue eliminado', 'success');
              cargarMantenedorPromosCliente();
              break;
            case '2':
              swal('Error', 'El elemento no pudo ser eliminado', 'error');
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
      max: 140,
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
      max: 'La cantidad máxima es 140',
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
          agregados.push([
            $(this).attr('id-tipo-cobertura'),
            $(this).attr('cantidad-tipo-cobertura')
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
        formData.append('tipocoberturas', tipocoberturas);

        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *Dependiendo de la acción se anexan más datos al formulario (formData)

        if ($('#lbl_id_promo_chef').text() == '') {
          let action = 'IngresarPromoChef';
          formData.append('action', action);
          if (
            $('#imagen_promo').val() != '' ||
            imgExtension == 'jpg' ||
            imgExtension == 'png' ||
            imgExtension == 'jpeg'
          ) {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
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
            $('#imagen_agregados').val() != '' ||
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
