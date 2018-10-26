'use strict';

var _txt_telefono;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function cargarMantenedorAgregados(estado, caracter) {
  var action = 'CargarMantenedorAgregados';
  var cargaHtml = '';
  var arrayNoEnCarta = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despAgregados.php',
    type: 'POST',
    success: function success(respuesta) {
      console.log('respuesta exitosa');
      // *----------------------------------------------------------------------
      // *Se filtra el array obtenido en base a los parámetros obtenidos
      var arrFilter = '';
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      if (estado == null || estado == 'Todos') {
        arrFilter = JSON.parse(respuesta);
      } else {
        arrFilter = arr.filter(function (n) {
          return n.Estado == estado && n.Nombre.toLowerCase().indexOf(caracter) > -1;
        });
      }
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arrFilter, function (indice, item) {
            // *Si el item tiene como indice el valor 2 este se ingresará en el array indicado
            if (item.IdEstado == 2) {
              arrayNoEnCarta.push(item.Nombre);
            }

            cargaHtml += '<div class="col s12 m4 l4">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += '<div class="descuento"><p class="center-align">-' + item.Descuento + '%</p></div>';
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="uploads/' + item.ImgUrl + '">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + ' ' + item.Unidades + 'u<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += '<span class="grey-text text-darken-4">Precio normal: $' + item.Precio + '</span>';
            cargaHtml += '<span class="grey-text text-darken-4">Precio descuento: $' + (item.Precio - item.Precio / 100 * item.Descuento) + '</span>';
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarAgregadoM(' + item.IdAgregado + ')"><i class="material-icons">edit</i></a>';
            cargaHtml += '<h5 class="grey-text text-darken-4">' + item.Estado + '</h5>';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light red" onclick="eliminarAgregadoM(' + item.IdAgregado + ')"><i class="material-icons">delete</i></a>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-reveal">';
            cargaHtml += '<span class="card-title grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">close</i></span>';
            cargaHtml += '<p>' + item.Descripcion + '</p>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayNoEnCarta.length > 0) {
            var htmlNoEnCarta = '<div class="mensaje-precaucion-indice" id="mensaje_indice_no_carta_agregados"><p><b>Atenci\xF3n!:</b> Existen ' + arrayNoEnCarta.length + ' agregados (' + arrayNoEnCarta.join(', ') + ') que no est\xE1n en carta. Recuerda que estos no podr\xE1n ser adquiridos por el cliente.</p></div>';
            $('#mensaje_no_carta_agregados').html(htmlNoEnCarta);
          } else {
            $('#mensaje_indice_no_carta_agregados').remove();
          }

          $('#agregados_carga').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarAgregadoM(id) {
  var action = 'EliminarAgregado';
  var actionGetDatos = 'ComprobarVinculacionAgregados';
  $.ajax({
    data: 'action=' + actionGetDatos + '&id=' + id,
    url: '../app/control/despAgregados.php',
    type: 'POST',
    success: function success(respuestaDatosVinculados) {
      switch (respuestaDatosVinculados) {
        case '1':
          swal({
            title: '¿Estás seguro?',
            text: 'Al ser eliminada esta cobertura ya no podrá ser seleccionada para ser adquirida, ni vinculada a una promo.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
          }).then(function (result) {
            if (result.value) {
              $.ajax({
                data: {
                  action: action,
                  id: id
                },
                url: '../app/control/despAgregados.php',
                type: 'POST',
                success: function success(resp) {
                  switch (resp) {
                    case '1':
                      swal('Listo', 'El producto fue eliminado', 'success');
                      cargarMantenedorAgregados();
                      break;
                    case '2':
                      swal('Error', 'El producto no pudo ser eliminado', 'error');
                      break;
                    case '3':
                      swal('Error', 'El producto no puede ser eliminado ya que una promo lo contiene', 'error');
                      break;
                  }
                },
                error: function error() {
                  alert('Lo sentimos ha habido un error inesperado');
                }
              });
            }
          });
          break;
        default:
          swal('Error', 'El producto no pudo ser eliminado ya que est\xE1 vinculado a las promos \'' + respuestaDatosVinculados + '\'', 'error');
          break;
      }
    },
    error: function error() {
      swal('Error', 'El producto no pudo ser eliminado', 'error');
    }
  });
}

// *Se cargan los combobox del mantenedor
function cargarComboEstadoElemento() {
  var action = 'CargarComboEstadoElemento';
  $('select').formSelect();
  var cargaHtml = '';
  var cargaHtmlFiltro = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despEstadoElementos.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option disabled selected>Estado</option>';
      cargaHtmlFiltro += '<option selected>Todos</option>';
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.Id + '\'>' + item.Descripcion + '</option>';
        cargaHtmlFiltro += '<option value=\'' + item.Id + '\'>' + item.Descripcion + '</option>';
      });
      $('select[name="combo_estado_elemento"]').html(cargaHtml);
      $('select[name="combo_estado_elemento_filtro"]').html(cargaHtmlFiltro);
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarAgregadoM(id) {
  $('#modal_mantenedor_agregado').modal('open');
  $('#accion_agregados').text('Actualizar Agregado');
  var action = 'CargarModalAgregado';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_agregados"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_agregados').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despAgregados.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id').text(item.Id);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Nombre);
        $('label[for=\'txt_descripcion\']').addClass('active');
        $('#txt_descripcion').val(item.Descripcion);
        $('label[for=\'txt_unidades\']').addClass('active');
        $('#txt_unidades').val(item.Unidades);
        $('label[for=\'txt_precio_agregado\']').addClass('active');
        $('#txt_precio_agregado').val(item.Precio);
        $('label[for=\'txt_descuento_agregado\']').addClass('active');
        $('#txt_descuento_agregado').val(item.Descuento);
        $('#precio_descuento_agregado').text('$\n          ' + (item.Precio - item.Precio / 100 * item.Descuento));
        $('#imagen_agregados_text').val(item.ImgUrl);
        $('#combo_estado_elemento_form').val(item.Estado);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_agregado').keyup(function () {
  var precioFinalDescuento = $('#txt_precio_agregado').val() - $('#txt_precio_agregado').val() / 100 * $('#txt_descuento_agregado').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_agregado').text('0');
  } else {
    $('#precio_descuento_agregado').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_agregado').change(function () {
  var precioFinalDescuento = $('#txt_precio_agregado').val() - $('#txt_precio_agregado').val() / 100 * $('#txt_descuento_agregado').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_agregado').text('0');
  } else {
    $('#precio_descuento_agregado').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_agregado').keyup(function () {
  var precioFinalDescuento = $('#txt_precio_agregado').val() - $('#txt_precio_agregado').val() / 100 * $('#txt_descuento_agregado').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_agregado').text('0');
  } else {
    $('#precio_descuento_agregado').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_agregado').change(function () {
  var precioFinalDescuento = $('#txt_precio_agregado').val() - $('#txt_precio_agregado').val() / 100 * $('#txt_descuento_agregado').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_agregado').text('0');
  } else {
    $('#precio_descuento_agregado').text('$ ' + precioFinalDescuento);
  }
});

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_actualizar_agregados').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_agregado').modal('close');
});

var validarFormActualizarAgregados = $('#form_mantenedor_agregado').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 100
    },
    txt_descripcion: {
      required: true,
      minlength: 3,
      maxlength: 1000
    },
    txt_unidades: {
      required: true,
      min: 1,
      max: 200
    },
    txt_precio_agregado: {
      required: true,
      min: 100,
      max: 1000000,
      digits: true
    },
    txt_descuento_agregado: {
      required: true,
      min: 0,
      max: 100,
      digits: true
    },
    combo_estado_elemento: {
      required: true
    },
    imagen_agregados: {
      // required: true,
      extension: 'jpeg|jpg|png'
    },
    imagen_agregados_text: {
      // required: true
    }
  },
  messages: {
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_descripcion: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 1000 caracteres'
    },
    txt_unidades: {
      required: 'Campo requerido *',
      min: 'El valor mínimo es 1',
      max: 'Valor máximo 1000000'
    },
    txt_precio_agregado: {
      required: 'Campo requerido *',
      min: 'El valor mínimo es $100',
      max: 'Valor máximo $1000000',
      digits: 'Ingresa solo números'
    },
    txt_descuento_agregado: {
      required: 'Campo requerido *',
      min: 'El porcentaje mínimo es 0',
      max: 'El porcentaje máximo es 100',
      digits: 'Ingresa sólo números'
    },
    combo_estado_elemento: {
      required: 'Selecciona una opción'
    },
    imagen_agregados: {
      // required: '',
      extension: 'Ingresa un archivo válido (png, jpg, jpeg)'
    },
    imagen_agregados_text: {
      // required: 'Selecciona una imagen'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    // *Sweet alert para mostrar mensaje de confirmación de acción
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        // *imgExtension obtiene la extensión de la imagen
        var imgExtension = $('#imagen_agregados').val().substr($('#imagen_agregados').val().lastIndexOf('.') + 1);
        // *La variable formData inicializa el formulario al cual se le pasan los datos usando append
        var formData = new FormData();
        formData.append('nombre', $('#txt_nombre').val());
        formData.append('descripcion', $('#txt_descripcion').val());
        formData.append('unidades', $('#txt_unidades').val());
        formData.append('precio', $('#txt_precio_agregado').val());
        formData.append('descuento', $('#txt_descuento_agregado').val());
        formData.append('estado', $('#combo_estado_elemento_form').val());

        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *Dependiendo de la acción se anexan más datos al formulario (formData)

        if ($('#lbl_id').text() == '') {
          var _action = 'IngresarAgregados';
          formData.append('action', _action);
          if ($('#imagen_agregados').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
            console.log('imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('no imagen');
          }
        } else {
          var actionUpdate = 'ActualizarDatosAgregados';
          formData.append('id', $('#lbl_id').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if ($('#imagen_agregados').val() != '' || imgExtension == 'jpg' || imgExtension == 'png' || imgExtension == 'jpeg') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
            console.log('Imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('No Imagen');
          }
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: formData,
          url: '../app/control/despAgregados.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                $('#modal_mantenedor_agregado').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                cargarMantenedorAgregados();
                // *La función se ejecutó correctamente
                break;
              case '2':
                swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                break;
              default:
                console.log(resp);
            }
          },
          error: function error() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});

$('#combo_estado_agregados_filtro').change(function (item) {
  cargarMantenedorAgregados($(this).find('option:selected').text(), $('#txt_buscar_agregados').val());
  /* 
  //*Al cambiar el valor del combobox de filtro se ejecuta la función de cargar mantenedor y se pasan los dos parámetros
  //*que la función solicita. El primer parámetro es el valor seleccionado del combobox, y el segundo es el valor de la caja de búsqueda
  //*De esta manera se cargan los datos que coincidan con estos dos parámetros
  */
});

$('#combo_estado_agregados_filtro').keyup(function (item) {
  cargarMantenedorAgregados($('#combo_estado_agregados_filtro').find('option:selected').text(), $(this).val());
  // *La función de carga de los datos se ejecuta al presionar la tecla y pasa como parámetros el valor ingresado en la caja de texto
  // *y además el valor seleccionado del combobox
});

//! Añadir función para validar extensión de imagen

