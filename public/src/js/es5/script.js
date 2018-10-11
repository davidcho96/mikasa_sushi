'use strict';

var _txt_telefono;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function cargarMantenedorAgregados(estado, caracter) {
  var action = 'CargarMantenedorAgregados';
  var cargaHtml = '';
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
          }
        },
        error: function error() {
          alert('Lo sentimos ha habido un error inesperado');
        }
      });
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
    txt_precio_agregado: {
      required: true,
      min: 0,
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
    txt_precio_agregado: {
      required: 'Campo requerido *',
      min: 'El valor mínimo es 0',
      max: 'Valor máximo 1000000',
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
        formData.append('precio', $('#txt_precio_agregado').val());
        formData.append('descuento', $('#txt_descuento_agregado').val());
        formData.append('estado', $('#combo_estado_elemento_form').val());

        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *Dependiendo de la acción se anexan más datos al formulario (formData)

        if ($('#lbl_id').text() == '') {
          var action = 'IngresarAgregados';
          formData.append('action', action);
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
          contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
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
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function success(respuesta) {
      // console.log(respuesta);
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
            cargaHtml += '<div class="col s12 m4 l4">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="uploads/' + item.ImgUrl + '">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += '<span class="grey-text text-darken-4">Precio Adicional: $' + item.Precio + '</span>';
            if (item.Indice != null) {
              cargaHtml += '<span class="grey-text text-darken-4">Opci\xF3n de elecci\xF3n: ' + item.Indice + '</span>';
            } else {
              cargaHtml += '<span class="grey-text text-darken-4">Opci\xF3n de elecci\xF3n: Ninguno</span>';
            }
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarCoberturaM(' + item.IdCobertura + ')"><i class="material-icons">edit</i></a>';
            cargaHtml += '<h5 class="grey-text text-darken-4">' + item.Estado + '</h5>';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light red" onclick="eliminarCoberturaM(' + item.IdCobertura + ')"><i class="material-icons">delete</i></a>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-reveal">';
            cargaHtml += '<span class="card-title grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">close</i></span>';
            cargaHtml += '<p>' + item.Descripcion + '</p>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });

          $('#coberturasCarga').html(cargaHtml);
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
function actualizarCoberturaM(id) {
  $('#accion_coberturas').text('Actualizar Cobertura');
  $('#modal_mantenedor_cobertura').modal('open');
  var action = 'CargarModalCobertura';
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

var validarFormActualizarAgregados = $('#form_mantenedor_cobertura').validate({
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
      max: 'Valor máximo 1000000',
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
        console.log('ascasc');
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
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
        if ($('#lbl_id_cobertura').text() == '') {
          var action = 'IngresarCobertura';
          formData.append('action', action);
          if ($('#imagen_coberturas').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
            console.log('imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('no imagen');
          }
        } else {
          var actionUpdate = 'ActualizarDatosCobertura';
          formData.append('id', $('#lbl_id_cobertura').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if ($('#imagen_coberturas').val() != '' || imgExtension == 'jpg' || imgExtension == 'png' || imgExtension == 'jpeg') {
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
          url: '../app/control/despCoberturas.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            console.log(resp);
            console.log(formData);
            console.log($('#combo_indice_cobertura').val());
            console.log($('#lbl_id_cobertura').text());
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
              default:
              // console.log(resp);
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
          // alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            tabla += '<tr><td>' + item.Nombre + '</td></tr>';
            //   $('#txt_nombre').val(item.Nombre);
            //   $('#txt_apellidos').val(item.Apellidos);
            //   $('#txt_correo').val(item.Correo);
            //   if (item.Telefono === 'NULL') {
            //     $('#txt_telefono').val('');
            //   } else {
            //     $('#txt_telefono').val(item.Telefono);
            //   }
          });
          $('#tabla_clientes').html(tabla);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

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
        var action = 'EditarPerfilCliente';
        var nombre = $('#txt_nombre').val();
        var apellidos = $('#txt_apellidos').val();
        var telefono = $('#txt_telefono').val();
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: {
            txt_nombre: nombre,
            txt_apellidos: apellidos,
            txt_telefono: telefono,
            action: action
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
            console.log('error');
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
        }
      },
      error: function error() {
        alert('Lo sentimos ha ocurrido un error');
      }
    });
  }
});

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
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despRellenos.php',
    type: 'POST',
    success: function success(respuesta) {
      // console.log(respuesta);
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
          $.each(arr, function (indice, item) {
            cargaHtml += '<div class="col s12 m4 l4">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="https://www.tusushiya.cl/wp-content/uploads/2018/06/wasabi_paste.jpg">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += '<span class="grey-text text-darken-4">Precio Adicional: $' + item.Precio + '</span>';
            if (item.Indice != null) {
              cargaHtml += '<span class="grey-text text-darken-4">Opci\xF3n de elecci\xF3n: ' + item.Indice + '</span>';
            } else {
              cargaHtml += '<span class="grey-text text-darken-4">Opci\xF3n de elecci\xF3n: Ninguno</span>';
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

          $('#rellenosCarga').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

$('#comboBoxEstadoRellenosFiltro').change(function (item) {
  cargarMantenedorCoberturas($(this).find('option:selected').text(), $('#txt_buscar_rellenos').val());
  /* 
      //*Al cambiar el valor del combobox de filtro se ejecuta la función de cargar mantenedor y se pasan los dos parámetros
      //*que la función solicita. El primer parámetro es el valor seleccionado del combobox, y el segundo es el valor de la caja de búsqueda
      //*De esta manera se cargan los datos que coincidan con estos dos parámetros
      */
});

$('#txt_buscar_rellenos').keyup(function (item) {
  cargarMantenedorCoberturas($('#comboBoxEstadoRellenosFiltro').find('option:selected').text(), $(this).val());
  // *La función de carga de los datos se ejecuta al presionar la tecla y pasa como parámetros el valor ingresado en la caja de texto
  // *y además el valor seleccionado del combobox
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarRellenoM(id) {
  var action = 'EliminarRelleno';
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
  $('#modal-mantenedor-relleno').modal('open');
  var action = 'CargarModalRelleno';
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
        $('label[for=\'txt_precioRelleno\']').addClass('active');
        $('#txt_precioRelleno').val(item.Precio);
        $('#comboBoxEstadoRelleno').val(item.Estado);
        $('#comboBoxIndiceRelleno').val(item.Indice);
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
  var cargaHtmlFiltro = '';
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
      $('#comboBoxIndiceRelleno').html(cargaHtml);
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_actualizar_relleno').on('click', function (evt) {
  evt.preventDefault();
  $('#modal-mantenedor-relleno').modal('close');
});

var validarFormActualizarAgregados = $('#form-actualizar-relleno').validate({
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
    txt_precioRelleno: {
      required: true,
      min: 0,
      max: 1000000,
      digits: true
    },
    comboBoxEstadoElemento: {
      required: true
    },
    comboBoxIndiceCobertura: {
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
    txt_precioRelleno: {
      required: 'Campo requerido *',
      min: 'El valor mínimo es 0',
      max: 'Valor máximo 1000000',
      digits: 'Ingresa solo números'
    },
    comboBoxEstadoElemento: {
      required: 'Selecciona una opción'
    },
    comboBoxIndiceCobertura: {
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
        // var action = 'ActualizarDatosAgregados';
        var dataInfo = '';
        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
        if ($('#lbl_id_rellenos').text() == '') {
          var action = 'IngresarRelleno';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            descripcion: $('#txt_descripcion').val(),
            precio: $('#txt_precioRelleno').val(),
            estado: $('#comboBoxEstadoRelleno').val(),
            indice: $('#comboBoxIndiceRelleno').val(),
            action: action
          };
        } else {
          var actionUpdate = 'ActualizarDatosRelleno';
          dataInfo = {
            id: $('#lbl_id_rellenos').text(),
            nombre: $('#txt_nombre').val(),
            descripcion: $('#txt_descripcion').val(),
            precio: $('#txt_precioRelleno').val(),
            estado: $('#comboBoxEstadoRelleno').val(),
            indice: $('#comboBoxIndiceRelleno').val(),
            action: actionUpdate
          };
          //!Cambiar texto botón
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: dataInfo,
          url: '../app/control/despRellenos.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            console.log(resp);
            // console.log($('#comboBoxIndiceCobertura').val());
            // console.log($('#lbl_id_cobertura').text());
            switch (resp) {
              case '1':
                $('#modal-mantenedor-relleno').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                cargarMantenedorRellenos();
                // *La función se ejecutó correctamente
                break;
              case '2':
                swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
                break;
              default:
              // console.log(resp);
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
  $('#modal-mantenedor-tipo-pago').modal('open');
  var action = 'CargarModalTipoPago';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despTipoPago.php',
    type: 'POST',
    success: function success(respuesta) {
      //   alert(respuesta);
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
$('#cancelar_actualizar_tipo_pago').on('click', function (evt) {
  evt.preventDefault();
  $('#modal-mantenedor-tipo-pago').modal('close');
});

var validarFormActualizarTipoPago = $('#form-actualizar-tipo-pago').validate({
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
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
        if ($('#lbl_id_tipo_pago').text() == '') {
          var action = 'IngresarTipoPago';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            action: action
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
                $('#modal-mantenedor-tipo-pago').modal('close');
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