function cargarMantenedorCoberturas(estado, caracter) {
  var action = 'CargarMantenedorCoberturas';
  var cargaHtml = '';
  // *Los arrays almacenarán los datos de aquellas coberturas que no puedan ser seleccionados por el cliente
  var arrayIndiceNinguno = [];
  var arrayNoEnCarta = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function success(respuesta) {
      // *----------------------------------------------------------------------
      // *Se filtra el array obtenido en base a los parámetros obtenidos
      var arrFilter = '';
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      if (estado == null || estado == 'Todos') {
        arrFilter = JSON.parse(respuesta);
      } else {
        arrFilter = arr.filter(function (n) {
          return n.Estado == estado && n.Nombre.toLowerCase().indexOf(caracter) > -1;
        });
      }
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arrFilter, function (indice, item) {
            // *Si el item tiene como indice el valor ninguno este se insertará en el array indicado
            if (item.Indice == 'Ninguno') {
              arrayIndiceNinguno.push(item.Nombre);
            }
            // *Si el item tiene como indice el valor 2 este se ingresará en el array indicado
            if (item.IdEstado == 2) {
              arrayNoEnCarta.push(item.Nombre);
            }

            cargaHtml += '<div class="col s12 m4 l4">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="uploads/' + item.ImgUrl + '">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += '<span class="grey-text text-darken-4">Precio Adicional: $' + item.Precio + '</span>';
            // *Si el indice es igual a 'Ninguno' el texto se marca en rojo
            if (item.Indice != 'Ninguno') {
              cargaHtml += '<span class="grey-text text-darken-4" indice-cobertura="' + item.Indice + '">Opci\xF3n de elecci\xF3n: ' + item.Indice + '</span>';
            } else {
              cargaHtml += '<span class="red-text" indice-cobertura="' + item.Indice + '">Opci\xF3n de elecci\xF3n: ' + item.Indice + '</span>';
            }
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light blue" name="indice_cobertura" onclick="actualizarCoberturaM(' + item.IdCobertura + ')"><i class="material-icons">edit</i></a>';
            cargaHtml += '<h5 class="grey-text text-darken-4">' + item.Estado + '</h5>';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light red" name="indice_cobertura" onclick="eliminarCoberturaM(' + item.IdCobertura + ')"><i class="material-icons">delete</i></a>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-reveal">';
            cargaHtml += '<span class="card-title grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">close</i></span>';
            cargaHtml += '<p>' + item.Descripcion + '</p>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayIndiceNinguno.length > 0) {
            var htmlNoIndice = '<div class="mensaje-precaucion-indice" id="mensaje_indice_coberturas"><p><b>Atenci\xF3n!:</b> Existen ' + arrayIndiceNinguno.length + ' coberturas (' + arrayIndiceNinguno.join(', ') + ') que no poseen un \xEDndice de selecci\xF3n. Recuerda que estos no podr\xE1n ser elegidos por el cliente.</p></div>';
            $('#mensaje_no_indice_cobertura').html(htmlNoIndice);
          } else {
            $('#mensaje_indice_coberturas').remove();
          }
          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayNoEnCarta.length > 0) {
            var htmlNoEnCarta = '<div class="mensaje-precaucion-indice" id="mensaje_indice_no_carta_coberturas"><p><b>Atenci\xF3n!:</b> Existen ' + arrayNoEnCarta.length + ' coberturas (' + arrayNoEnCarta.join(', ') + ') que no est\xE1n en carta. Recuerda que estos no podr\xE1n ser elegidos por el cliente.</p></div>';
            $('#mensaje_no_carta_cobertura').html(htmlNoEnCarta);
          } else {
            $('#mensaje_indice_no_carta_coberturas').remove();
          }

          // *Se cargan los datos de la bd en la pantalla
          $('#coberturas_carga').html(cargaHtml);

          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

$('#combo_estado_coberturas_filtro').change(function (item) {
  cargarMantenedorCoberturas($(this).find('option:selected').text(), $('#txt_buscar_coberturas').val());
  /* 
    //*Al cambiar el valor del combobox de filtro se ejecuta la función de cargar mantenedor y se pasan los dos parámetros
    //*que la función solicita. El primer parámetro es el valor seleccionado del combobox, y el segundo es el valor de la caja de búsqueda
    //*De esta manera se cargan los datos que coincidan con estos dos parámetros
    */
});

$('#txt_buscar_coberturas').keyup(function (item) {
  cargarMantenedorCoberturas($('#combo_estado_coberturas_filtro').find('option:selected').text(), $(this).val());
  // *La función de carga de los datos se ejecuta al presionar la tecla y pasa como parámetros el valor ingresado en la caja de texto
  // *y además el valor seleccionado del combobox
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarCoberturaM(id) {
  var action = 'EliminarCobertura';
  var actionGetDatos = 'ComprobarVinculacionCoberturas';
  $.ajax({
    data: 'action=' + actionGetDatos + '&id=' + id,
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function success(respuestaDatosVinculados) {
      switch (respuestaDatosVinculados) {
        case '1':
          swal({
            title: '¿Estás seguro?',
            text: 'Al ser eliminada esta cobertura ya no podrá ser seleccionada para ser adquirida, ni vinculada a un tipo de cobertura.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
          }).then(function (result) {
            if (result.value) {
              $.ajax({
                data: {
                  action: action,
                  id: id
                },
                url: '../app/control/despCoberturas.php',
                type: 'POST',
                success: function success(resp) {
                  switch (resp) {
                    case '1':
                      swal('Listo', 'El producto fue eliminado', 'success');
                      cargarMantenedorCoberturas();
                      break;
                    case '2':
                      swal('Error', 'El producto no pudo ser eliminado', 'error');
                      break;
                    case '3':
                      swal('Error', 'El producto no puede ser eliminado ya que un tipo de cobertura lo contiene', 'error');
                      break;
                  }
                },
                error: function error() {
                  alert('Lo sentimos ha habido un error inesperado');
                }
              });
            }
          });
          break;
        default:
          swal('Error', 'El producto no pudo ser eliminado ya que est\xE1 vinculado a los tipos de cobertura \'' + respuestaDatosVinculados + '\'', 'error');
          break;
      }
    },
    error: function error() {
      swal('Error', 'El producto no pudo ser eliminado', 'error');
    }
  });
}

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarCoberturaM(id) {
  $('#accion_coberturas').text('Actualizar Cobertura');
  $('#modal_mantenedor_cobertura').modal('open');
  var action = 'CargarModalCobertura';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_coberturas"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_coberturas').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function success(respuesta) {
      // alert(respuesta);
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_cobertura').text(item.IdCobertura);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Nombre);
        $('label[for=\'txt_descripcion\']').addClass('active');
        $('#txt_descripcion').val(item.Descripcion);
        $('label[for=\'txt_precio_cobertura\']').addClass('active');
        $('#txt_precio_cobertura').val(item.Precio);
        $('#combo_estado_cobertura').val(item.Estado);
        $('#imagen_coberturas_text').val(item.ImgUrl);
        $('#combo_indice_cobertura').val(item.Indice);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Se cargan los combobox del mantenedor
function cargarIndiceCobertura() {
  var action = 'CargarIndiceCoberturas';
  $('select').formSelect();
  var cargaHtml = '';
  var cargaHtmlFiltro = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despIndiceCobertura.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option disabled selected>\xCDndice</option>';
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.IdIndiceCobertura + '\'>' + item.Descripcion + '</option>';
      });
      $('#combo_indice_cobertura').html(cargaHtml);
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_cobertura').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_cobertura').modal('close');
});

var validarFormCoberturas = $('#form_mantenedor_cobertura').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 100
    },
    txt_descripcion: {
      required: true,
      minlength: 3,
      maxlength: 1000
    },
    txt_precio_cobertura: {
      required: true,
      min: 0,
      max: 1000000,
      digits: true
    },
    combo_estado_elemento: {
      required: true
    },
    combo_indice_cobertura: {
      required: true
    },
    imagen_coberturas: {
      // required: true,
      extension: 'jpeg|jpg|png'
    },
    imagen_coberturas_text: {
      // required: true
    }
  },
  messages: {
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_descripcion: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 1000 caracteres'
    },
    txt_precio_cobertura: {
      required: 'Campo requerido *',
      min: 'El valor mínimo es 0',
      max: 'Valor máximo $1000000',
      digits: 'Ingresa solo números'
    },
    combo_estado_elemento: {
      required: 'Selecciona una opción'
    },
    combo_indice_cobertura: {
      required: 'Selecciona una opción'
    },
    imagen_coberturas: {
      // required: '',
      extension: 'Ingresa un archivo válido (png, jpg, jpeg)'
    },
    imagen_coberturas_text: {
      // required: 'Selecciona una imagen'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        // *imgExtension obtiene la extensión de la imagen
        var imgExtension = $('#imagen_coberturas').val().substr($('#imagen_coberturas').val().lastIndexOf('.') + 1);

        // *La variable formData inicializa el formulario al cual se le pasan los datos usando append
        var formData = new FormData();
        formData.append('nombre', $('#txt_nombre').val());
        formData.append('descripcion', $('#txt_descripcion').val());
        formData.append('precio', $('#txt_precio_cobertura').val());
        formData.append('estado', $('#combo_estado_cobertura').val());
        formData.append('indice', $('#combo_indice_cobertura').val());
        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará una nueva 'cobertura'
        // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
        if ($('#lbl_id_cobertura').text() == '') {
          var _action2 = 'IngresarCobertura';
          formData.append('action', _action2);
          if ($('#imagen_coberturas').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
          } else {
            formData.append('imagenUrl', '');
          }
        } else {
          var actionUpdate = 'ActualizarDatosCobertura';
          formData.append('id', $('#lbl_id_cobertura').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if ($('#imagen_coberturas').val() != '' || imgExtension == 'jpg' || imgExtension == 'png' || imgExtension == 'jpeg') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
          } else {
            formData.append('imagenUrl', '');
          }
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: formData,
          url: '../app/control/despCoberturas.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                $('#modal_mantenedor_cobertura').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                cargarMantenedorCoberturas();
                // *La función se ejecutó correctamente
                break;
              case '2':
                swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                break;
            }
          },
          error: function error() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});
// *--------------------------------------------------------------------
// *Se carga el total de indices en la tabla indicesrelleno sin contar el id 1 correspondiente a 'Nunguno'
function cargarTotalIndiceCoberturas() {
  var action = 'CargarTotalIndiceCoberturas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despIndiceCobertura.php',
    type: 'POST',
    success: function success(respuesta) {
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error al cargar la cantidad de indices de cobertura');
          break;
        default:
          cargaHtml += '<p>' + respuesta + '</p>';
          cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="sumarIndiceCobertura()"><i class="fa fa-plus"></i></a>';
          cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light red" onclick="restarIndiceCobertura(' + respuesta + ')"><i class="fa fa-minus"></i></a>';
          $('#indice_cobertura_carga').html(cargaHtml);
          break;
      }
    }
  });
}

// *La función elimina el último valor de la tabla de indices y luego actualiza los demás al valor '1' (Ninguno)
function obtenerDatosVinculadosIndiceCobertura() {
  var actionGetDatos = 'ObtenerDatosVinculadosIndiceCobertura';
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despIndiceCobertura.php',
    type: 'POST',
    success: function success(respuesta) {},
    error: function error() {
      returnValueAjax('algunos');
    }
  });
}

function returnValueAjax(value) {
  return value;
}

function restarIndiceCobertura() {
  var actionGetDatos = 'ObtenerDatosVinculadosIndiceCobertura';
  $.ajax({
    data: 'action=' + actionGetDatos,
    url: '../app/control/despIndiceCobertura.php',
    type: 'POST',
    success: function success(respuestaDatosVinculados) {
      var action = 'RestarIndiceCoberturas';
      //*Se envían datos del form y action, al controlador mediante ajax
      swal({
        title: '¿Estás seguro?',
        text: 'Existen ' + respuestaDatosVinculados + ' coberturas vinculadas a este \xEDndice, al elimnarlo estos no podr\xE1n ser seleccionados por el cliente.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar'
      }).then(function (result) {
        if (result.value) {
          $.ajax({
            data: 'action=' + action,
            url: '../app/control/despIndiceCobertura.php',
            type: 'POST',
            success: function success(respuesta) {
              switch (respuesta) {
                case '1':
                  cargarTotalIndiceCoberturas();
                  cargarMantenedorCoberturas();
                  cargarIndiceCobertura();
                  swal('Listo', 'Se ha restado un \xEDndice, ' + respuestaDatosVinculados + ' coberturas han quedado sin \xEDndice de selecci\xF3n, por lo tanto no podr\xE0n ser seleccionadas por el cliente.', 'success');
                  break;
                case '2':
                  swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                  break;
              }
            }
          });
        }
      });
    }
  });
}

// *La función elimina el último valor de la tabla de indices y luego actualiza los demás al valor '1' (Ninguno)
function sumarIndiceCobertura() {
  var action = 'AgregarIndiceCoberturas';
  //*Se envían datos del form y action, al controlador mediante ajax
  swal({
    title: '¿Estás seguro?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        data: 'action=' + action,
        url: '../app/control/despIndiceCobertura.php',
        type: 'POST',
        success: function success(respuesta) {
          switch (respuesta) {
            case '1':
              // *Ingreso exitoso
              cargarTotalIndiceCoberturas();
              cargarMantenedorCoberturas();
              cargarIndiceCobertura();
              swal('Listo', 'Se ha sumado un índice', 'success');
              break;
            case '2':
              swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
              break;
          }
        }
      });
    }
  });
}

$(document).ready(function () {
  // *Activa sidenav
  $('.sidenav').sidenav();
  // *Activa parallax
  $('.parallax').parallax();
  // *Activa función de scrollspy
  $('.scrollspy').scrollSpy();
  // *Activa modal
  $('.modal').modal();
  // *Activa collapsible
  $('.collapsible').collapsible();
  // *Activa dropdown en li nav
  $('.dropdown-trigger').dropdown();
  // *Activa tabs
  $('.tabs').tabs();
  //* Activa slider
  $('.slider').slider();
  $('.dropdown-trigger').dropdown();
});

// * Activa funciones de cambios de slide en slider de index
$('.rigth-arrow-slider').click(function () {
  $('.slider').slider('next');
});

$('.left-arrow-slider').click(function () {
  $('.slider').slider('prev');
});
// -----------

function cargaCliente(id) {
  $('#modal-actualiza-cliente').modal('open');
  var action = 'CargaCliente';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_clientes"><p><b>Cuidado!:</b> Considera que puede que este usuario esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_clientes').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action + '&id=' + id,
    url: '../app/control/despCliente.php',
    type: 'POST',
    success: function success(respuesta) {
      // alert(respuesta);
      var arr = JSON.parse(respuesta);
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          swal('Error', 'Lo sentimos ha ocurrido un error', 'error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            $('#lbl_id_clientes').text(id);
            $("label[for='txt_nombre']").addClass('active');
            $('#txt_nombre').val(item.Nombre);
            $('label[for=\'txt_apellidos\']').addClass('active');
            $('#txt_apellidos').val(item.Apellidos);
            $('label[for=\'txt_email\']').addClass('active');
            $('#txt_email').val(item.Correo);
            $('label[for=\'txt_telefono\']').addClass('active');
            $('#txt_telefono').val(item.Telefono);
            $('#combo_EstadoClientes').val(item.idEstado);
          });
          break;
      }
    },
    error: function error() {
      swal('Error', 'Lo sentimos ha ocurrido un error', 'error');
    }
  });
}

$('#ActualizaCliente').validate({
  //*Se utiliza jquery validate para validar campos del formulario
  errorClass: 'invalid red-text', //*Clase añadida post-error
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de error
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_apellidos: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_email: {
      required: true,
      emailCom: true
    },
    txt_telefono: {
      required: true,
      digits: true,
      min: 11111111,
      max: 99999999
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un nombre válido',
      maxlength: 'Máximo permitido 45 caracteres'
    },
    txt_apellidos: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un apellido válido',
      maxlength: 'Máximo permitido 45 caracteres'
    },
    txt_email: {
      required: 'Campo requerido *',
      emailCom: 'Correo inválido (ejemplo: dmc@gmail.com)'
    },
    txt_telefono: {
      required: 'Campo requerido *',
      digits: 'Solo numeros',
      min: 'No menor a 7 numeros',
      max: 'No pueder ser mayor a 8'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var _action3 = 'ActualizaCliente';
        var idCliente = $('#lbl_id_clientes').text();
        var nombre = $('#txt_nombre').val();
        var apellidos = $('#txt_apellidos').val();
        var email = $('#txt_email').val();
        var telefono = $('#txt_telefono').val();
        var idEstado = $('#combo_EstadoClientes').val();
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: {
            id: idCliente,
            nombre: nombre,
            apellidos: apellidos,
            telefono: telefono,
            email: email,
            idEstado: idEstado,
            action: _action3
          },
          url: '../app/control/despCliente.php',
          type: 'POST',
          success: function success(resp) {
            // alert(resp);
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                //*El cambio se realizó exitosamente
                // alert(resp);
                swal('Listo', 'El cliente fue actualizado', 'success');
                $('#modal-actualiza-cliente').modal('close');
                CargarTablaClientes();
                break;
              case '2':
                swal('Error', 'El cliente fue eliminado', 'error');
                break;
              default:
                swal('Error', 'Lo sentimos ha ocurrido un error', 'error');
            }
          },
          error: function error() {
            swal('Error', 'Lo sentimos ha ocurrido un error', 'error');
          }
        });
      }
    });
  }
});

// *Se cargan los combobox del mantenedor
function CargaEstadoCliente() {
  var action = 'CargaEstadoCliente';
  $('select').formSelect();
  var cargaHtml = '';
  var cargaHtmlFiltro = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/depIndiceEstadoCli.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option disabled selected>Estado Cliente</option>';
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.idEstado + '\'>' + item.Estado + '</option>';
      });
      $('#combo_EstadoClientes').html(cargaHtml);
    },
    error: function error() {
      swal('Error', 'Lo sentimos ha ocurrido un error', 'error');
    }
  });
}
// cancela el modal
$('#cancelar_actualizar_cliente').on('click', function (evt) {
  evt.preventDefault();
  $('#modal-actualiza-cliente').modal('close');
});

function EliminarClientes(id) {
  var action = 'EliminarCliente';
  swal({
    title: '¿Estás seguro?',
    text: 'Una vez eliminado el usuario no podrá acceder más al sitio ni a las funcionalidades de este.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.value) {
      // alert(id);
      $.ajax({
        data: 'action=' + action + '&id=' + id,
        url: '../app/control/despCliente.php',
        type: 'POST',
        success: function success(resp) {
          if (parseInt(resp) == 1) {
            swal('Listo', 'El cliente fue eliminado', 'success');
            CargarTablaClientes();
          } else {
            swal('Error', 'El cliente no pudo ser eliminado', 'error');
          }
        }
      });
    }
  });
}

function CargarTablaClientes() {
  var action = 'CargarTablaClientes';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despCliente.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      var tabla = '';
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          swal('Error', 'Lo sentimos ha ocurrido un error', 'error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            // var idCliente = item.idCliente;
            tabla += '<tr><td>' + item.Nombre + '</td>';
            tabla += '<td>' + item.Apellidos + '</td>';
            tabla += '<td>' + item.Telefono + '</td>';
            tabla += '<td>' + item.Correo + '</td>';
            tabla += '<td>' + item.Estado + '</td>';
            tabla += '<td  class="center-align"><button class="btn btn-floating tooltipped red darken-4 waves-effect waves-light "\n              data-position="right" data-tooltip="Eliminar" class=\'delete\' id=' + item.idCliente + ' onclick=\'EliminarClientes(' + item.idCliente + ')\' ><i class="material-icons">delete</i></button></td>';
            tabla += '<td><a class="waves-effect red darken-4 waves-light btn modal-trigger" id="' + item.idCliente + '" onclick=\'cargaCliente(' + item.idCliente + ')\' data-position="right" href="#modal-actualiza-cliente"><i class="material-icons">edit</i></a><td></tr>';
          });
          $('#tabla_clientes').html(tabla);
          break;
      }
    },
    error: function error() {
      swal('Error', 'Lo sentimos ha ocurrido un error', 'error');
    }
  });
}

$('#form_registro2').validate({
  //*Se utiliza jquery validate para validar campos del formulario
  errorClass: 'invalid red-text', //*Clase añadida post-error
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de error
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_apellidos: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_email: {
      required: true,
      emailCom: true
    },
    txt_password: {
      required: true,
      minlength: 10,
      maxlength: 100
    },
    txt_telefono: {
      required: true,
      digits: true,
      min: 11111111,
      max: 99999999
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un nombre válido',
      maxlength: 'Máximo permitido 45 caracteres'
    },
    txt_apellidos: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un apellido válido',
      maxlength: 'Máximo permitido 45 caracteres'
    },
    txt_email: {
      required: 'Campo requerido *',
      emailCom: 'Correo inválido (ejemplo: dmc@gmail.com)'
    },
    txt_password: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 10 caracteres'
    },
    txt_telefono: {
      required: 'Campo requerido *',
      digits: 'Solo numeros',
      min: 'No menor a 7 numeros',
      max: 'No pueder ser mayor a 9'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler() {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var action = 'RegistroClienteMantenedor';
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: $('#form_registro2').serialize() + '&action=' + action,
          url: '../app/control/despCliente.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                swal('Error', 'El correo ya fue registrado', 'error');
                break;
              case '2':
                swal('Listo', 'El cliente fue ingresado correctamente', 'success');
                $('#form_registro2')[0].reset();
                CargarTablaClientes();
                $('#modal-actualiza-cliente').modal('close');
                break;
            }
          },
          error: function error() {
            swal('Error', 'Ups ocurrio un error', 'error');
          }
        });
      }
    });
  }
});

//*Se anadió nuevo método para validar que el campo seleccionado solo contenga letras
jQuery.validator.addMethod('lettersonly', function (value, element) {
  return this.optional(element) || /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/i.test(value);
}, 'Ingresa solo letras por favor');

$('#txt_filtro_cliente').on('keyup', function () {
  var filtroCliente = $(this).val().toLowerCase();
  $('#tabla_clientes tr').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(filtroCliente) > -1);
  });
});

function cargarDatosPerfilCliente() {
  var action = 'ObtenerDatosPerfil';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despCliente.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            $('#txt_nombre').val(item.Nombre);
            $('#txt_apellidos').val(item.Apellidos);
            $('#txt_correo').val(item.Correo);
            if (item.Telefono === 'NULL') {
              $('#txt_telefono').val('');
            } else {
              $('#txt_telefono').val(item.Telefono);
            }
          });
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Login clientes
// *Validación de formulario de cambios de datos para el cliente cuya sesión esté activa
var validatorDatosFormCliente = $('#form-editar-perfil-cliente').validate({
  //*configuración de jquery validata para la validación de campos
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_apellidos: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_telefono: (_txt_telefono = {
      minlength: true
    }, _defineProperty(_txt_telefono, 'minlength', 8), _defineProperty(_txt_telefono, 'maxlength', 8), _defineProperty(_txt_telefono, 'digits', true), _defineProperty(_txt_telefono, 'min', 11111111), _defineProperty(_txt_telefono, 'max', 99999999), _txt_telefono)
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un nombre válido',
      maxlength: 'Máximo permitido 45 caracteres',
      lettersonly: 'Solo letras por favor'
    },
    txt_apellidos: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un nombre válido',
      maxlength: 'Máximo permitido 45 caracteres',
      lettersonly: 'Solo letras por favor'
    },
    txt_telefono: {
      minlength: 'Ingresa un número válido (8 digitos)',
      maxlength: 'Ingresa un número válido (8 digitos)',
      digits: 'Solo números',
      min: 'Ingresa un número válido',
      max: 'Ingresa un número válido'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var _action4 = 'EditarPerfilCliente';
        var nombre = $('#txt_nombre').val();
        var apellidos = $('#txt_apellidos').val();
        var telefono = $('#txt_telefono').val();
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: {
            txt_nombre: nombre,
            txt_apellidos: apellidos,
            txt_telefono: telefono,
            action: _action4
          },
          url: '../app/control/despCliente.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                //*El cambio se realizó exitosamente
                console.log('exito');
                swal('Listo', 'Tus datos han sido actualizados', 'success');
                cargarDatosPerfilCliente();
                break;
              case '2':
                //* El cambio no se pudo llevar a cabo por un error inesperado
                M.toast({
                  html: 'Lo sentimos ha ocurrido un error inesperado',
                  displayLength: 3000,
                  classes: 'red'
                });
                break;
              default:
                console.log(resp);
            }
          },
          error: function error() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});

//* Validación del formulario para cambiar la clave del cliente
var validatorPassFormCliente = $('#form-pass-cliente').validate({
  //*configuración de jquery validata para la validación de campos
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_pass_actual: {
      required: true,
      minlength: 10,
      maxlength: 100
    },
    txt_pass_nueva: {
      required: true,
      minlength: 10,
      maxlength: 100,
      notEqual: '#txt_pass_actual'
    },
    txt_pass_confirmar: {
      required: true,
      minlength: 10,
      maxlength: 100,
      equalTo: '#txt_pass_nueva'
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_pass_actual: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 10 caracteres',
      maxlength: 'Máximo 10 caracteres'
    },
    txt_pass_nueva: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 10 caracteres',
      maxlength: 'Máximo 10 caracteres',
      notEqual: 'La nueva contraseña no puede ser igual a la actual'
    },
    txt_pass_confirmar: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 10 caracteres',
      maxlength: 'Máximo 10 caracteres',
      equalTo: 'Las contraseñas no coinciden'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    var action = 'ConfirmarPassCliente';
    var pass_actual = $('#txt_pass_actual').val();
    var pass_nueva = $('#txt_pass_nueva').val();
    var pass_confirmar = $('#txt_pass_confirmar').val();
    //*Se envían datos del form y action, al controlador mediante ajax
    $.ajax({
      data: {
        txt_pass_actual: pass_actual,
        action: action
      },
      url: '../app/control/despCliente.php',
      type: 'POST',
      success: function success(resp) {
        //*Acción a ejecutar si la respuesta existe
        switch (resp) {
          case '1':
            swal({
              title: '¿Estás seguro?',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si',
              cancelButtonText: 'Cancelar'
            }).then(function (result) {
              if (result.value) {
                //* La contraseña del primer campo (actual) coincide con la almacenada en BD
                var action2 = 'CambiarPassCliente';
                //* Se ejecuta otra solicitud para llevar a cabo la actualización de la contraseña
                $.ajax({
                  data: {
                    txt_pass_nueva: pass_nueva,
                    txt_pass_confirmar: pass_confirmar,
                    action: action2
                  },
                  url: '../app/control/despCliente.php',
                  type: 'POST',
                  success: function success(respuesta) {
                    switch (respuesta) {
                      case '1':
                        //* La contraseña fue cambiada de manera exitosa
                        M.toast({
                          html: 'La contraseña ha sido cambiada exitosamente',
                          displayLength: 3000,
                          classes: 'green'
                        });
                        $('#modal-password').modal();
                        $('#form-pass-cliente')[0].reset();
                        break;
                      case '2':
                        //* No se ha podido llevar a cabo el cambio de contraseña
                        M.toast({
                          html: 'Lo sentimos ha ocurrido un error inesperado',
                          displayLength: 3000,
                          classes: 'red'
                        });
                        break;
                    }
                  },
                  error: function error() {
                    alert('Lo sentimos ha ocurrido un error');
                  }
                });
              }
            });
            break;
          case '2':
            M.toast({
              html: 'Lo sentimos ha ocurrido un error inesperado',
              displayLength: 3000,
              classes: 'red'
            });
            console.log('error');
            break;
          case '3':
            swal('Error!', 'La contraseña ingresada es incorrecta', 'error');

            $('#txt_pass_actual').addClass('invalid invalid-pass');
            $('#txt_pass_actual').focus(function () {
              if ($('#txt_pass_actual').hasClass('invalid-pass')) {
                $('#txt_pass_actual').removeClass('invalid invalid-pass');
              } else {
                return;
              }
            });
            break;
          default:
            console.log(resp);
        }
      },
      error: function error() {
        alert('Lo sentimos ha ocurrido un error');
      }
    });
  }
});

$('#btn-limpiar-campos-clave').click(function (evt) {
  evt.preventDefault();
  validatorPassFormCliente.resetForm();
  $('#form-pass-cliente')[0].reset();
});

$('#btn-restaurar-datos-cliente').click(function (evt) {
  evt.preventDefault();
  validatorDatosFormCliente.resetForm();
  cargarDatosPerfilCliente();
});

jQuery.validator.addMethod('notEqual', function (value, element, param) {
  return this.optional(element) || value != $(param).val();
});
// });

function cargaModalEmpleado(id) {
  $('#modal_actualiza_empleado').modal('open');
  var action = 'cargaModalEmpleado';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_empleados"><p><b>Cuidado!:</b> Considera que puede que este usuario esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_empleados').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action + '&id=' + id,
    url: '../app/control/despEmpleados.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          swal('error', 'ocurrio un problema', 'error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            $('#lbl_id_empleados').text(id);
            $("label[for='txt_nombre']").addClass('active');
            $('#txt_nombre').val(item.Nombre);
            $('label[for=\'txt_apellidos\']').addClass('active');
            $('#txt_apellidos').val(item.Apellidos);
            $('label[for=\'txt_email\']').addClass('active');
            $('#txt_email').val(item.Correo);
            $('#combo_EstadoEmpleado').val(item.idEstado);
            $('#combo_TipoEmpleado2').val(item.idTipoEmpleado);
          });
          break;
      }
    },
    error: function error() {
      swal('error', 'Lo sentimos ha ocurrido un error', 'error');
    }
  });
}

$('#ActualizaEmpleados').validate({
  //*Se utiliza jquery validate para validar campos del formulario
  errorClass: 'invalid red-text', //*Clase añadida post-error
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de error
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_apellidos: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_email: {
      required: true,
      email: true
    },
    combo_EstadoClientes: {
      required: true
    },
    combo_TipoEmpleado2: {
      required: true
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un nombre válido',
      maxlength: 'Máximo permitido 45 caracteres'
    },
    txt_apellidos: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un apellido válido',
      maxlength: 'Máximo permitido 45 caracteres'
    },
    txt_email: {
      required: 'Campo requerido *',
      email: 'Correo inválido (ejemplo: dmc@gmail.com)'
    },
    combo_EstadoClientes: {
      required: 'Campo requerido *'
    },
    combo_TipoEmpleado2: {
      required: 'Campo requerido *'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var _action5 = 'ActualizaEmpleados';
        var idEmpleado = $('#lbl_id_empleados').text();
        var nombre = $('#txt_nombre').val();
        var apellidos = $('#txt_apellidos').val();
        var email = $('#txt_email').val();
        var idEstado = $('#combo_EstadoEmpleado').val();
        var idTipoEmp = $('#combo_TipoEmpleado2').val();
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: {
            id: idEmpleado,
            nombre: nombre,
            apellidos: apellidos,
            email: email,
            idEstado: idEstado,
            idTipoEmp: idTipoEmp,
            action: _action5
          },
          url: '../app/control/despEmpleados.php',
          type: 'POST',
          success: function success(resp) {
            // alert(resp);
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                //*El cambio se realizó exitosamente
                swal('Listo', 'Los datos del empleado fueron actualizados', 'success');
                $('#modal_actualiza_empleado').modal('close');
                CargarTablaEmpleados();
                break;
              case '2':
                swal('error', 'Lo sentimos hubo un problema al actualizar los datos.', 'error');
                break;
              default:
                swal('error', 'Lo sentimos hubo un problema al actualizar los datos.', 'error');
            }
          },
          error: function error() {
            swal('error', 'Lo sentimos ha ocurrido un error', 'error');
          }
        });
      }
    });
  }
});

// esta funcion carga el combo box del modal para actualizar el cliente
function CargaEstadoEmpleadoModal() {
  var action = 'CargaEstadoEmpleado';
  $('select').formSelect();
  var cargaHtml = '';
  var cargaHtmlFiltro = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/depIndiceEstadoCli.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option disabled selected>Estado Empleado</option>';
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.idEstado + '\'>' + item.Estado + '</option>';
      });
      $('#combo_EstadoEmpleado').html(cargaHtml);
    },
    error: function error() {
      swal('Error', 'Lo sentimos ha ocurrido un error', 'Error');
    }
  });
}

// respectivamente se cargan los combobox de tipo Empleado como los de arriba
function CargaTipoEmpleado() {
  var action = 'CargaTipoEmpleado';
  $('select').formSelect();
  var cargaHtml = '';
  var cargaHtmlFiltro = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despTipoEmpleado.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option disabled selected>Tipo Empleado</option>';
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.idTipoEmp + '\'>' + item.TipoEmpleado + '</option>';
      });
      $('#combo_TipoEmpleado').html(cargaHtml);
    },
    error: function error() {
      swal('Error', 'Lo sentimos ha ocurrido un error', 'Error');
    }
  });
}

function CargaTipoEmpleadoModal() {
  var action = 'CargaTipoEmpleado';
  $('select').formSelect();
  var cargaHtml = '';
  var cargaHtmlFiltro = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despTipoEmpleado.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option disabled selected>Tipo Empleado</option>';
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.idTipoEmp + '\'>' + item.TipoEmpleado + '</option>';
      });
      $('#combo_TipoEmpleado2').html(cargaHtml);
    },
    error: function error() {
      swal('Error', 'Lo sentimos ha ocurrido un error', 'Error');
    }
  });
}

// cancela el modal
$('#cancelar_actualizar_empleado').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_actualiza_empleado').modal('close');
});

function EliminarEmpleado(id) {
  var action = 'EliminarEmpleado';
  swal({
    title: '¿Estás seguro?',
    text: 'Una vez eliminado el usuario no podrá acceder más al sitio ni a las funcionalidades de este.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        data: 'action=' + action + '&id=' + id,
        url: '../app/control/despEmpleados.php',
        type: 'POST',
        success: function success(resp) {
          switch (resp) {
            case '1':
              swal('Listo', 'El empleado fue eliminado', 'success');
              CargarTablaEmpleados();
              $('#modal_actualiza_empleado').modal('close');
              break;
            case '2':
              swal('Error', 'Lo sentimos pero no puedes eliminar tu cuenta.', 'error');
              break;
          }
        }
      });
    }
  });
}

function CargarTablaEmpleados() {
  var action = 'CargarTablaEmpleados';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despEmpleados.php',
    type: 'POST',
    success: function success(respuesta) {
      //  alert(respuesta);
      var arr = JSON.parse(respuesta);
      var tabla = '';
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          swal('Error', 'Lo sentimos ha ocurrido un error', 'Error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            // var idCliente = item.idCliente;
            tabla += '<tr><td>' + item.Nombre + '</td>';
            tabla += '<td>' + item.Apellidos + '</td>';
            tabla += '<td>' + item.Correo + '</td>';
            tabla += '<td>' + item.TipoEmpleado + '</td>';
            tabla += '<td>' + item.Estado + '</td>';
            tabla += '<td  class="center-align"><button class="btn btn-floating tooltipped red darken-4 waves-effect waves-light "\n                data-position="right" data-tooltip="Eliminar" class=\'delete\' id=' + item.idEmpleado + ' onclick=\'EliminarEmpleado(' + item.idEmpleado + ')\' ><i class="material-icons">delete</i></button></td>';
            tabla += '<td><a class="waves-effect red darken-4 waves-light btn modal-trigger" id="' + item.idEmpleado + '" onclick=\'cargaModalEmpleado(' + item.idEmpleado + ')\' data-position="right" href="#modal-actualiza-cliente"><i class="material-icons">edit</i></a><td></tr>';
          });
          $('#tabla_empleados').html(tabla);
          break;
      }
    },
    error: function error() {
      swal('Error', 'Lo sentimos ha ocurrido un error', 'Error');
    }
  });
}

$('#form_registro_empleado').validate({
  //*Se utiliza jquery validate para validar campos del formulario
  errorClass: 'invalid red-text', //*Clase añadida post-error
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de error
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_apellidos: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_email: {
      required: true,
      email: true
    },
    txt_password: {
      required: true,
      minlength: 10,
      maxlength: 100
    },
    combo_TipoEmpleado: {
      required: true
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un nombre válido',
      maxlength: 'Máximo permitido 45 caracteres'
    },
    txt_apellidos: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un apellido válido',
      maxlength: 'Máximo permitido 45 caracteres'
    },
    txt_email: {
      required: 'Campo requerido *',
      email: 'Correo inválido (ejemplo: dmc@gmail.com)'
    },
    txt_password: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 10 caracteres'
    },
    combo_TipoEmpleado: {
      required: 'Campo requerido *'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler() {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var action = 'RegistroEmpleado';
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: $('#form_registro_empleado').serialize() + '&action=' + action,
          url: '../app/control/despEmpleados.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                swal('error', 'El correo ya fue registrado', 'error');
                break;
              case '2':
                CargarTablaEmpleados();
                limpiarFormulario();
                $('#modal_actualiza_empleado').modal('close');
                swal('Listo', 'El empleado fue registrado', 'success');
                break;
            }
          },
          error: function error() {
            swal('error', 'Ups ocurrio un error', 'error');
          }
        });
      }
    });
  }
});

//*Se anadió nuevo método para validar que el campo seleccionado solo contenga letras
jQuery.validator.addMethod('lettersonly', function (value, element) {
  return this.optional(element) || /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/i.test(value);
}, 'Ingresa solo letras por favor');

function limpiarFormulario() {
  document.getElementById('form_registro_empleado').reset();
}

$('#txt_filtro_empleados').on('keyup', function () {
  var filtroEmpleado = $(this).val().toLowerCase();
  $('#tabla_empleados tr').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(filtroEmpleado) > -1);
  });
});

function CargarTablaInfoContacto() {
  var action = 'CargarMantenedorInfoContacto';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despInfoContacto.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      console.log(respuesta);
      // *Se parsea la respuesta json obtenida
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.medioContacto + '</td>';
            cargaHtml += '<td>' + item.infoContacto + '</td>';
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarInfoContacto(" + item.idContacto + ")'><i class='material-icons'>edit</i></a></td>";
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarInfoContacto(" + item.idContacto + ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_info_contacto').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// // *Función para filtrar los datos en la tabla
// $('#txt_buscar_info_contacto').on('keyup', function() {
//   var caracterFiltro = $(this)
//     .val()
//     .toLowerCase();
//   $('#tabla_info_contacto tr').filter(function() {
//     $(this).toggle(
//       $(this)
//         .text()
//         .toLowerCase()
//         .indexOf(caracterFiltro) > -1
//     );
//   });
// });

// // *La función recibe el id del elemento y ejecuta la query en BD
// function eliminarInfoContacto(id) {
//   var action = 'EliminarInfoContacto';
//   swal({
//     title: '¿Estás seguro?',
//     text:
//       'Al ser eliminada la información de contacto ya no podrá ser visulizada por los clientes.',
//     type: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Si',
//     cancelButtonText: 'Cancelar'
//   }).then(result => {
//     if (result.value) {
//       $.ajax({
//         data: {
//           action: action,
//           id: id
//         },
//         url: '../app/control/despInfoContacto.php',
//         type: 'POST',
//         success: function(resp) {
//           console.log(resp);
//           switch (resp) {
//             case '1':
//               swal('Listo', 'El elemento fue eliminado', 'success');
//               CargarTablaInfoContacto();
//               break;
//             case '2':
//               swal('Error', 'El elemento no pudo ser eliminado', 'error');
//               break;
//           }
//         },
//         error: function() {
//           alert('Lo sentimos ha habido un error inesperado');
//         }
//       });
//     }
//   });
// }

// // *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
// function actualizarInfoContacto(id) {
//   $('#accion_info_contacto').text('Actualizar Información de Contacto');
//   $('#modal_mantenedor_info_contacto').modal('open');
//   var action = 'CargarModalInfoContacto';
//   var mensajeHtml =
//     '<div class="mensaje-precaucion" id="mensaje_precaucion_info_contacto"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
//   $('#content_mensaje_precaucion_info_contacto').html(mensajeHtml);
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: {
//       id: id,
//       action: action
//     },
//     url: '../app/control/despInfoContacto.php',
//     type: 'POST',
//     success: function(respuesta) {
//       $('#accion_info_contacto').text('Actualizar Información de Contacto');
//       var arr = JSON.parse(respuesta);
//       $.each(arr, function(indice, item) {
//         // *Los label adquieren la clase active para no quedar sobre el texto definido en val
//         $('#lbl_id_info_contacto').text(item.IdInfoContacto);
//         $("label[for='txt_nombre_info_contacto']").addClass('active');
//         $('#txt_nombre_info_contacto').val(item.Descripcion);
//       });
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un problema');
//     }
//   });
// }

// // *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// // *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
// $('#cancelar_mantenedor_info_contacto').on('click', function(evt) {
//   evt.preventDefault();
//   $('#modal_mantenedor_info_contacto').modal('close');
// });

// var validarFormActualizarInfoContacto = $(
//   '#form_mantenedor_info_contacto'
// ).validate({
//   errorClass: 'invalid red-text',
//   validClass: 'valid',
//   errorElement: 'div',
//   errorPlacement: function(error, element) {
//     $(element)
//       .closest('form')
//       .find(`label[for=${element.attr('id')}]`) //*Se insertará un label para representar el error
//       .attr('data-error', error.text()); //*Se obtiene el texto de erro
//     error.insertAfter(element); //*Se inserta el error después del elemento
//   },
//   rules: {
//     txt_nombre_info_contacto: {
//       required: true,
//       minlength: 3,
//       maxlength: 1000,
//       lettersonly: true
//     }
//   },
//   messages: {
//     txt_nombre_info_contacto: {
//       required: 'Campo requerido *',
//       minlength: 'Mínimo 3 caracteres',
//       maxlength: 'Máximo 1000 caracteres',
//       lettersonly: 'Solo letras'
//     }
//   },
//   invalidHandler: function(form) {
//     //*Acción a ejecutar al no completar todos los campos requeridos
//     M.toast({
//       html: 'Por favor completa los campos requeridos',
//       displayLength: 3000,
//       classes: 'red'
//     });
//   },
//   submitHandler: function(form) {
//     swal({
//       title: '¿Estás seguro?',
//       type: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Si',
//       cancelButtonText: 'Cancelar'
//     }).then(result => {
//       if (result.value) {
//         // var action = 'ActualizarDatosAgregados';
//         var dataInfo = '';
//         // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
//         // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
//         // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
//         if ($('#lbl_id_info_contacto').text() == '') {
//           let action = 'IngresarInfoContacto';
//           dataInfo = {
//             nombre: $('#txt_nombre_info_contacto').val(),
//             action: action
//           };
//         } else {
//           let actionUpdate = 'ActualizarInfoContacto';
//           dataInfo = {
//             id: $('#lbl_id_info_contacto').text(),
//             nombre: $('#txt_nombre_info_contacto').val(),
//             action: actionUpdate
//           };
//         }
//         //*Se envían datos del form y action, al controlador mediante ajax
//         $.ajax({
//           data: dataInfo,
//           url: '../app/control/despInfoContacto.php',
//           type: 'POST',
//           success: function(resp) {
//             //*Acción a ejecutar si la respuesta existe
//             console.log(resp);
//             switch (resp) {
//               case '1':
//                 $('#modal_mantenedor_info_contacto').modal('close');
//                 swal('Listo', 'Los datos han sido ingresados', 'success');
//                 CargarTablaInfoContacto();
//                 // *La función se ejecutó correctamente
//                 break;
//               case '2':
//                 swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//                 break;
//               default:
//                 console.log(resp);
//             }
//           },
//           error: function() {
//             alert('Lo sentimos ha ocurrido un error');
//           }
//         });
//       }
//     });
//   }
// });

'use strict';

// *Login clientes
$('#form_login_cliente').validate({
  //*configuración de jquery validata para la validación de campos
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_email: {
      required: true,
      email: true
    },
    txt_password: {
      required: true
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_email: {
      required: 'Campo requerido *',
      email: 'Ingresa un correo válido'
    },
    txt_password: {
      required: 'Campo requerido *'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    var action = 'LoginCliente';
    //*Se envían datos del form y action, al controlador mediante ajax
    $.ajax({
      data: $('#form_login_cliente').serialize() + '&action=' + action,
      url: '../app/control/despCliente.php',
      type: 'POST',
      success: function success(resp) {
        console.log(resp);
        //*Acción a ejecutar si la respuesta existe
        switch (resp) {
          case '1':
            //*Inicio de sesión exitoso, se redirige al usuario al menu de cliente
            location.href = 'index-cliente.php';
            break;
          case '2':
            M.toast({
              html: 'La contraseña es incorrecta',
              displayLength: 3000,
              classes: 'red'
            });
            break;
          case '3':
            M.toast({
              html: 'Los datos ingresados son incorrectos',
              displayLength: 3000,
              classes: 'red'
            });
            break;
          case '4':
            M.toast({
              html: 'Esta cuenta ya no posee permisos para ingresar al sistema.',
              displayLength: 3000,
              classes: 'red'
            });
            break;
        }
      },
      error: function error() {
        alert('Lo sentimos ha ocurrido un error');
      }
    });
  }
});

//*Login empleados

$('#form-login-empleado').validate({
  //*configuración de jquery validata para la validación de campos
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_email: {
      required: true,
      email: true
    },
    txt_password: {
      required: true
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_email: {
      required: 'Campo requerido *',
      email: 'Ingresa un correo válido'
    },
    txt_password: {
      required: 'Campo requerido *'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    var action = 'LoginEmpleado';
    //*Se envían datos del form y action, al controlador mediante ajax
    $.ajax({
      data: $('#form-login-empleado').serialize() + '&action=' + action,
      url: '../app/control/despEmpleados.php',
      type: 'POST',
      success: function success(respuesta) {
        console.log(respuesta);
        //*Acción a ejecutar si la respuesta existe
        switch (respuesta) {
          case '1':
            // alert('Registro Exitoso');
            //*Inicio de sesión exitoso se redirige al usuario al menu de admin
            location.href = 'index-admin.php';
            break;
          case '2':
            //*Inicio de sesión exitoso se redirige al usuario al menu de repartidor
            location.href = 'index-repartidor.php';
            break;
          case 'error':
            M.toast({
              html: 'Los datos ingresador son incorrectos',
              displayLength: 3000,
              classes: 'red'
            });
            break;
          case 'errorEstado':
            M.toast({
              html: 'Esta cuenta ya no posee permisos para ingresar al sistema.',
              displayLength: 3000,
              classes: 'red'
            });
            break;
        }
      },
      error: function error() {
        alert('Lo sentimos ha ocurrido un error');
      }
    });
  }
});

function cargarMantenedorPromosCliente(estado, caracter) {
  var action = 'CargarMantenedorPromosCliente';
  var cargaHtml = '';
  var arrayNoEnCarta = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despPromos.php',
    type: 'POST',
    success: function success(respuesta) {
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
          $.each(arr, function (indice, item) {
            // *Si el item tiene como indice el valor 2 este se ingresará en el array indicado
            if (item.IdEstado == 2) {
              arrayNoEnCarta.push(item.Nombre);
            }

            cargaHtml += '<div class="col s12 m4 l4">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += '<div class="descuento"><p class="center-align">-' + item.Descuento + '%</p></div>';
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="uploads/' + item.ImgUrl + '">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += '<span class="grey-text text-darken-4">Precio normal: $' + item.Precio + '</span>';
            cargaHtml += '<span class="grey-text text-darken-4">Precio descuento: $' + (item.Precio - item.Precio / 100 * item.Descuento) + '</span>';
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';

            if (item.IdTipoPreparacion == 2) {
              cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarPromoCliente(' + item.IdPromo + ')"><i class="material-icons">edit</i></a>';
            } else if (item.IdTipoPreparacion == 1) {
              cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarPromoChef(' + item.IdPromo + ')"><i class="material-icons">edit</i></a>';
            }

            cargaHtml += '<h5 class="grey-text text-darken-4">' + item.Estado + '</h5>';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light red" onclick="eliminarPromoM(' + item.IdPromo + ')"><i class="material-icons">delete</i></a>';
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
            var htmlNoEnCarta = '<div class="mensaje-precaucion-indice" id="mensaje_indice_no_carta_promos"><p><b>Atenci\xF3n!:</b> Existen ' + arrayNoEnCarta.length + ' promos (' + arrayNoEnCarta.join(', ') + ') que no est\xE1n en carta. Recuerda que estos no podr\xE1n ser adquiridos por el cliente.</p></div>';
            $('#mensaje_no_carta_promos').html(htmlNoEnCarta);
          } else {
            $('#mensaje_indice_no_carta_promos').remove();
          }

          $('#mant_arma_tu_promo_carga').html(cargaHtml);
          break;
      }
    },
    error: function error() {
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
    data: 'action=' + action,
    url: '../app/control/despAgregados.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.IdAgregado + '\'>' + item.Nombre + '</option>';
      });
      $('select[name="combo_agregados"]').html(cargaHtml);
    },
    error: function error() {
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
    data: 'action=' + action,
    url: '../app/control/despTipoCoberturas.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.IdTipoCobertura + '\'>' + item.Nombre + '</option>';
      });
      $('select[name="combo_tipo_coberturas"]').html(cargaHtml);
    },
    error: function error() {
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
    data: 'action=' + action,
    url: '../app/control/despTipoPromo.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option disabled selected>Tipo Promo</option>';
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.IdTipoPromo + '\'>' + item.Nombre + '</option>';
      });
      $('select[name="combo_tipo_promo"]').html(cargaHtml);
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}
// *---------------------------------------------------------------------------
// * Añade un agregado a la lista de la promo
$('#btn_add_agregados_promo_cliente').click(function () {
  if ($('#txt_cantidad_agregados_chef').val() < 1) {
    M.toast({
      html: 'Debes ingresar una cantidad válida.',
      displayLength: 3000,
      classes: 'red'
    });
  } else {
    var listaHtml = '<li id-agregado=\'' + $('#combo_agregados_promo_form').val() + '\' cantidad-agregado=\'' + $('#txt_cantidad_agregados').val() + '\'>' + $('#txt_cantidad_agregados').val() + ' - ' + $('#combo_agregados_promo_form option:selected').text() + ' <a id="eliminar_lista_agregados" href="#">Eliminar<a/></li>';

    $('#lista_agregados_adicionales').append(listaHtml);
  }
});

// *Elimina el agregado de la lista de la promo
$('body').on('click', '#eliminar_lista_agregados', function () {
  $(this).closest('li').remove();
});

//  *------------------------------------------------------------------------------------------

// * Añade un agregado a la lista de la promo
$('#btn_add_agregados_promo_chef').click(function () {
  if ($('#txt_cantidad_agregados_chef').val() < 1) {
    M.toast({
      html: 'Debes ingresar una cantidad válida.',
      displayLength: 3000,
      classes: 'red'
    });
  } else {
    var listaHtml = '<li id-agregado-chef=\'' + $('#combo_agregados_promo_form_chef').val() + '\' cantidad-agregado-chef=\'' + $('#txt_cantidad_agregados_chef').val() + '\'>' + $('#txt_cantidad_agregados_chef').val() + ' - ' + $('#combo_agregados_promo_form_chef option:selected').text() + ' <a id="eliminar_lista_agregados_chef" href="#">Eliminar<a/></li>';

    $('#lista_agregados_adicionales_chef').append(listaHtml);
  }
});

// *Elimina el agregado de la lista de la promo
$('body').on('click', '#eliminar_lista_agregados_chef', function () {
  $(this).closest('li').remove();
});

// * Añade un tipo de cobertura a la lista de la promo
$('#btn_add_tipo_coberturas_promo_chef').click(function () {
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
    var listaHtml = '<li id-tipo-cobertura-chef=\'' + $('#combo_tipo_coberturas_promo_form_chef').val() + '\' cantidad-tipo-cobertura-chef=\'' + $('#txt_cantidad_tipo_coberturas_chef').val() + '\'>' + $('#txt_cantidad_tipo_coberturas_chef').val() + ' - ' + $('#combo_tipo_coberturas_promo_form_chef option:selected').text() + ' <a id="eliminar_lista_tipo_cobertura_chef" href="#">Eliminar<a/></li>';

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
$('body').on('click', '#eliminar_lista_tipo_cobertura_chef', function () {
  $(this).closest('li').remove();
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
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
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
      min: 1000,
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
      min: 'El valor mínimo es $1000',
      max: 'Valor máximo $1000000',
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
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var agregados = [];

        // *Se añaden los agregados adicionales a un array para luego ingresarlos a Bd
        $('#lista_agregados_adicionales li').each(function () {
          agregados.push([$(this).attr('id-agregado'), $(this).attr('cantidad-agregado')]);
        });

        agregados = JSON.stringify(agregados);

        // *imgExtension obtiene la extensión de la imagen

        var imgExtension = $('#imagen_promo').val().substr($('#imagen_promo').val().lastIndexOf('.') + 1);
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
          var _action6 = 'IngresarPromoCliente';
          formData.append('action', _action6);
          if ($('#imagen_promo').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
            console.log('imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('no imagen');
          }
        } else {
          var actionUpdate = 'ActualizarDatosPromoCliente';
          formData.append('id', $('#lbl_id_promo_cliente').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if ($('#imagen_promo').val() != '' || imgExtension == 'jpg' || imgExtension == 'png' || imgExtension == 'jpeg') {
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
          success: function success(resp) {
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
          error: function error() {
            alert('Lo sentimos ha ocurrido un error.');
          }
        });
      }
    });
  }
});

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_promo').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_promo_cliente').modal('close');
  // *Borra los datos de la lista
});

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_promo_chef').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_promo_chef').modal('close');
  // *Borra los datos de la lista
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_promo').keyup(function () {
  var precioFinalDescuento = $('#txt_precio_promo').val() - $('#txt_precio_promo').val() / 100 * $('#txt_descuento_promo').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo').text('0');
  } else {
    $('#precio_descuento_promo').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_promo').change(function () {
  var precioFinalDescuento = $('#txt_precio_promo').val() - $('#txt_precio_promo').val() / 100 * $('#txt_descuento_promo').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo').text('0');
  } else {
    $('#precio_descuento_promo').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_promo').keyup(function () {
  var precioFinalDescuento = $('#txt_precio_promo').val() - $('#txt_precio_promo').val() / 100 * $('#txt_descuento_promo').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo').text('0');
  } else {
    $('#precio_descuento_promo').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_promo').change(function () {
  var precioFinalDescuento = $('#txt_precio_promo').val() - $('#txt_precio_promo').val() / 100 * $('#txt_descuento_promo').val();
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
    text: 'Esta acción es irreversible, al eliminar la promo está ya no podrá ser adquirida en una compra.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        data: {
          action: action,
          id: id
        },
        url: '../app/control/despPromos.php',
        type: 'POST',
        success: function success(resp) {
          console.log(resp);
          switch (resp) {
            case '1':
              swal('Listo', 'El elemento fue eliminado exitosamente', 'success');
              cargarMantenedorPromosCliente();
              break;
            case '2':
              swal('Error', 'Lo sentimos no cuentas con los permisos para realizar esta acción', 'error');
              break;
          }
        },
        error: function error() {
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
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_promo_cliente"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#mensaje_precaucion_actualizar_promo_cliente').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despPromos.php',
    type: 'POST',
    success: function success(respuesta) {
      console.log(respuesta);
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_promo_cliente').text('' + id);
        $("label[for='txt_nombre_promo']").addClass('active');
        $('#txt_nombre_promo').val(item.Nombre);
        $('label[for=\'txt_cantidad_piezas\']').addClass('active');
        $('#txt_cantidad_piezas').val(item.Cantidad);
        $('label[for=\'txt_precio_promo\']').addClass('active');
        $('#txt_precio_promo').val(item.Precio);
        $('label[for=\'txt_descuento_promo\']').addClass('active');
        $('#txt_descuento_promo').val(item.Descuento);
        $('#precio_descuento_promo').text('$\n          ' + (item.Precio - item.Precio / 100 * item.Descuento));
        $('#imagen_promo_text').val(item.ImgUrl);
        $('#combo_estado_elemento_form').val(item.IdEstado);
        $('#combo_tipo_promo_form').val(item.IdTipoPromo);

        if (item.Agregados != null) {
          var arrayAgregados = item.Agregados.split(', ');
          var arrayIdAgregados = item.IdAgregados.split(', ');
          var arrayCantidades = item.Cantidades.split(', ');

          $.each(arrayAgregados, function (indice) {
            var listaHtml = '<li id-agregado=\'' + arrayIdAgregados[indice] + '\' cantidad-agregado=\'' + arrayCantidades[indice] + '\'>' + arrayCantidades[indice] + ' - ' + arrayAgregados[indice] + ' <a id="eliminar_lista_agregados" href="#">Eliminar<a/></li>';

            $('#lista_agregados_adicionales').append(listaHtml);
          });
        } else {
          console.log(item.Agregados);
        }
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

$('#txt_cantidad_agregados').change(function () {
  if ($(this).val() < 0) {
    $(this).val(0);
  }
});

$('#txt_cantidad_agregados').blur(function () {
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
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
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
      min: 1000,
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
      min: 'El valor mínimo es $1000',
      max: 'Valor máximo $1000000',
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
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var agregados = [];
        var tipocoberturas = [];

        // *Se añaden los agregados adicionales a un array para luego ingresarlos a Bd
        $('#lista_agregados_adicionales_chef li').each(function () {
          agregados.push([$(this).attr('id-agregado-chef'), $(this).attr('cantidad-agregado-chef')]);
        });

        // *Se añaden los tipo de coberturas a un array para luego ingresarlos a Bd
        $('#lista_tipo_coberturas_chef li').each(function () {
          tipocoberturas.push([$(this).attr('id-tipo-cobertura-chef'), $(this).attr('cantidad-tipo-cobertura-chef')]);
        });

        agregados = JSON.stringify(agregados);
        tipocoberturas = JSON.stringify(tipocoberturas);

        // *imgExtension obtiene la extensión de la imagen
        console.log(agregados);
        console.log(tipocoberturas);
        var imgExtension = $('#imagen_promo_chef').val().substr($('#imagen_promo_chef').val().lastIndexOf('.') + 1);
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
          var _action7 = 'IngresarPromoChef';
          formData.append('action', _action7);
          if ($('#imagen_promo_chef').val() != '' || imgExtension == 'jpg' || imgExtension == 'png' || imgExtension == 'jpeg') {
            formData.append('imagenUrl', $('#imagen_promo_chef')[0].files[0]);
            console.log('imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('no imagen');
          }
        } else {
          var actionUpdate = 'ActualizarDatosPromoChef';
          formData.append('id', $('#lbl_id_promo_chef').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if ($('#imagen_promo_chef').val() != '' || imgExtension == 'jpg' || imgExtension == 'png' || imgExtension == 'jpeg') {
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
          success: function success(resp) {
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
          error: function error() {
            alert('Lo sentimos ha ocurrido un error.');
          }
        });
      }
    });
  }
});

// *Validación de tipo coberturas

function validarListaTipoCoberturasForm() {
  if ($('#lista_tipo_coberturas_chef li').length = 0) {
    return false;
  } else {
    return true;
  }
}
function obtenerTotalListaTipoCoberturas() {
  var arrayTipoCoberturas = $('#lista_tipo_coberturas_chef li').toArray();
  var totalCantidadTipoCoberturas = [];
  if (arrayTipoCoberturas.length > 0) {
    $.each(arrayTipoCoberturas, function () {
      totalCantidadTipoCoberturas.push($(this).attr('cantidad-tipo-cobertura-chef'));
    });
  }
  if (totalCantidadTipoCoberturas.length > 0) {
    var total = totalCantidadTipoCoberturas.reduce(function (a, b) {
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

$('#txt_cantidad_piezas_chef').change(function () {
  if (obtenerTotalListaTipoCoberturas() != null) {
    valor = obtenerTotalListaTipoCoberturas();
    $(this).val(valor);
  } else {
    $(this).val(0);
  }
});

$('#txt_cantidad_agregados_chef').change(function () {
  if ($(this).val() < 1) {
    $(this).val(1);
  }
  if ($(this).val() > 200) {
    $(this).val(200);
  }
});

$('#txt_cantidad_tipo_coberturas_chef').change(function () {
  if ($(this).val() < 10) {
    $(this).val(10);
  }
  if ($(this).val() > 200) {
    $(this).val(200);
  }
});

$('#txt_cantidad_agregados').change(function () {
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
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_promo_chef"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#mensaje_precaucion_actualizar_promo_chef').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despPromos.php',
    type: 'POST',
    success: function success(respuesta) {
      console.log(respuesta);
      var arr = JSON.parse(respuesta);
      console.log(action);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_promo_chef').text('' + id);
        $("label[for='txt_nombre_promo_chef']").addClass('active');
        $('#txt_nombre_promo_chef').val(item.Nombre);
        $('label[for=\'txt_cantidad_piezas_chef\']').addClass('active');
        $('#txt_cantidad_piezas_chef').val(item.Cantidad);
        $('label[for=\'txt_precio_promo_chef]').addClass('active');
        $('#txt_precio_promo_chef').val(item.Precio);
        $('label[for=\'txt_descuento_promo_chef\']').addClass('active');
        $('#txt_descuento_promo_chef').val(item.Descuento);
        $('#precio_descuento_promo_chef').text('$\n          ' + (item.Precio - item.Precio / 100 * item.Descuento));
        $('#imagen_promo_text_chef').val(item.ImgUrl);
        $('#combo_estado_elemento_form_chef').val(item.IdEstado);
        $('#combo_tipo_promo_form_chef').val(item.IdTipoPromo);
        $('label[for=\'txt_cantidad_agregados_chef]').addClass('active');

        if (item.Agregados != null) {
          var arrayAgregados = item.Agregados.split(', ');
          var arrayIdAgregados = item.IdAgregados.split(', ');
          var arrayCantidadesAgregados = item.CantidadesAgregados.split(', ');

          $.each(arrayAgregados, function (indice) {
            var listaHtml = '<li id-agregado-chef=\'' + arrayIdAgregados[indice] + '\' cantidad-agregado-chef=\'' + arrayCantidadesAgregados[indice] + '\'>' + arrayCantidadesAgregados[indice] + ' - ' + arrayAgregados[indice] + ' <a id="eliminar_lista_agregados_chef" href="#">Eliminar<a/></li>';

            $('#lista_agregados_adicionales_chef').append(listaHtml);
          });
        } else {
          console.log(item.Agregados);
        }

        if (item.TipoCoberturas != null) {
          var arrayTipoCoberturas = item.TipoCoberturas.split(', ');
          var arrayIdTipoCoberturas = item.IdTipoCoberturas.split(', ');
          var arrayCantidadesTipoCoberturas = item.CantidadesTipoCoberturas.split(', ');

          $.each(arrayTipoCoberturas, function (indice) {
            var listaHtml = '<li id-tipo-cobertura-chef=\'' + arrayIdTipoCoberturas[indice] + '\' cantidad-tipo-cobertura-chef=\'' + arrayCantidadesTipoCoberturas[indice] + '\'>' + arrayCantidadesTipoCoberturas[indice] + ' - ' + arrayTipoCoberturas[indice] + ' <a id="eliminar_lista_tipo_cobertura_chef" href="#">Eliminar<a/></li>';

            $('#lista_tipo_coberturas_chef').append(listaHtml);
          });
        } else {
          console.log(item.Agregados);
        }
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_promo_chef').keyup(function () {
  var precioFinalDescuento = $('#txt_precio_promo_chef').val() - $('#txt_precio_promo_chef').val() / 100 * $('#txt_descuento_promo_chef').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo_chef').text('0');
  } else {
    $('#precio_descuento_promo_chef').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_promo_chef').change(function () {
  var precioFinalDescuento = $('#txt_precio_promo_chef').val() - $('#txt_precio_promo_chef').val() / 100 * $('#txt_descuento_promo_chef').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo_chef').text('0');
  } else {
    $('#precio_descuento_promo_chef').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_promo_chef').keyup(function () {
  var precioFinalDescuento = $('#txt_precio_promo_chef').val() - $('#txt_precio_promo_chef').val() / 100 * $('#txt_descuento_promo_chef').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo_chef').text('0');
  } else {
    $('#precio_descuento_promo_chef').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_promo_chef').change(function () {
  var precioFinalDescuento = $('#txt_precio_promo_chef').val() - $('#txt_precio_promo_chef').val() / 100 * $('#txt_descuento_promo_chef').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_promo_chef').text('0');
  } else {
    $('#precio_descuento_promo_chef').text('$ ' + precioFinalDescuento);
  }
});

// *Función para validar la sesión activa del usuario
function comprobarEstadoSesion() {
  $.ajax({
    data: 'action=comprobarSesion',
    url: '../app/control/despSession.php',
    type: 'POST',
    success: function success(resp) {
      console.log(resp);
      switch (resp) {
        case '1':
          swal('Lo sentimos', 'Se ha te ha denegado la utilización de este sistema.', 'info');
          setTimeout(function () {
            location.href = 'index-cliente.php';
          }, 3000);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

'use strict';

$('#form_registro').validate({
  //*Se utiliza jquery validate para validar campos del formulario
  errorClass: 'invalid red-text', //*Clase añadida post-error
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    //*Se establecen reglas de validación para campos del form
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 100,
      lettersonly: true
    },
    txt_apellidos: {
      required: true,
      minlength: 3,
      maxlength: 100,
      lettersonly: true
    },
    txt_email: {
      required: true,
      emailCom: true
    },
    txt_password: {
      required: true,
      minlength: 10,
      maxlength: 200
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un nombre válido',
      maxlength: 'Máximo permitido 100 caracteres'
    },
    txt_apellidos: {
      required: 'Campo requerido *',
      minlength: 'Ingresa un apellido válido',
      maxlength: 'Máximo permitido 100 caracteres'
    },
    txt_email: {
      required: 'Campo requerido *',
      email: 'Correo inválido (ejemplo: dmc@gmail.com)'
    },
    txt_password: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 10 caracteres',
      maxlength: 'Máximo 200 caracteres'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler() {
    var action = 'RegistroCliente';
    //*Se envían datos del form y action, al controlador mediante ajax
    $.ajax({
      data: $('#form_registro').serialize() + '&action=' + action,
      url: '../app/control/despCliente.php',
      type: 'POST',
      success: function success(resp) {
        //*Acción a ejecutar si la respuesta existe
        switch (resp) {
          case '1':
            M.toast({
              html: 'Lo sentimos el correo ingresado ya se encuentra en nuestros registros',
              displayLength: 3000,
              classes: 'red'
            });
            break;
          case '2':
            // alert('Registro Exitoso');
            //*Se redirige al usuario al menu de cliente
            location.href = 'index-cliente.php';
            break;
          default:
            console.log(resp);
        }
      },
      error: function error() {
        alert('Lo sentimos ha ocurrido un error');
      }
    });
  }
});

//*Se anadió nuevo método para validar que el campo seleccionado solo contenga letras
jQuery.validator.addMethod('lettersonly', function (value, element) {
  return this.optional(element) || /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/i.test(value);
}, 'Ingresa solo letras por favor');

jQuery.validator.addMethod('emailCom', function (value, element) {
  return this.optional(element) || /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$/.test(value);
}, 'Ingresa un correo válido');

function cargarMantenedorRellenos(estado, caracter) {
  var action = 'CargarMantenedorRellenos';
  var cargaHtml = '';
  // *Los arrays almacenarán los datos de aquellas coberturas que no puedan ser seleccionados por el cliente
  var arrayIndiceNingunoRellenos = [];
  var arrayNoEnCartaRellenos = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despRellenos.php',
    type: 'POST',
    success: function success(respuesta) {
      // *----------------------------------------------------------------------
      // *Se filtra el array obtenido en base a los parámetros obtenidos
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      if (estado == null || estado == 'Todos') {
        arrFilter = JSON.parse(respuesta);
      } else {
        arrFilter = arr.filter(function (n) {
          return n.Estado == estado && n.Nombre.toLowerCase().indexOf(caracter) > -1;
        });
      }
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            // *Si el item tiene como indice el valor ninguno este se insertará en el array indicado
            if (item.Indice == 'Ninguno') {
              arrayIndiceNingunoRellenos.push(item.Nombre);
            }
            // *Si el item tiene como indice el valor 2 este se ingresará en el array indicado
            if (item.idEstado == 2) {
              arrayNoEnCartaRellenos.push(item.Nombre);
            }
            cargaHtml += '<div class="col s12 m4 l4">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="uploads/' + item.ImgUrl + '">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += '<span class="grey-text text-darken-4">Precio Adicional: $' + item.Precio + '</span>';
            // *Si el indice es igual a 'Ninguno' el texto se marca en rojo
            if (item.Indice != 'Ninguno') {
              cargaHtml += '<span class="grey-text text-darken-4">Opci\xF3n de elecci\xF3n: ' + item.Indice + '</span>';
            } else {
              cargaHtml += '<span class="red-text text-darken-4">Opci\xF3n de elecci\xF3n: ' + item.Indice + '</span>';
            }
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarRellenoM(' + item.IdRelleno + ')"><i class="material-icons">edit</i></a>';
            cargaHtml += '<h5 class="grey-text text-darken-4">' + item.Estado + '</h5>';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light red" onclick="eliminarRellenoM(' + item.IdRelleno + ')"><i class="material-icons">delete</i></a>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-reveal">';
            cargaHtml += '<span class="card-title grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">close</i></span>';
            cargaHtml += '<p>' + item.Descripcion + '</p>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });
          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayIndiceNingunoRellenos.length > 0) {
            var htmlNoIndice = '<div class="mensaje-precaucion-indice" id="mensaje_indice_rellenos"><p><b>Atenci\xF3n!:</b> Existen ' + arrayIndiceNingunoRellenos.length + ' rellenos (' + arrayIndiceNingunoRellenos.join(', ') + ') que no poseen un \xEDndice de selecci\xF3n. Recuerda que estos no podr\xE1n ser elegidos por el cliente.</p></div>';
            $('#mensaje_no_indice_rellenos').html(htmlNoIndice);
          } else {
            $('#mensaje_indice_rellenos').remove();
          }

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayNoEnCartaRellenos.length > 0) {
            var htmlNoEnCarta = '<div class="mensaje-precaucion-indice" id="mensaje_indice_no_carta_rellenos"><p><b>Atenci\xF3n!:</b> Existen ' + arrayNoEnCartaRellenos.length + ' rellenos (' + arrayNoEnCartaRellenos.join(', ') + ') que no est\xE1n en carta. Recuerda que estos no podr\xE1n ser elegidos por el cliente.</p></div>';
            $('#mensaje_no_carta_rellenos').html(htmlNoEnCarta);
          } else {
            $('#mensaje_indice_no_carta_rellenos').remove();
          }

          // *Se cargan los datos de la bd en la pantalla
          $('#rellenos_carga').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

$('#combo_estado_rellenos_filtro').change(function (item) {
  cargarMantenedorRellenos($(this).find('option:selected').text(), $('#txt_buscar_rellenos').val());
  /* 
      //*Al cambiar el valor del combobox de filtro se ejecuta la función de cargar mantenedor y se pasan los dos parámetros
      //*que la función solicita. El primer parámetro es el valor seleccionado del combobox, y el segundo es el valor de la caja de búsqueda
      //*De esta manera se cargan los datos que coincidan con estos dos parámetros
      */
});

$('#txt_buscar_rellenos').keyup(function (item) {
  cargarMantenedorRellenos($('#combo_estado_rellenos_filtro').find('option:selected').text(), $(this).val());
  // *La función de carga de los datos se ejecuta al presionar la tecla y pasa como parámetros el valor ingresado en la caja de texto
  // *y además el valor seleccionado del combobox
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarRellenoM(id) {
  var action = 'EliminarRelleno';
  swal({
    title: '¿Estás seguro?',
    text: 'Al ser eliminada este relleno ya no podrá ser seleccionado para ser adquirido.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        data: {
          action: action,
          id: id
        },
        url: '../app/control/despRellenos.php',
        type: 'POST',
        success: function success(resp) {
          switch (resp) {
            case '1':
              swal('Listo', 'El producto fue eliminado', 'success');
              cargarMantenedorRellenos();
              break;
            case '2':
              swal('Error', 'El producto no pudo ser eliminado', 'error');
              break;
          }
        },
        error: function error() {
          alert('Lo sentimos ha habido un error inesperado');
        }
      });
    }
  });
}

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarRellenoM(id) {
  $('#accion_rellenos').text('Actualizar Relleno');
  $('#modal_mantenedor_relleno').modal('open');
  var action = 'CargarModalRelleno';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_rellenos"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_rellenos').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despRellenos.php',
    type: 'POST',
    success: function success(respuesta) {
      //   alert(respuesta);
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_rellenos').text(item.IdRelleno);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Nombre);
        $('label[for=\'txt_descripcion\']').addClass('active');
        $('#txt_descripcion').val(item.Descripcion);
        $('label[for=\'txt_precio_relleno\']').addClass('active');
        $('#txt_precio_relleno').val(item.Precio);
        $('#combo_estado_relleno').val(item.Estado);
        $('#combo_indice_relleno').val(item.Indice);
        $('#imagen_rellenos_text').val(item.ImgUrl);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Se cargan los combobox del mantenedor
function cargarIndiceRelleno() {
  var action = 'CargarIndiceRellenos';
  $('select').formSelect();
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despIndiceRelleno.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += '<option disabled selected>\xCDndice</option>';
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.IdIndiceRelleno + '\'>' + item.Descripcion + '</option>';
      });
      $('#combo_indice_relleno').html(cargaHtml);
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_relleno').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_relleno').modal('close');
});

var validarFormRelleno = $('#form_mantenedor_relleno').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 100
    },
    txt_descripcion: {
      required: true,
      minlength: 3,
      maxlength: 1000
    },
    txt_precio_relleno: {
      required: true,
      min: 0,
      max: 1000000,
      digits: true
    },
    combo_estado_elemento: {
      required: true
    },
    combo_indice_relleno: {
      required: true
    }
  },
  messages: {
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_descripcion: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 1000 caracteres'
    },
    txt_precio_relleno: {
      required: 'Campo requerido *',
      min: 'El valor mínimo es 0',
      max: 'Valor máximo $1000000',
      digits: 'Ingresa solo números'
    },
    combo_estado_elemento: {
      required: 'Selecciona una opción'
    },
    combo_indice_relleno: {
      required: 'Selecciona una opción'
    },
    imagen_rellenos: {
      // required: '',
      extension: 'Ingresa un archivo válido (png, jpg, jpeg)'
    },
    imagen_rellenos_text: {
      // required: 'Selecciona una imagen'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        // *imgExtension obtiene la extensión de la imagen
        var imgExtension = $('#imagen_rellenos').val().substr($('#imagen_rellenos').val().lastIndexOf('.') + 1);
        // *La variable formData inicializa el formulario al cual se le pasan los datos usando append
        var formData = new FormData();
        formData.append('nombre', $('#txt_nombre').val());
        formData.append('descripcion', $('#txt_descripcion').val());
        formData.append('precio', $('#txt_precio_relleno').val());
        formData.append('estado', $('#combo_estado_relleno').val());
        formData.append('indice', $('#combo_indice_relleno').val());
        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'relleno'
        // *Dependiendo de la acción se anexan más datos al formulario (formData)
        if ($('#lbl_id_rellenos').text() == '') {
          var _action8 = 'IngresarRelleno';
          formData.append('action', _action8);
          if ($('#imagen_rellenos').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
          } else {
            formData.append('imagenUrl', '');
          }
        } else {
          var actionUpdate = 'ActualizarDatosRelleno';
          formData.append('id', $('#lbl_id_rellenos').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if ($('#imagen_rellenos').val() != '' || imgExtension == 'jpg' || imgExtension == 'png' || imgExtension == 'jpeg') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
          } else {
            formData.append('imagenUrl', '');
          }
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: formData,
          url: '../app/control/despRellenos.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                $('#modal_mantenedor_relleno').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                cargarMantenedorRellenos();
                // *La función se ejecutó correctamente
                break;
              case '2':
                swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                break;
            }
          },
          error: function error() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});

// *Se carga el total de indices en la tabla indicesrelleno sin contar el id 1 correspondiente a 'Nunguno'
function cargarTotalIndiceRellenos() {
  var action = 'CargarTotalIndiceRellenos';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despIndiceRelleno.php',
    type: 'POST',
    success: function success(respuesta) {
      switch (respuesta) {
        case 'error':
          console.log('Lo sentimos ha ocurrido un error al cargar la cantidad de indices de relleno');
          break;
        default:
          cargaHtml += '<p>' + respuesta + '</p>';
          cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="sumarIndiceRelleno()"><i class="fa fa-plus"></i></a>';
          cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light red" onclick="restarIndiceRelleno()"><i class="fa fa-minus"></i></a>';
          $('#indice_relleno_carga').html(cargaHtml);
          break;
      }
    }
  });
}

// *La función elimina el último valor de la tabla de indices y luego actualiza los demás al valor '1' (Ninguno)
function restarIndiceRelleno() {
  var actionGetDatosVinculadosRellenos = 'ObtenerDatosVinculadosIndiceRelleno';
  $.ajax({
    data: 'action=' + actionGetDatosVinculadosRellenos,
    url: '../app/control/despIndiceRelleno.php',
    type: 'POST',
    success: function success(respuestaDatosVinculados) {
      var action = 'RestarIndiceRellenos';
      //*Se envían datos del form y action, al controlador mediante ajax
      swal({
        title: '¿Estás seguro?',
        text: 'Existen ' + respuestaDatosVinculados + ' rellenos vinculados a este \xEDndice, al elimnarlo estos no podr\xE1n ser seleccionados por el cliente.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar'
      }).then(function (result) {
        if (result.value) {
          $.ajax({
            data: 'action=' + action,
            url: '../app/control/despIndiceRelleno.php',
            type: 'POST',
            success: function success(respuesta) {
              switch (respuesta) {
                case '1':
                  // *Eliminación exitosa
                  cargarTotalIndiceRellenos();
                  cargarMantenedorRellenos();
                  cargarIndiceRelleno();
                  swal('Listo', 'Se ha restado un \xEDndice, ' + respuestaDatosVinculados + ' rellenos han quedado sin \xEDndice de selecci\xF3n, por lo tanto no podr\xE0n ser seleccionadas por el cliente.', 'success');
                  break;
                case '2':
                  // *Error al eliminar
                  swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                  break;
              }
            }
          });
        }
      });
    }
  });
}

// *La función elimina el último valor de la tabla de indices y luego actualiza los demás al valor '1' (Ninguno)
function sumarIndiceRelleno() {
  var action = 'AgregarIndiceRelleno';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  swal({
    title: '¿Estás seguro?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        data: 'action=' + action,
        url: '../app/control/despIndiceRelleno.php',
        type: 'POST',
        success: function success(respuesta) {
          switch (respuesta) {
            case '1':
              // *Ingreso exitoso
              cargarTotalIndiceRellenos();
              cargarMantenedorRellenos();
              cargarIndiceRelleno();
              swal('Listo', 'Se ha restado un índice', 'success');
              break;
            case '2':
              // *Ingreso erróneo
              swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
              break;
          }
        }
      });
    }
  });
}

function CargarTablaTipoCobertura() {
  var action = 'CargarMantenedorTablaTipoCoberturas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despTipoCoberturas.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //   alert(respuesta);
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.Nombre + '</td>';
            cargaHtml += '<td>' + item.Coberturas + '</td>';
            cargaHtml += '<td><a class=\'btn-floating btn-medium waves-effect waves-light blue\' onclick=\'actualizarTipoCobertura("' + item.Nombre + '", "' + item.IdTipoCobertura + '");\'><i class=\'material-icons\'>edit</i></a></td>';
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarTipoCobertura(" + item.IdTipoCobertura + ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_tipo_cobertura').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function cargarCheckboxCoberturas(estado, caracter) {
  var action = 'CargarChecboxCoberturas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          cargaHtml += '<div id="error_checkbox_coberturas"></div>';
          $.each(arr, function (indice, item) {
            cargaHtml += '<p>';
            cargaHtml += '<label>';
            cargaHtml += '<input type="checkbox" name="coberturas_check[]" value="' + item.IdCobertura + '">';
            cargaHtml += '<span>' + item.Nombre + '</span>';
            cargaHtml += '</label>';
            cargaHtml += '</p>';
          });

          $('#carga_chekbox_cobertura').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}
function actualizarTipoCobertura(nombre, id) {
  // * Se setean los datos del input y el label_id con los datos recibidos por la ejecución de la función en el botón editar
  $('#accion_tipo_coberturas').text('Actualizar Tipo Cobertura');
  $('#modal_mantenedor_tipo_cobertura').modal('open');
  $('#lbl_id_tipo_cobertura').text(id);
  $("label[for='txt_nombre']").addClass('active');
  $('#txt_nombre').val(nombre);
  var action = 'CargarModalTipoCobertura';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_tipo_cobertura"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_tipo_cobertura').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despDetalleTipoCobertura.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        $('input[name="coberturas_check[]"][value="' + item.IdCobertura + '"]').prop('checked', true);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

$('#form_mantenedor_tipo_coberturas').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
    if (element.attr('type') == 'checkbox') {
      error.insertAfter($(element).parents('#carga_chekbox_cobertura').prev($('#error_checkbox_coberturas')));
    }
  },
  rules: {
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 100
    },
    'coberturas_check[]': {
      required: true
    }
  },
  messages: {
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    'coberturas_check[]': {
      required: 'Selecciona al menos una opción'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var action = '';
        var coberturas = [];
        var dataInfo = '';
        var nombre = $('#txt_nombre').val();

        $('input[name="coberturas_check[]"]').each(function () {
          if ($(this).is(':checked')) {
            coberturas.push($(this).val());
          }
        });

        coberturas = JSON.stringify(coberturas);

        if ($('#lbl_id_tipo_cobertura').text() == '') {
          action = 'IngresarTipoCobertura';
          dataInfo = {
            nombre: nombre,
            coberturas: coberturas,
            action: action
          };
        } else {
          action = 'ActualizarTipoCobertura';
          dataInfo = {
            id: $('#lbl_id_tipo_cobertura').text(),
            nombre: nombre,
            coberturas: coberturas,
            action: action
          };
        }

        $.ajax({
          data: dataInfo,
          url: '../app/control/despTipoCoberturas.php',
          type: 'POST',
          success: function success(resp) {
            console.log(dataInfo);
            console.log(resp);
            switch (resp) {
              case '1':
                $('#modal_mantenedor_tipo_cobertura').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                CargarTablaTipoCobertura();
                // *La función se ejecutó correctamente
                break;
              case '2':
                swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                break;
            }
          },
          error: function error() {
            alert('Lo sentimos ha ocurrido un error.');
          }
        });
      }
    });
  }
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarTipoCobertura(id) {
  var action = 'EliminarTipoCobertura';
  var actionGetDatos = 'ComprobarVinculacionTipoCobertura';
  $.ajax({
    data: 'action=' + actionGetDatos + '&id=' + id,
    url: '../app/control/despTipoCoberturas.php',
    type: 'POST',
    success: function success(respuestaDatosVinculados) {
      switch (respuestaDatosVinculados) {
        case '1':
          swal({
            title: '¿Estás seguro?',
            text: 'Al ser eliminada este tipo de cobertura ya no podrá ser seleccionado para ser adquirido, o asociado a una promo.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
          }).then(function (result) {
            if (result.value) {
              $.ajax({
                data: {
                  action: action,
                  id: id
                },
                url: '../app/control/despTipoCoberturas.php',
                type: 'POST',
                success: function success(resp) {
                  console.log(resp);
                  switch (resp) {
                    case '1':
                      swal('Listo', 'El producto fue eliminado', 'success');
                      CargarTablaTipoCobertura();
                      break;
                    case '3':
                      swal('Error', 'El producto no puede ser eliminado ya que una promo la contiene', 'error');
                      break;
                  }
                },
                error: function error() {
                  alert('Lo sentimos ha habido un error inesperado');
                }
              });
            }
          });
          break;
        default:
          swal('Error', 'El producto no pudo ser eliminado ya que est\xE1 vinculado a las promos \'' + respuestaDatosVinculados + '\'', 'error');
          break;
      }
    },
    error: function error() {
      swal('Error', 'El producto no pudo ser eliminado', 'error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_tipo_cobertura').on('keyup', function () {
  var caracterFiltro = $(this).val().toLowerCase();
  $('#body_tabla_tipo_cobertura tr').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(caracterFiltro) > -1);
  });
});

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_coberturas').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_tipo_cobertura').modal('close');
});

function CargarTablaTipoPago() {
  var action = 'CargarMantenedorTipoPago';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despTipoPago.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //   alert(respuesta);
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.Descripcion + '</td>';
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarTipoPago(" + item.IdTipoPago + ")'><i class='material-icons'>edit</i></a></td>";
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarTipoPago(" + item.IdTipoPago + ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_tipo_pago').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_tipo_pago').on('keyup', function () {
  var caracterFiltro = $(this).val().toLowerCase();
  $('#tabla_tipo_pago tr').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(caracterFiltro) > -1);
  });
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarTipoPago(id) {
  var action = 'EliminarTipoPago';
  swal({
    title: '¿Estás seguro?',
    text: 'Al ser eliminada este tipo de pago ya no podrá ser seleccionado para ser vinculado a una compra.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        data: {
          action: action,
          id: id
        },
        url: '../app/control/despTipoPago.php',
        type: 'POST',
        success: function success(resp) {
          console.log(resp);
          switch (resp) {
            case '1':
              swal('Listo', 'El elemento fue eliminado', 'success');
              CargarTablaTipoPago();
              break;
            case '2':
              swal('Error', 'El elemento no pudo ser eliminado', 'error');
              break;
          }
        },
        error: function error() {
          alert('Lo sentimos ha habido un error inesperado');
        }
      });
    }
  });
}

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarTipoPago(id) {
  $('#accion_tipo_pago').text('Actualizar Tipo Pago');
  $('#modal_mantenedor_tipo_pago').modal('open');
  var action = 'CargarModalTipoPago';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_tipo_pago"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_tipo_pago').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despTipoPago.php',
    type: 'POST',
    success: function success(respuesta) {
      $('#accion_tipo_pago').text('Actualizar Tipo Pago');
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_tipo_pago').text(item.IdTipoPago);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Descripcion);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_tipo_pago').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_tipo_pago').modal('close');
});

var validarFormActualizarTipoPago = $('#form_mantenedor_tipo_pago').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 1000,
      lettersonly: true
    }
  },
  messages: {
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 1000 caracteres',
      lettersonly: 'Solo letras'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        // var action = 'ActualizarDatosAgregados';
        var dataInfo = '';
        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
        if ($('#lbl_id_tipo_pago').text() == '') {
          var _action9 = 'IngresarTipoPago';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            action: _action9
          };
        } else {
          var actionUpdate = 'ActualizarTipoPago';
          dataInfo = {
            id: $('#lbl_id_tipo_pago').text(),
            nombre: $('#txt_nombre').val(),
            action: actionUpdate
          };
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: dataInfo,
          url: '../app/control/despTipoPago.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            console.log(resp);
            switch (resp) {
              case '1':
                $('#modal_mantenedor_tipo_pago').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                CargarTablaTipoPago();
                // *La función se ejecutó correctamente
                break;
              case '2':
                swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                break;
              default:
                console.log(resp);
            }
          },
          error: function error() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});

function CargarTablaTipoPromo() {
  var action = 'CargarMantenedorTipoPromo';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despTipoPromo.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //   alert(respuesta);
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.Descripcion + '</td>';
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarTipoPromo(" + item.IdTipoPromo + ")'><i class='material-icons'>edit</i></a></td>";
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarTipoPromo(" + item.IdTipoPromo + ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_tipo_promo').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_tipo_promo').on('keyup', function () {
  var caracterFiltro = $(this).val().toLowerCase();
  $('#body_tabla_tipo_promo tr').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(caracterFiltro) > -1);
  });
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarTipoPromo(id) {
  var action = 'EliminarTipoPromo';
  var actionGetDatos = 'ComprobarVinculacionTipoPromo';
  $.ajax({
    data: 'action=' + actionGetDatos + '&id=' + id,
    url: '../app/control/despTipoPromo.php',
    type: 'POST',
    success: function success(respuestaDatosVinculados) {
      switch (respuestaDatosVinculados) {
        case '1':
          swal({
            title: '¿Estás seguro?',
            text: 'Al ser eliminada esta tipo promo ya no podrá ser seleccionado para ser vinculada a una promo.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
          }).then(function (result) {
            if (result.value) {
              $.ajax({
                data: {
                  action: action,
                  id: id
                },
                url: '../app/control/despTipoPromo.php',
                type: 'POST',
                success: function success(resp) {
                  console.log(resp);
                  switch (resp) {
                    case '1':
                      swal('Listo', 'El elemento fue eliminado', 'success');
                      CargarTablaTipoPromo();
                      break;
                    case '2':
                      swal('Error', 'El elemento no pudo ser eliminado', 'error');
                      break;
                    case '3':
                      swal('Error', 'El elemento no pudo ser eliminado ya que al menos una promo es de este tipo', 'error');
                      break;
                  }
                },
                error: function error() {
                  alert('Lo sentimos ha habido un error inesperado');
                }
              });
            }
          });
          break;
        default:
          swal('Error', 'El producto no pudo ser eliminado ya que est\xE1 vinculado a las promos \'' + respuestaDatosVinculados + '\'', 'error');
          break;
      }
    },
    error: function error() {
      swal('Error', 'El producto no pudo ser eliminado', 'error');
    }
  });
}

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarTipoPromo(id) {
  $('#accion_tipo_promo').text('Actualizar Tipo Promo');
  $('#modal_mantenedor_tipo_promo').modal('open');
  var action = 'CargarModalTipoPromo';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_tipo_promo"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_tipo_promo').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despTipoPromo.php',
    type: 'POST',
    success: function success(respuesta) {
      $('#accion_tipo_promo').text('Actualizar Tipo Promo');
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_tipo_promo').text(item.IdTipoPromo);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Descripcion);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_tipo_promo').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_tipo_promo').modal('close');
});

var validarFormActualizarTipoPago = $('#form_mantenedor_tipo_promo').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 1000
    }
  },
  messages: {
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 1000 caracteres'
    }
  },
  invalidHandler: function invalidHandler(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function submitHandler(form) {
    swal({
      title: '¿Estás seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        // var action = 'ActualizarDatosAgregados';
        var dataInfo = '';
        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará una nueva 'promo'
        // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
        if ($('#lbl_id_tipo_promo').text() == '') {
          var _action10 = 'IngresarTipoPromo';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            action: _action10
          };
        } else {
          var actionUpdate = 'ActualizarTipoPromo';
          dataInfo = {
            id: $('#lbl_id_tipo_promo').text(),
            nombre: $('#txt_nombre').val(),
            action: actionUpdate
          };
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: dataInfo,
          url: '../app/control/despTipoPromo.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            console.log(resp);
            switch (resp) {
              case '1':
                $('#modal_mantenedor_tipo_promo').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                CargarTablaTipoPromo();
                // *La función se ejecutó correctamente
                break;
              case '2':
                swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                break;
              default:
                console.log(resp);
            }
          },
          error: function error() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});