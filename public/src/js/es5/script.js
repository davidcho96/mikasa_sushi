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

            cargaHtml += '<div class="col s12 m6 l4 xl3">';
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
      max: 200,
      digits: true
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
      // imagen_agregados: {
      //   // required: true,
      //   extension: 'jpeg|jpg|png'
      // },
      // imagen_agregados_text: {
      //   // required: true
      // }
    } },
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
      // imagen_agregados: {
      //   // required: '',
      //   extension: 'Ingresa un archivo válido (png, jpg, jpeg)'
      // },
      // imagen_agregados_text: {
      //   // required: 'Selecciona una imagen'
      // }
    } },
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
            console.log(formData);
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
            console.log(resp);
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

function cargarDatosCarrito() {
  var actionPromo = 'ObtenerDatosCarrito';
  var cargaHtml = '';

  //   *Se cargan los datos de las promos creadas en el carrito
  $.ajax({
    data: 'action=' + actionPromo,
    url: '../app/control/despPromoCompra.php',
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
          cargaHtml += '<li>';
          $.each(arr, function (indice, item) {
            // *------------------------------------------
            cargaHtml += '<div class="collapsible-header">';
            cargaHtml += '<img src="uploads/' + item.ImgUrl + '" alt="" height="85px" width="90px">';
            cargaHtml += '<p class="collapsible-text">' + item.Nombre + '</p>';
            // cargaHtml += '<i class="material-icons">more_vert</i>';
            cargaHtml += '<div class="collapsible-price">';
            cargaHtml += '<p>Total: </p><p class=\'green-text\'>$' + item.PrecioTotal + '</p>';
            cargaHtml += '<a class="eliminar-carro" onclick="eliminarPromoCarro(' + item.IdDetalle + ')"><i class="material-icons red-text">close</i></a>';
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
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function cargarAgregadosCarrito() {
  var actionAgregados = 'ObtenerDatosAgregadosCarrito';
  var cargaHtmlAgregados = '';
  //   *Se cargan los datos de los ingredientes en el carrito
  $.ajax({
    data: 'action=' + actionAgregados,
    url: '../app/control/despPromoCompra.php',
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
          cargaHtmlAgregados += '<li>';
          $.each(arr, function (indice, item) {
            // *------------------------------------------
            cargaHtmlAgregados += '<div class="collapsible-header">';
            cargaHtmlAgregados += '<img src="uploads/' + item.ImgUrl + '" alt="" height="85px" width="90px">';
            cargaHtmlAgregados += '<p class="collapsible-text">' + item.Nombre + ' ' + item.Unidades + ' Unidades</p>';
            cargaHtmlAgregados += '<div class="collapsible-price">';
            cargaHtmlAgregados += '<p>Total: </p><p class=\'green-text\'>$' + item.PrecioTotal + '</p>';
            cargaHtmlAgregados += '<a onclick="eliminarAgregadosCarro(' + item.IdDetalle + ')" class="eliminar-carro"><i class="material-icons red-text">close</i></a>';
            cargaHtmlAgregados += '</div>';
            cargaHtmlAgregados += '</div>';
          });
          cargaHtmlAgregados += '</li>';
          //   *--------------------------------------------------
          $('#carga_items_carrito').append(cargaHtmlAgregados);

          break;
      }
    },
    error: function error() {
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
    success: function success(resp) {
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
    error: function error() {
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
    success: function success(resp) {
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
    error: function error() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

function cargarMantenedorCoberturas(estado, caracter) {
  var action = 'CargarMantenedorCoberturas';
  var cargaHtml = '';
  // *Los arrays almacenarán los datos de aquellas coberturas que no puedan ser seleccionados por el cliente
  var arrayIndiceNinguno = [];
  var arrayNoEnCarta = [];
  var arrayProductosPocoStock = [];
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

            // *Si el stock es inferior al minimo se ingresará el elemento al id
            if (item.StockTotal < item.MinimoStock) {
              arrayProductosPocoStock.push(item.Nombre);
            }

            cargaHtml += '<div class="col s12 m6 l4 xl3">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="uploads/' + item.ImgUrl + '">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += '<span class="grey-text text-darken-4">Precio: $' + item.Precio + '</span>';
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
          if (arrayProductosPocoStock.length > 0) {
            var htmlPocoStock = '<div class="mensaje-precaucion-indice" id="mensaje_stock_coberturas"><p><b>Atenci\xF3n!:</b> Existen ' + arrayProductosPocoStock.length + ' coberturas (' + arrayProductosPocoStock.join(', ') + ') que poseen poco stock. Recuerda que estos no podr\xE1n ser elegidos por el cliente.</p></div>';
            $('#mensaje_poco_stock_coberturas').html(htmlPocoStock);
          } else {
            $('#mensaje_stock_coberturas').remove();
          }

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
        // *------------------------------
        $('label[for=\'txt_cantidad_stock_cobertura\']').addClass('active');
        $('#txt_cantidad_stock_cobertura').val(item.Stock);
        $('label[for=\'txt_cantidad_minima_cobertura\']').addClass('active');
        $('#txt_cantidad_minima_cobertura').val(item.Minima);
        $('label[for=\'txt_cantidad_uso_roll_cobertura\']').addClass('active');
        $('#txt_cantidad_uso_roll_cobertura').val(item.Uso);
        $('#combo_unidad_cobertura_stock').val(item.StockUnidad);
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
    // imagen_coberturas: {
    //   // required: true,
    //   extension: 'jpeg|jpg|png'
    // },
    // imagen_coberturas_text: {
    //   // required: true
    // },
    txt_cantidad_stock_cobertura: {
      required: true,
      min: 0.1,
      max: 1000,
      number: true
    },
    combo_unidad_medida_stock: {
      required: true,
      min: 1,
      max: 200
    },
    txt_cantidad_uso_roll_cobertura: {
      required: true,
      min: 0.1,
      max: 1000,
      number: true
    },
    txt_cantidad_minima_cobertura: {
      required: true,
      min: 0.1,
      max: 10000,
      number: true
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
    // imagen_coberturas: {
    //   // required: '',
    //   extension: 'Ingresa un archivo válido (png, jpg, jpeg)'
    // },
    // imagen_coberturas_text: {
    //   // required: 'Selecciona una imagen'
    // },
    txt_cantidad_stock_cobertura: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 1000',
      number: 'Sólo números permitidos'
    },
    combo_unidad_medida_stock: {
      required: 'Campo requerido *',
      min: 'Selecciona una opción válida',
      max: 'Selecciona una opción válida'
    },
    txt_cantidad_uso_roll_cobertura: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 1000',
      number: 'Sólo números permitidos'
    },
    txt_cantidad_minima_cobertura: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 10000',
      number: 'Sólo números permitidos'
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
        formData.append('stock', $('#txt_cantidad_stock_cobertura').val());
        formData.append('unidadStock', $('#combo_unidad_cobertura_stock').val());
        formData.append('uso', $('#txt_cantidad_uso_roll_cobertura').val());
        formData.append('minima', $('#txt_cantidad_minima_cobertura').val());
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
        console.log($('#txt_cantidad_stock_cobertura').val());
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
          cargaHtml += '<p>Opciones disponibles: ' + respuesta;
          cargaHtml += '<a class="btn-indice btn-floating btn-medium waves-effect waves-light blue tooltipped" data-position="bottom" data-tooltip="A\xF1adir \xEDndice de elecci\xF3n" onclick="sumarIndiceCobertura()"><i class="fa fa-plus"></i></a>';
          cargaHtml += '<a class="btn-indice btn-floating btn-medium waves-effect waves-light red tooltipped" data-position="bottom" data-tooltip="Eliminar \xEDndice de elecci\xF3n" onclick="restarIndiceCobertura(' + respuesta + ')"><i class="fa fa-minus"></i></a>';
          cargaHtml += '</p>';
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
        text: 'Existen ' + respuestaDatosVinculados + ' coberturas vinculadas a este \xEDndice, al eliminarlo estos no podr\xE1n ser seleccionados por el cliente.',
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
                  swal('Listo', 'Se ha restado un \xEDndice, ' + respuestaDatosVinculados + ' coberturas han quedado sin \xEDndice de selecci\xF3n, por lo tanto no podr\xE1n ser seleccionadas por el cliente.', 'success');
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
  $('.tooltipped').tooltip();
});

// * Activa funciones de cambios de slide en slider de index
$('.rigth-arrow-slider').click(function () {
  $('.slider').slider('next');
});

$('.left-arrow-slider').click(function () {
  $('.slider').slider('prev');
});
// -----------

function CargarDatosInfoEmpresaIndex() {
  var action = 'cargarDatosInfoEmpresa';
  var mensajeEstadoAperturaLocal = '';
  var arraySemanas = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despInfoEmpresa.php',
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
          var infoContacto = '';
          $.each(arr, function (indice, item) {
            if (item.horaActual >= item.horaApertura && item.horaActual <= item.horaCierre && item.diaSemana >= item.diaInicio && item.diaSemana <= item.diaFinal && item.estadoFeriado == 2) {
              mensajeEstadoAperturaLocal = '<div class="light-green-text">Ahora abierto</div>';
              $('#content_estado_apertura_local_index').html(mensajeEstadoAperturaLocal);
            } else {
              mensajeEstadoAperturaLocal = '<div class="red-text">Ahora cerrado</div>';
              $('#content_estado_apertura_local_index').html(mensajeEstadoAperturaLocal);
            }

            $('#info_apertura').html('Horario de atenci\xF3n: ' + arraySemanas[item.diaInicio - 1] + ' a ' + arraySemanas[item.diaFinal - 1] + ' ' + item.horaApertura + ' - ' + item.horaCierre);
            $('#estado_apertura').html(mensajeEstadoAperturaLocal);
          });
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function CargarTablaInfoContactoIndex() {
  var action = 'CargarMantenedorInfoContacto';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despInfoContacto.php',
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
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            cargaHtml += '<p>' + item.medioContacto + ': ' + item.infoContacto + '</p></br>';
          });

          $('#content_info_contacto_index').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function cargarNotificaciones() {
  var action = 'CargarNotificaciones';
  var cargaHtml = '';
  var linkRedireccion = '';
  $.ajax({
    data: { action: action },
    url: '../app/control/despNotificaciones.php',
    type: 'POST',
    success: function success(resp) {
      console.log(resp);

      var arr = JSON.parse(resp);
      if (arr.length == 0) {
        cargaHtml += '<a href="#!" class="collection-item">No hay notificaciones</a>';
      }
      $.each(arr, function (i, item) {
        switch (item.IdActividad) {
          case '1':
            linkRedireccion = 'ventas-pendientes.php';
            break;
          case '2':
            linkRedireccion = 'entregas-canceladas.php';
            break;
          case '3':
            linkRedireccion = 'entregas-realizadas.php';
            break;
        }
        cargaHtml += '<a href="' + linkRedireccion + '" class="collection-item">' + item.Notificacion + ': ' + item.CodigoVenta + '</a>';
      });
      $('#carga_notificaciones').html(cargaHtml);
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

$('#notificaciones_admin').click(function (evt) {
  evt.preventDefault();
  // alert('Funciona');
  $('#notificaciones_content').toggleClass('mostrar-notificaciones');
});

// function cargarTablaEntregasPendientes() {
//   var action = 'CargarTablaEntregasPendientes';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: action },
//     type: 'POST',
//     url: '../app/control/despEntregas.php',
//     success: function(resp) {
//       var arr = JSON.parse(resp);
//       $.each(arr, function(i, item) {
//         cargaHtml += '<tr>';
//         cargaHtml += `<td>${item.CodigoVenta}</td>`;
//         cargaHtml += `<td data-position="bottom" data-tooltip="I am a tooltip" class="tooltipped">${
//           item.Cliente
//         }</td>`;
//         cargaHtml += `<td>${item.Direccion}</td>`;
//         cargaHtml += `<td>${item.TipoEntrega}</td>`;
//         cargaHtml += `<td>${item.TipoPago}</td>`;
//         cargaHtml += `<td>${item.Hora}</td>`;
//         cargaHtml += `<td>${item.Receptor}</td>`;
//         cargaHtml += `<td>$${item.Valor}</td>`;
//         cargaHtml += `<td>${item.EstadoEntrega}</td>`;
//         cargaHtml += `<td><button class="btn green" onclick="cambiarEstadoEntrega('${
//           item.IdEntrega
//         }', '${item.CodigoVenta}')">Estado Entrega</button></td>`;
//         cargaHtml += `<td><button class="btn red" onclick="cancelarEntrega('${
//           item.IdEntrega
//         }', '${
//           item.CodigoVenta
//         }')"><i class="material-icons">close</i></button></td>`;
//         cargaHtml +=
//           "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaEntregasAdmin(" +
//           item.IdVenta +
//           ")'><i class='material-icons'>more_vert</i></a></td>";
//         cargaHtml += '</tr>';
//       });
//       $('#body_tabla_entregas_pendientes_mikasa').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error al cargar los datos');
//     }
//   });
// }

// // *Función para ver detalle de la venta
// function verDetalleVentaEntregasAdmin(idVenta) {
//   $('#modal_ver_detalle_venta_entrega_pendiente_admin').modal('open');
//   var actionPromoCompra = 'VerDetalleVentaPromoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: actionPromoCompra, IdVenta: idVenta },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     sync: false,
//     success: function(resp) {
//       var arrayDetalleVenta = JSON.parse(resp);
//       // *El json se convierte a array
//       var arrAgregados = arrayDetalleVenta[1];
//       // *Array de agregados vinculado a la venta
//       var arr = arrayDetalleVenta[0];
//       // *Se obtiene el comnetario vinculado a la venta
//       if (arrayDetalleVenta[2] != null) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
//         cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
//         cargaHtml += '</ul>';
//       }
//       // *Si no existe un comentario no e muestra en pantalla
//       $.each(arr, function(i, item) {
//         if (item.NombrePromo != null) {
//           var arrayDetalle = JSON.stringify(eval(arr[i]));
//           // *Se convierte a astring parte del array e formato JSON
//           var arrayDosDetalle = JSON.parse(arrayDetalle);
//           // *Se convierte nuevamente a array
//           var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
//           // *Se parsea el json con el detalle de piezas de la promo creada
//           var arrayTresParse = JSON.parse(arrayTres);

//           cargaHtml += '<ul class="collection">';
//           cargaHtml += `<li class="collection-item"><b>${
//             item.NombrePromo
//           }</b></li>`;
//           $.each(arrayTresParse, function(e, elem) {
//             cargaHtml += `<li class="collection-item">${elem.Piezas} ${
//               elem.Detalle
//             }</li>`;
//             // *Se crea una estructura html que cargue los datos de la venta
//           });
//           cargaHtml += '</ul>';
//         }
//       });
//       if (arrAgregados.length > 0) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
//         $.each(arrAgregados, function(a, agregado) {
//           cargaHtml += `<li class="collection-item">${
//             agregado.NombreAgregado
//           }</li>`;
//           // *Esta estructura html carga los datos de los agregados vinculados a la venta
//         });
//         cargaHtml += '</ul>';
//       }
//       $('#cargar_detalle_venta_entrega_pendiente_admin').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para ver detalle de la venta
// function verDetalleVentaEntregasRepartidor(idVenta) {
//   $('#modal_ver_detalle_venta_entrega_repartidor').modal('open');
//   var actionPromoCompra = 'VerDetalleVentaPromoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: actionPromoCompra, IdVenta: idVenta },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     sync: false,
//     success: function(resp) {
//       var arrayDetalleVenta = JSON.parse(resp);
//       // *El json se convierte a array
//       var arrAgregados = arrayDetalleVenta[1];
//       // *Array de agregados vinculado a la venta
//       var arr = arrayDetalleVenta[0];
//       // *Se obtiene el comnetario vinculado a la venta
//       if (arrayDetalleVenta[2] != null) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
//         cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
//         cargaHtml += '</ul>';
//       }
//       // *Si no existe un comentario no e muestra en pantalla
//       $.each(arr, function(i, item) {
//         if (item.NombrePromo != null) {
//           var arrayDetalle = JSON.stringify(eval(arr[i]));
//           // *Se convierte a astring parte del array e formato JSON
//           var arrayDosDetalle = JSON.parse(arrayDetalle);
//           // *Se convierte nuevamente a array
//           var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
//           // *Se parsea el json con el detalle de piezas de la promo creada
//           var arrayTresParse = JSON.parse(arrayTres);

//           cargaHtml += '<ul class="collection">';
//           cargaHtml += `<li class="collection-item"><b>${
//             item.NombrePromo
//           }</b></li>`;
//           $.each(arrayTresParse, function(e, elem) {
//             cargaHtml += `<li class="collection-item">${elem.Piezas} ${
//               elem.Detalle
//             }</li>`;
//             // *Se crea una estructura html que cargue los datos de la venta
//           });
//           cargaHtml += '</ul>';
//         }
//       });
//       if (arrAgregados.length > 0) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
//         $.each(arrAgregados, function(a, agregado) {
//           cargaHtml += `<li class="collection-item">${
//             agregado.NombreAgregado
//           }</li>`;
//           // *Esta estructura html carga los datos de los agregados vinculados a la venta
//         });
//         cargaHtml += '</ul>';
//       }
//       $('#cargar_detalle_venta_entrega_repartidor').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// function corroborarTipoEntregaF(IdEntrega, CodigoVenta) {
//   var action = 'CorroborarTipoEntrega';
//   return $.ajax({
//     data: { action: action, IdEntrega: IdEntrega, CodigoVenta: CodigoVenta },
//     url: '../app/control/despEntregas.php',
//     type: 'POST',
//     async: false,
//     success: function(resp) {
//       return resp;
//     },
//     error: function() {
//       alert('Los sentimos ha ocurrido un error');
//     }
//   });
// }

// function cambiarEstadoEntrega(IdEntrega, CodigoVenta) {
//   var action = '';
//   var cargaHtml = '';
//   $('#txt_id_entrega_admin').val(IdEntrega);
//   // *Las opciones de estado entrega se cargan en base al tipo de entrega
//   corroborarTipoEntregaF(IdEntrega, CodigoVenta).done(function(data) {
//     var arr = JSON.parse(data);
//     if (arr[0].IdEstadoEntrega == 1) {
//       swal('Error!', 'Esta pedido ya fue cancelada', 'error');
//       cargarTablaEntregasPendientes();
//     } else {
//       $('#modal_cambiar_estado_entrega').modal('open');
//       var tipo = arr[0].IdTipoEntrega;
//       // *Se obtiene el estado de entrega del pedido seleccionado
//       var checked = arr[0].IdEstadoEntrega;
//       switch (tipo.toString()) {
//         case '1':
//           action = 'CargarOpcionesEntregaDomicilio';
//           $.ajax({
//             data: {
//               action: action
//             },
//             url: '../app/control/despEntregas.php',
//             type: 'POST',
//             // async: false,
//             success: function(resp) {
//               console.log(resp);

//               var arr = JSON.parse(resp);
//               // *Se bloquean las opciones de selección de estado si su id es menor al que tiene la entrega
//               // *Se marca como seleccionado el estado que coincide con el de la entrega
//               $.each(arr, function(i, item) {
//                 cargaHtml += '<p>';
//                 cargaHtml += '<label>';
//                 if (item.IdEstadoEntrega == checked) {
//                   cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" checked value="${
//                     item.IdEstadoEntrega
//                   }"/>`;
//                 } else {
//                   if (item.IdEstadoEntrega < checked) {
//                     cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" disabled="disabled" value="${
//                       item.IdEstadoEntrega
//                     }"/>`;
//                   } else {
//                     cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" value="${
//                       item.IdEstadoEntrega
//                     }"/>`;
//                   }
//                 }
//                 cargaHtml += `<span><i class="material-icons">${
//                   item.Icono
//                 }</i>   ${item.EstadoEntrega}</span>`;
//                 cargaHtml += '</label>';
//                 cargaHtml += '</p>';
//               });
//               $('#cargar_opciones_estado_entrega').html(cargaHtml);
//             },
//             error: function() {
//               alert('Los sentimos ha ocurrido un error');
//             }
//           });
//           $('#cargarOpcionesEstadoEntrega').html(cargaHtml);
//           break;
//         case '2':
//           action = 'CargarOpcionesEntregaLocal';
//           $.ajax({
//             data: {
//               action: action
//             },
//             url: '../app/control/despEntregas.php',
//             type: 'POST',
//             // async: false,
//             success: function(resp) {
//               console.log(resp);

//               var arr = JSON.parse(resp);
//               $.each(arr, function(i, item) {
//                 cargaHtml += '<p>';
//                 cargaHtml += '<label>';
//                 if (item.IdEstadoEntrega == checked) {
//                   cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" checked value="${
//                     item.IdEstadoEntrega
//                   }"/>`;
//                 } else {
//                   if (item.IdEstadoEntrega < checked) {
//                     cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" disabled="disabled" value="${
//                       item.IdEstadoEntrega
//                     }"/>`;
//                   } else {
//                     cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" value="${
//                       item.IdEstadoEntrega
//                     }"/>`;
//                   }
//                 }
//                 cargaHtml += `<span><i class="material-icons">${
//                   item.Icono
//                 }</i>   ${item.EstadoEntrega}</span>`;
//                 cargaHtml += '</label>';
//                 cargaHtml += '</p>';
//               });
//               $('#cargar_opciones_estado_entrega').html(cargaHtml);
//             },
//             error: function() {
//               alert('Los sentimos ha ocurrido un error');
//             }
//           });
//           break;
//       }
//     }
//   });
// }

// // *Se cambia el estado de la entrega según lo seleccionado por el admin o vendedor0.

// $('#form_actualizar_estado_entrega_admin_venta').validate({
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
//     radioEstadoEntrega: {
//       required: true
//     }
//   },
//   messages: {
//     radioEstadoEntrega: {
//       required: 'Campo requerido *'
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
//     var action = 'ActualizarEstadoEntregaAdmin';
//     var IdEntrega = $('#txt_id_entrega_admin').val();
//     var IdEstadoEntrega = $('input[name=radioEstadoEntrega]:checked').val();
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
//         $.ajax({
//           data: {
//             action: action,
//             IdEntrega: IdEntrega,
//             IdEstadoEntrega: IdEstadoEntrega
//           },
//           url: '../app/control/despEntregas.php',
//           type: 'POST',
//           success: function(resp) {
//             switch (resp) {
//               case '1':
//                 swal('Listo', 'La tarea se llevó a cabo', 'success');
//                 cargarTablaEntregasPendientes();
//                 $('#modal_cambiar_estado_entrega').modal('close');
//                 // *La función se ejecutó correctamente
//                 break;
//               case '2':
//                 swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//                 break;
//               case '3':
//                 swal('Error!', 'Este pedido ya fue entregado', 'error');
//                 break;
//             }
//           },
//           error: function() {
//             alert('Lo sentimos ha ocurrido un error.');
//           }
//         });
//       }
//     });
//   }
// });

// // *Función para tabla entregas pendientes en repartidor
// function cargarTablaEntregasPendientesRepartidor() {
//   var action = 'CargarTablaEntregasPendientesRepartidor';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: action },
//     type: 'POST',
//     url: '../app/control/despEntregas.php',
//     success: function(resp) {
//       var arr = JSON.parse(resp);
//       if (arr.length > 0) {
//         $.each(arr, function(i, item) {
//           cargaHtml += '<tr>';
//           cargaHtml += `<td>${item.CodigoVenta}</td>`;
//           cargaHtml += `<td>${item.Cliente}</td>`;
//           cargaHtml += `<td>${item.Direccion}</td>`;
//           cargaHtml += `<td>${item.TipoPago}</td>`;
//           cargaHtml += `<td>${item.Hora}</td>`;
//           cargaHtml += `<td>${item.Receptor}</td>`;
//           cargaHtml += `<td>$${item.Valor}</td>`;
//           cargaHtml += `<td>${item.EstadoEntrega}</td>`;
//           if (item.HorasDiferencia < '00:00') {
//             cargaHtml += `<td class="green-text">Faltan: ${
//               item.HorasDiferencia
//             }</td>`;
//           } else {
//             cargaHtml += `<td class="red-text">Retraso de: ${
//               item.HorasDiferencia
//             }</td>`;
//           }
//           cargaHtml += `<td><button class="btn green" onclick="entregarPedido('${
//             item.IdEntrega
//           }', '${item.CodigoVenta}')">Entregar Pedido</button></td>`;
//           cargaHtml +=
//             "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaEntregasRepartidor(" +
//             item.IdVenta +
//             ")'><i class='material-icons'>more_vert</i></a></td>";
//           cargaHtml += '</tr>';
//         });
//       } else {
//         cargaHtml += '<tr>';
//         cargaHtml += '<td colspan="10">No hay entregas pendientes</td>';
//         cargaHtml += '</tr>';
//       }
//       $('#body_tabla_entregas_pendientes_repartidor_mikasa').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error al cargar los datos');
//     }
//   });
// }

// // *Inicializa el mapa de la librería leaflet con la API de openstreetMap
// var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//   osmAttrib =
//     '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   osm = L.tileLayer(
//     'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
//     {
//       maxZoom: 16,
//       attribution:
//         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     }
//   );

// // *Mapa para visualizar la entrega en la tabla generar
// var mapInfoEntrega;
// // *Mapa para visualizar entrega en la tabla mis entregas pendientes
// var mapLlevarEntrega;

// // *Muestra los datos del pedido para que el repartidor determine si adjudicarse la entrega
// function entregarPedido(IdEntrega, CodigoVenta) {
//   var action = 'ObtenerDatosPedidoPendienteRepartidor';
//   var cargaHtml = '';
//   $('#txt_id_entrega_mapa').val(IdEntrega);
//   $('#txt_codigo_venta_mapa').val(CodigoVenta);
//   $('#modal_realizar_entrega_repartidor').modal('open');
//   $.ajax({
//     data: { action: action, IdEntrega: IdEntrega, CodigoVenta: CodigoVenta },
//     url: '../app/control/despEntregas.php',
//     type: 'POST',
//     success: function(resp) {
//       mapInfoEntrega = L.map('map_repartidor')
//         .setView([-37.465, -72.3693], 15)
//         .addLayer(osm);
//       var arr = JSON.parse(resp);

//       $.each(arr, function(i, item) {
//         // *Carga la ubicación del pedido indicada previamente por el admin
//         L.marker([item.Lat, item.Lng])
//           .addTo(mapInfoEntrega)
//           .bindPopup(item.Direccion);
//         // *Carga la información de la entrega
//         cargaHtml += `<li class="collection-item"><b>Dirección: </b>${
//           item.Direccion
//         }</li>`;
//         cargaHtml += `<li class="collection-item"><b>Receptor: </b>${
//           item.Receptor
//         }</li>`;
//         cargaHtml += `<li class="collection-item"><b>Hora de entrega: </b>${
//           item.Hora
//         }</li>`;
//         // *Geolocalización
//         if (navigator.geolocation) {
//           // *El navegador soporta la geolocalización por lo que se marca la ruta
//           navigator.geolocation.getCurrentPosition(
//             function(position) {
//               var lat = position.coords.latitude;
//               var lng = position.coords.longitude;
//               L.Routing.control({
//                 waypoints: [L.latLng(item.Lat, item.Lng), L.latLng(lat, lng)]
//               }).addTo(mapInfoEntrega);
//             },
//             function() {
//               handleNoGeolocation(true);
//               routingControl = L.Routing.control({
//                 waypoints: [
//                   L.latLng(item.Lat, item.Lng),
//                   L.latLng(-37.470133, -72.353628)
//                 ]
//               }).addTo(mapInfoEntrega);
//             }
//           );
//         } else {
//           // *El navegador no soporta el uso de geolocalización
//           var lat = '-37.470144';
//           var lng = '-72.353745';
//           L.Routing.control({
//             waypoints: [L.latLng(item.Lat, item.Lng), L.latLng(lat, lng)]
//           }).addTo(mapInfoEntrega);
//           handleNoGeolocation(false);
//         }
//       });
//       $('#info_entrega_pendiente_repartidor').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error al cargar los datos');
//     }
//   });
// }

// // *Función que cambia el estado de la entrega a 'En camino'
// $('#form_realizar_entrega_mantenedor').submit(function(evt) {
//   evt.preventDefault();
//   var action = 'CambiarEstadoEntregaEnCaminoRepartidor';
//   var IdEntrega = $('#txt_id_entrega_mapa').val();
//   var CodigoVenta = $('#txt_codigo_venta_mapa').val();
//   swal({
//     title: '¿Estás seguro?',
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
//           IdEntrega: IdEntrega,
//           CodigoVenta: CodigoVenta
//         },
//         url: '../app/control/despEntregas.php',
//         type: 'POST',
//         success: function(resp) {
//           switch (resp) {
//             case '1':
//               swal('Listo', 'La tarea se llevó a cabo', 'success');
//               cargarTablaEntregasPendientesRepartidor();
//               cargarTablaMisEntregasPendientesRepartidor();
//               $('#modal_realizar_entrega_repartidor').modal('close');
//               break;
//             case '2':
//               swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//               break;
//             case '3':
//               swal(
//                 'Error!',
//                 'La entrega ya fue adjudicada por otro vendedor',
//                 'error'
//               );
//               cargarTablaEntregasPendientesRepartidor();
//               cargarTablaMisEntregasPendientesRepartidor();
//               $('#modal_realizar_entrega_repartidor').modal('close');
//               break;
//             case '4':
//               swal('Error!', 'La entrega fue cancelada', 'error');
//               cargarTablaEntregasPendientesRepartidor();
//               cargarTablaMisEntregasPendientesRepartidor();
//               $('#modal_realizar_entrega_repartidor').modal('close');
//               break;
//           }
//         },
//         error: function() {
//           alert('Lo sentimos ha ocurrido un error al cargar los datos');
//         }
//       });
//     }
//   });
// });

// // *Función para tabla entregas pendientes del repartidor logueado
// function cargarTablaMisEntregasPendientesRepartidor() {
//   var action = 'CargarTablaMisEntregasPendientesRepartidor';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: action },
//     type: 'POST',
//     url: '../app/control/despEntregas.php',
//     success: function(resp) {
//       var arr = JSON.parse(resp);
//       if (arr.length > 0) {
//         $.each(arr, function(i, item) {
//           cargaHtml += '<tr>';
//           cargaHtml += `<td>${item.CodigoVenta}</td>`;
//           cargaHtml += `<td>${item.Cliente}</td>`;
//           cargaHtml += `<td>${item.Direccion}</td>`;
//           cargaHtml += `<td>${item.TipoPago}</td>`;
//           cargaHtml += `<td>${item.Hora}</td>`;
//           cargaHtml += `<td>${item.Receptor}</td>`;
//           cargaHtml += `<td>$${item.Valor}</td>`;
//           cargaHtml += `<td>${item.EstadoEntrega}</td>`;
//           cargaHtml += `<td><button class="btn green btn-floating" onclick="verRecorridoEntregaRepartidor('${
//             item.IdEntrega
//           }', '${
//             item.CodigoVenta
//           }')"><i class="material-icons">not_listed_location</i></button></td>`;
//           cargaHtml += `<td><button class="btn blue btn-floating" onclick="terminarEntregaPedido('${
//             item.IdEntrega
//           }', '${
//             item.CodigoVenta
//           }')"><i class="material-icons">done_all</i></button></td>`;
//           cargaHtml += `<td><button class="btn-floating btn red" onclick="cancelarEntregaRepartidor('${
//             item.IdEntrega
//           }', '${
//             item.CodigoVenta
//           }')"><i class="material-icons">close</i></button></td>`;
//           cargaHtml +=
//             "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaEntregasRepartidor(" +
//             item.IdVenta +
//             ")'><i class='material-icons'>more_vert</i></a></td>";
//           cargaHtml += '</tr>';
//         });
//       } else {
//         cargaHtml += '<tr>';
//         cargaHtml +=
//           '<td colspan="11">No tienes entregas pendientes por realizar.</td>';
//         cargaHtml += '</tr>';
//       }
//       $('#body_tabla__mis_entregas_pendientes_repartidor_mikasa').html(
//         cargaHtml
//       );
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error al cargar los datos');
//     }
//   });
// }

// var routingControl = null;
// var intervaloMapaRecorrido;

// function verRecorridoEntregaRepartidor(IdEntrega, CodigoVenta) {
//   var action = 'ObtenerDatosPedidoPendienteRepartidor';
//   var cargaHtml = '';
//   $('#txt_id_entrega_mapa').val(IdEntrega);
//   $('#txt_codigo_venta_mapa').val(CodigoVenta);
//   $('#modal_recorrido_info_entrega_repartidor').modal('open');
//   $.ajax({
//     data: { action: action, IdEntrega: IdEntrega, CodigoVenta: CodigoVenta },
//     url: '../app/control/despEntregas.php',
//     type: 'POST',
//     success: function(resp) {
//       mapLlevarEntrega = L.map('map_recorrido_repartidor')
//         .setView([-37.465, -72.3693], 15)
//         .addLayer(osm);
//       var arr = JSON.parse(resp);

//       $.each(arr, function(i, item) {
//         // *Carga la ubicación del pedido indicada previamente por el admin

//         // *Carga la información de la entrega
//         cargaHtml += `<li class="collection-item"><b>Dirección: </b>${
//           item.Direccion
//         }</li>`;
//         cargaHtml += `<li class="collection-item"><b>Receptor: </b>${
//           item.Receptor
//         }</li>`;
//         cargaHtml += `<li class="collection-item"><b>Hora de entrega: </b>${
//           item.Hora
//         }</li>`;
//         // *Geolocalización
//         // *Si el navegador soporta al geolocalización
//         function success(position) {
//           var lat = position.coords.latitude;
//           var lng = position.coords.longitude;
//           routingControl = L.Routing.control({
//             waypoints: [L.latLng(item.Lat, item.Lng), L.latLng(lat, lng)]
//           }).addTo(mapLlevarEntrega);
//         }

//         function error(err) {
//           routingControl = L.Routing.control({
//             waypoints: [
//               L.latLng(item.Lat, item.Lng),
//               L.latLng(-37.470133, -72.353628)
//             ]
//           }).addTo(mapLlevarEntrega);
//           console.warn('ERROR(' + err.code + '): ' + err.message);
//         }
//         // intervaloMapaRecorrido =
//         intervaloMapaRecorrido = setInterval(function() {
//           // *Comprueba que el mapa tenga focus para actualizar cada 5 segundos la ruta
//           if (document.hasFocus()) {
//             navigator.geolocation.getCurrentPosition(success, error);
//             if (
//               typeof routingControl == 'undefined' ||
//               routingControl == null
//             ) {
//             } else {
//               routingControl.getPlan().setWaypoints([]);
//             }
//           } else {
//             console.log('No focus');
//           }
//           // routingControl.getPlan().setWaypoints([]);
//         }, 5000);
//       });
//       $('#info_entrega_recorrido_repartidor').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error al cargar los datos');
//     }
//   });
// }

// // *Envía los datos para cambiar el estado del pedido seleccionado
// function terminarEntregaPedido(IdEntrega, CodigoVenta) {
//   swal({
//     title: '¿Estás seguro de dar por finalizada esta entrega?',
//     type: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Si',
//     cancelButtonText: 'Cancelar'
//   }).then(result => {
//     if (result.value) {
//       var action = 'FinalizarEntregaPedido';
//       $.ajax({
//         data: {
//           action: action,
//           IdEntrega: IdEntrega,
//           CodigoVenta: CodigoVenta
//         },
//         url: '../app/control/despEntregas.php',
//         type: 'POST',
//         success: function(resp) {
//           switch (resp) {
//             // *Entrega realizada
//             case '1':
//               swal('Listo', 'La tarea se llevó a cabo', 'success');
//               cargarTablaEntregasPendientesRepartidor();
//               cargarTablaMisEntregasPendientesRepartidor();
//               $('#modal_recorrido_info_entrega_repartidor').modal('close');
//               break;
//             // *Error al ejecutar la acción
//             case '2':
//               swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//               break;
//             // *El pedido ya fue registrado como entrega
//             case '3':
//               swal(
//                 'Error!',
//                 'La entrega ya fue adjudicada por otro vendedor',
//                 'error'
//               );
//               cargarTablaEntregasPendientesRepartidor();
//               cargarTablaMisEntregasPendientesRepartidor();
//               break;
//           }
//         },
//         error: function() {
//           alert('Lo sentimos ha ocurrido un error al cargar los datos');
//         }
//       });
//     }
//   });
// }

// // *Si se presiona el botón entregar pedido en el modal la función terminar entrega se ejecuta
// $('#form_finalizar_entrega_repartidor').submit(function(evt) {
//   evt.preventDefault();
//   var IdEntrega = $('#txt_id_entrega_mapa').val();
//   var CodigoVenta = $('#txt_codigo_venta_mapa').val();
//   terminarEntregaPedido(IdEntrega, CodigoVenta);
// });

// function cargarTablaMisEntregasRealizadas() {
//   var action = 'CargarTablaMisEntregasRealizadas';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: action },
//     type: 'POST',
//     url: '../app/control/despEntregas.php',
//     success: function(resp) {
//       var arr = JSON.parse(resp);
//       $.each(arr, function(i, item) {
//         cargaHtml += '<tr>';
//         cargaHtml += `<td>${item.CodigoVenta}</td>`;
//         cargaHtml += `<td data-position="bottom" data-tooltip="I am a tooltip" class="tooltipped">${
//           item.Cliente
//         }</td>`;
//         cargaHtml += `<td>${item.Direccion}</td>`;
//         cargaHtml += `<td>${item.Fecha}</td>`;
//         cargaHtml += `<td>${item.Hora}</td>`;
//         cargaHtml += `<td>${item.Receptor}</td>`;
//         cargaHtml += `<td>${item.Cliente}</td>`;
//         cargaHtml += `<td>${item.TipoPago}</td>`;
//         cargaHtml += `<td>$${item.Valor}</td>`;
//         cargaHtml += `<td>${item.HoraEntrega}</td>`;
//         cargaHtml += '</tr>';
//       });
//       $('#body_tabla_mis_entregas_realizadas').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error al cargar los datos');
//     }
//   });
// }

// function cancelarEntrega(IdEntrega, CodigoVenta) {
//   $('#txt_id_entrega_cancelar_admin').val(IdEntrega);
//   $('#modal_cancelar_entrega_compra').modal('open');
// }

// $('input[name="radioMotivoCancelacionEntrega"]').change(function() {
//   if ($(this).val() == 4) {
//     $('#input_motivo_cancelacion_entrega_admin').removeClass('hide');
//     $('#form_cancelar__entrega_admin').validate(); //sets up the validator
//     $('#txt_motivo_cancelacion_entrega').rules('add', {
//       required: true,
//       minlength: 3,
//       maxlength: 200,
//       messages: {
//         required: 'Campo requerido *',
//         minlength: 'Mínimo 3 caracteres',
//         maxlength: 'Máximo 200 caracteres'
//       }
//     });
//   } else {
//     $(this).rules('remove');
//     $('#input_motivo_cancelacion_entrega_admin').addClass('hide');
//   }
// });

// // *Se cierra el modal al presionar el botón cancelar
// $('#cancelar_modal_cancelar_entrega_admin').click(function(evt) {
//   evt.preventDefault();
//   $('#modal_cancelar_entrega_compra').modal('close');
// });

// $('#cancelar_modal_realizar_entrega').click(function(evt) {
//   evt.preventDefault();
//   $('#modal_realizar_entrega_repartidor').modal('close');
// });

// // *Se cierra el modal al presionar el botón cancelar
// $('#cancelar_modal_cambiar_estado_entrega').click(function(evt) {
//   evt.preventDefault();
//   $('#modal_cambiar_estado_entrega').modal('close');
// });

// $('#form_cancelar_entrega_admin').validate({
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
//     radioMotivoCancelacionEntrega: {
//       required: true
//     }
//   },
//   messages: {
//     radioMotivoCancelacionEntrega: {
//       required: 'Campo requerido *'
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
//     var action = 'CancelarEntregaPedido';
//     var idMotivo = $('input[name=radioMotivoCancelacionEntrega]:checked').val();
//     var motivo = $('#txt_motivo_cancelacion_entrega').val();
//     var idEntrega = $('#txt_id_entrega_cancelar_admin').val();
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
//         $.ajax({
//           data: {
//             action: action,
//             idEntrega: idEntrega,
//             idMotivo: idMotivo,
//             motivo: motivo
//           },
//           url: '../app/control/despEntregas.php',
//           type: 'POST',
//           success: function(resp) {
//             console.log(resp);

//             switch (resp) {
//               case '1':
//                 swal('Listo', 'La Entrega ha sido cancelada', 'success');
//                 cargarTablaEntregasPendientes();
//                 $('#modal_cancelar_entrega_compra').modal('close');
//                 // *La función se ejecutó correctamente
//                 break;
//               case '2':
//                 swal(
//                   'Error!',
//                   'No puedes cancelar un pedido que ya ha sido entregado',
//                   'error'
//                 );
//                 break;
//               case '3':
//                 swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//                 break;
//             }
//           },
//           error: function() {
//             alert('Lo sentimos ha ocurrido un error.');
//           }
//         });
//       }
//     });
//   }
// });

// // *Cierra el modal recorrido info entrega
// $('#cancelar_modal_recorrido_info_entrega').click(function(evt) {
//   evt.preventDefault();
//   $('#modal_recorrido_info_entrega_repartidor').modal('close');
// });

// function cancelarEntregaRepartidor(IdEntrega, CodigoVenta) {
//   $('#txt_id_entrega_cancelar_repartidor').val(IdEntrega);
//   $('#modal_cancelar_entrega_repartidor').modal('open');
// }

// $('input[name="radioMotivoCancelacionEntregaRepartidor"]').change(function() {
//   if ($(this).val() == 4) {
//     $('#input_motivo_cancelacion_entrega_repartidor').removeClass('hide');
//     $('#form_cancelar_entrega_repartidor').validate(); //sets up the validator
//     $('#txt_motivo_cancelacion_entrega_repartidor').rules('add', {
//       required: true,
//       minlength: 3,
//       maxlength: 200,
//       messages: {
//         required: 'Campo requerido *',
//         minlength: 'Mínimo 3 caracteres',
//         maxlength: 'Máximo 200 caracteres'
//       }
//     });
//   } else {
//     $(this).rules('remove');
//     $('#input_motivo_cancelacion_entrega_repartidor').addClass('hide');
//   }
// });

// // *Se cierra el modal al presionar el botón cancelar
// $('#cancelar_modal_cancelar_entrega_repartidor').click(function(evt) {
//   evt.preventDefault();
//   $('#modal_cancelar_entrega_repartidor').modal('close');
// });

// $('#form_cancelar_entrega_repartidor').validate({
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
//     radioMotivoCancelacionEntregaRepartidor: {
//       required: true
//     }
//   },
//   messages: {
//     radioMotivoCancelacionEntregaRepartidor: {
//       required: 'Campo requerido *'
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
//     var action = 'CancelarEntregaPedido';
//     var idMotivo = $(
//       'input[name=radioMotivoCancelacionEntregaRepartidor]:checked'
//     ).val();
//     var motivo = $('#txt_motivo_cancelacion_entrega_repartidor').val();
//     var idEntrega = $('#txt_id_entrega_cancelar_repartidor').val();
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
//         $.ajax({
//           data: {
//             action: action,
//             idEntrega: idEntrega,
//             idMotivo: idMotivo,
//             motivo: motivo
//           },
//           url: '../app/control/despEntregas.php',
//           type: 'POST',
//           success: function(resp) {
//             switch (resp) {
//               case '1':
//                 swal('Listo', 'La Entrega ha sido cancelada', 'success');
//                 cargarTablaMisEntregasPendientesRepartidor();
//                 $('#modal_cancelar_entrega_repartidor').modal('close');
//                 // *La función se ejecutó correctamente
//                 break;
//               case '2':
//                 swal(
//                   'Error!',
//                   'No se puede cancelar un pedido que ya ha sido entregado.',
//                   'error'
//                 );
//                 break;
//               case '3':
//                 swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//                 break;
//             }
//           },
//           error: function() {
//             alert('Lo sentimos ha ocurrido un error.');
//           }
//         });
//       }
//     });
//   }
// });

// // *Función para filtrar los datos en la tabla
// $('#txt_buscar_entregas_canceladas').on('keyup', function() {
//   var caracterFiltro = $(this)
//     .val()
//     .toLowerCase();
//   $('#body_tabla_entregas_canceladas_mikasa tr').filter(function() {
//     $(this).toggle(
//       $(this)
//         .text()
//         .toLowerCase()
//         .indexOf(caracterFiltro) > -1
//     );
//   });
// });

// // *Función para cargar la tabla de entregas canceladas
// function cargarTablaEntregasCanceladas() {
//   var action = 'CargarTablaEntregasCanceladas';
//   var cargaHtml = '';
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despEntregas.php',
//     type: 'POST',
//     success: function(respuesta) {
//       var arr = JSON.parse(respuesta);
//       // *Se parsea la respuesta json obtenida
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           $.each(arr, function(indice, item) {
//             cargaHtml += '<tr>';
//             cargaHtml += '<td>' + item.CodigoVenta + '</td>';
//             cargaHtml += '<td>' + item.Direccion + '</td>';
//             cargaHtml += '<td>' + item.Cliente + '</td>';
//             cargaHtml += '<td>' + item.Receptor + '</td>';
//             cargaHtml += '<td>' + item.Fecha + '</td>';
//             cargaHtml += '<td>' + item.Hora + '</td>';
//             cargaHtml += '<td>' + item.TipoEntrega + '</td>';
//             cargaHtml += '<td>' + item.TipoPago + '</td>';
//             cargaHtml += '<td>$' + item.Valor + '</td>';
//             cargaHtml += '<td>' + item.MotivoCancelacion + '</td>';
//             cargaHtml += '<td>' + item.Empleado + '</td>';
//             cargaHtml +=
//               "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleEntregaCancelada(" +
//               item.IdVenta +
//               ")'><i class='material-icons'>more_vert</i></a></td>";
//             cargaHtml += '</tr>';
//           });

//           $('#body_tabla_entregas_canceladas_mikasa').html(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para ver detalle de la entrega
// function verDetalleEntregaCancelada(idVenta) {
//   $('#modal_detalle_entrega_cancelada').modal('open');
//   var actionPromoCompra = 'VerDetalleVentaPromoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: actionPromoCompra, IdVenta: idVenta },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     sync: false,
//     success: function(resp) {
//       var arrayDetalleVenta = JSON.parse(resp);
//       var arrAgregados = arrayDetalleVenta[1];
//       var arr = arrayDetalleVenta[0];
//       if (arrayDetalleVenta[2] != null) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
//         cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
//         cargaHtml += '</ul>';
//       }
//       $.each(arr, function(i, item) {
//         if (item.NombrePromo != null) {
//           var arrayDetalle = JSON.stringify(eval(arr[i]));
//           var arrayDosDetalle = JSON.parse(arrayDetalle);
//           var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
//           var arrayTresParse = JSON.parse(arrayTres);

//           cargaHtml += '<ul class="collection">';
//           cargaHtml += `<li class="collection-item"><b>${
//             item.NombrePromo
//           }</b></li>`;
//           $.each(arrayTresParse, function(e, elem) {
//             cargaHtml += `<li class="collection-item">${elem.Piezas} ${
//               elem.Detalle
//             }</li>`;
//           });
//           cargaHtml += '</ul>';
//         }
//       });
//       if (arrAgregados.length > 0) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
//         $.each(arrAgregados, function(a, agregado) {
//           cargaHtml += `<li class="collection-item">${
//             agregado.NombreAgregado
//           }</li>`;
//         });
//         cargaHtml += '</ul>';
//       }
//       $('#cargar_detalle_entrega_cancelada').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para cargar la tabla de entregas canceladas
// function cargarTablaEntregasRealizadas() {
//   var action = 'CargarTablaEntregasRealizadas';
//   var cargaHtml = '';
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despEntregas.php',
//     type: 'POST',
//     success: function(respuesta) {
//       var arr = JSON.parse(respuesta);
//       // *Se parsea la respuesta json obtenida
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           $.each(arr, function(indice, item) {
//             cargaHtml += '<tr>';
//             cargaHtml += '<td>' + item.CodigoVenta + '</td>';
//             cargaHtml += '<td>' + item.Direccion + '</td>';
//             cargaHtml += '<td>' + item.Cliente + '</td>';
//             cargaHtml += '<td>' + item.Receptor + '</td>';
//             cargaHtml += '<td>' + item.Fecha + '</td>';
//             cargaHtml += '<td>' + item.Hora + '</td>';
//             cargaHtml += '<td>$' + item.Valor + '</td>';
//             cargaHtml += '<td>' + item.Empleado + '</td>';
//             cargaHtml +=
//               "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleEntregaRealizada(" +
//               item.IdVenta +
//               ")'><i class='material-icons'>more_vert</i></a></td>";
//             cargaHtml += '</tr>';
//           });

//           $('#body_tabla_entregas_realizadas_mikasa').html(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para ver detalle de la entrega
// function verDetalleEntregaRealizada(idVenta) {
//   $('#modal_detalle_entrega_realizada').modal('open');
//   var actionPromoCompra = 'VerDetalleVentaPromoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: actionPromoCompra, IdVenta: idVenta },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     sync: false,
//     success: function(resp) {
//       var arrayDetalleVenta = JSON.parse(resp);
//       var arrAgregados = arrayDetalleVenta[1];
//       var arr = arrayDetalleVenta[0];
//       if (arrayDetalleVenta[2] != null) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
//         cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
//         cargaHtml += '</ul>';
//       }
//       $.each(arr, function(i, item) {
//         if (item.NombrePromo != null) {
//           var arrayDetalle = JSON.stringify(eval(arr[i]));
//           var arrayDosDetalle = JSON.parse(arrayDetalle);
//           var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
//           var arrayTresParse = JSON.parse(arrayTres);

//           cargaHtml += '<ul class="collection">';
//           cargaHtml += `<li class="collection-item"><b>${
//             item.NombrePromo
//           }</b></li>`;
//           $.each(arrayTresParse, function(e, elem) {
//             cargaHtml += `<li class="collection-item">${elem.Piezas} ${
//               elem.Detalle
//             }</li>`;
//           });
//           cargaHtml += '</ul>';
//         }
//       });
//       if (arrAgregados.length > 0) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
//         $.each(arrAgregados, function(a, agregado) {
//           cargaHtml += `<li class="collection-item">${
//             agregado.NombreAgregado
//           }</li>`;
//         });
//         cargaHtml += '</ul>';
//       }
//       $('#cargar_detalle_entrega_realizada').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

$('#form_mantenedor_feriados').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_descripcion_feriado: {
      required: true,
      minlength: 3,
      maxlength: 200,
      lettersonly: true
    },
    combo_dia_feriado: {
      required: true,
      min: 1,
      max: 31
    },
    combo_mes_feriado: {
      required: true,
      min: 1,
      max: 12
    }
  },
  messages: {
    txt_descripcion_feriado: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 200 caracteres',
      lettersonly: 'Solo letras permitidas'
    },
    combo_dia_feriado: {
      required: 'Selecciona una opción',
      min: 'Selecciona un dia válido',
      max: 'Selecciona un dia válido'
    },
    combo_mes_feriado: {
      required: 'Selecciona una opción',
      min: 'Selecciona un dia válido',
      max: 'Selecciona un dia válido'
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
        var action = '';
        var dia = $('#combo_dia_feriado').val();
        var mes = $('#combo_mes_feriado').val();
        var descripcion = $('#txt_descripcion_feriado').val();
        var data;
        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'feriado'
        if ($('#lbl_id_feriado').text() == '') {
          action = 'IngresarFeriado';
          data = {
            action: action,
            dia: dia,
            mes: mes,
            descripcion: descripcion
          };
        } else {
          action = 'ActualizarDatosFeriado';
          data = {
            action: action,
            dia: dia,
            mes: mes,
            id: $('#lbl_id_feriado').text(),
            descripcion: descripcion
          };
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: data,
          url: '../app/control/despFeriados.php',
          type: 'POST',
          success: function success(resp) {
            console.log(data);
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                $('#modal_mantenedor_feriados').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                cargarMantenedorFeriados();
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

// *Cerrar el modal al presionar cancelar
$('#cancelar_mantenedor_feriados').click(function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_feriados').modal('close');
});

// *Cargar tabla de datos feriados
function cargarMantenedorFeriados(estado, caracter) {
  var action = 'CargarMantenedorFeriados';
  var cargaHtml = '';
  var arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despFeriados.php',
    type: 'POST',
    success: function success(respuesta) {
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          var arr = JSON.parse(respuesta);
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.Dia + ' de ' + arrayMeses[parseInt(item.Mes) - 1] + '</td>';
            cargaHtml += '<td>' + item.Descripcion + '</td>';
            cargaHtml += '<td><a class=\'btn-floating btn-medium waves-effect waves-light blue\' onclick=\'obtenerDatosActualizarFeriado(' + item.IdFeriado + ')\'><i class=\'material-icons\'>edit</i></a></td>';
            cargaHtml += '<td><a class=\'btn-floating btn-medium waves-effect waves-light red\' onclick=\'eliminarFeriado(' + item.IdFeriado + ')\'><i class=\'material-icons\'>delete</i></a></td>';
            cargaHtml += '</tr>';
          });
          $('#body_tabla_feriados').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para eliminar un feriado de la BD
function eliminarFeriado(IdFeriado) {
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
      var action = 'EliminarFeriado';
      $.ajax({
        data: { action: action, id: IdFeriado },
        url: '../app/control/despFeriados.php',
        type: 'POST',
        success: function success(resp) {
          switch (resp) {
            case '1':
              swal('Listo', 'El feriado se ha eliminado exitosamente', 'success');
              cargarMantenedorFeriados();
              break;
            case '2':
              swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
              cargarMantenedorFeriados();
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

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function obtenerDatosActualizarFeriado(id) {
  $('#accion_info_feriado').text('Actualizar Información de Feriado');
  $('#modal_mantenedor_feriados').modal('open');
  var action = 'CargarModalActualizarFeriado';
  //   var mensajeHtml =
  // '<div class="mensaje-precaucion" id="mensaje_precaucion_info_contacto"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  //   $('#content_mensaje_precaucion_info_contacto').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despFeriados.php',
    type: 'POST',
    success: function success(respuesta) {
      $('#accion_info_feriado').text('Actualizar Información de Feriado');
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_feriado').text(item.IdFeriado);
        $("label[for='txt_descripcion_feriado']").addClass('active');
        $('#txt_descripcion_feriado').val(item.Descripcion);
        $('#combo_dia_feriado').val(item.Dia);
        $('#combo_mes_feriado').val(item.Mes);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

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
                swal('Error', 'El correo ingresado ya existe en nuestros registros.', 'error');
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
            if (item.Telefono !== null) {
              tabla += '<td>+569 ' + item.Telefono + '</td>';
            } else {
              tabla += '<td>Sin tel\xE9fono</td>';
            }
            tabla += '<td>' + item.Correo + '</td>';
            tabla += '<td>' + item.Estado + '</td>';
            tabla += '<td  class="center-align"><button class="btn btn-floating tooltipped waves-effect waves-light red"\n              data-position="right" data-tooltip="Eliminar" class=\'delete\' id=' + item.idCliente + ' onclick=\'EliminarClientes(' + item.idCliente + ')\' ><i class="material-icons">delete</i></button></td>';
            tabla += '<td><a class="waves-effect waves-light blue btn-floating modal-trigger" id="' + item.idCliente + '" onclick=\'cargaCliente(' + item.idCliente + ')\' data-position="right" href="#modal-actualiza-cliente"><i class="material-icons">edit</i></a><td></tr>';
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

function cargarAgregadosCarta(estado, caracter) {
  var action = 'CargarCartaAgregados';
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

            cargaHtml += '<div class="col s12 m6 l4 xl3">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            if (item.Descuento > 0) {
              cargaHtml += '<div class="descuento"><p class="center-align">-' + item.Descuento + '%</p></div>';
            }
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="uploads/' + item.ImgUrl + '">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + ' ' + item.Unidades + 'u<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            if (item.Descuento > 0) {
              cargaHtml += '<span class="red-text">Antes: <strike>$' + item.Precio + '</strike></span>';
              cargaHtml += '<span class="green-text">Ahora: $' + (item.Precio - item.Precio / 100 * item.Descuento) + '</span>';
            } else {
              cargaHtml += '<span class="green-text">Precio: $' + item.Precio + '</span>';
            }
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += '<a class="btn-floating btn-medium waves-effect waves-light black" onclick="addAgregadosCarrito(' + item.IdAgregado + ')"><i class="material-icons">add_shopping_cart</i></a>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-reveal">';
            cargaHtml += '<span class="card-title grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">close</i></span>';
            cargaHtml += '<p>' + item.Descripcion + '</p>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
            cargaHtml += '</div>';
          });

          $('#carga_agregados_cliente').html(cargaHtml);
          break;
      }
    },
    error: function error() {
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
    success: function success(resp) {
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
    error: function error() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

function pulseBoton() {
  $('#btn_carrito').toggleClass('pulse-button animated tada');
  setTimeout(function () {
    $('#btn_carrito').toggleClass('pulse-button animated tada');
  }, 6000);
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
      minlength: 7,
      maxlength: 100
    },
    txt_pass_nueva: {
      required: true,
      minlength: 7,
      maxlength: 100,
      notEqual: '#txt_pass_actual'
    },
    txt_pass_confirmar: {
      required: true,
      minlength: 7,
      maxlength: 100,
      equalTo: '#txt_pass_nueva'
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_pass_actual: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 7 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_pass_nueva: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 7 caracteres',
      maxlength: 'Máximo 100 caracteres',
      notEqual: 'La nueva contraseña no puede ser igual a la actual'
    },
    txt_pass_confirmar: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 7 caracteres',
      maxlength: 'Máximo 100 caracteres',
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

// // *Cargar combobox de tipo de pago
// function cargarComboBoxTipoPago() {
//   var action = 'CargarComboBoxTipoPago';
//   var cargaHtml = '';

//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despTipoPago.php',
//     type: 'POST',
//     success: function(respuesta) {
//       var arr = JSON.parse(respuesta);
//       $.each(arr, function(indice, item) {
//         cargaHtml += `<option value="${item.IdTipoPago}">${
//           item.Descripcion
//         }</option>`;
//       });
//       $('select[name="combo_tipo_pago"]').html(cargaHtml);
//       // *Se inserta en código html en el elemento seleccionado
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error.');
//     }
//   });
// }

// // *Cargar Combobox tipo entrega
// function cargarComboBoxTipoEntrega() {
//   var action = 'CargarComboBoxTipoEntrega';
//   var cargaHtml = '';

//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despTipoEntrega.php',
//     type: 'POST',
//     success: function(respuesta) {
//       var arr = JSON.parse(respuesta);
//       $.each(arr, function(indice, item) {
//         cargaHtml += `<option value="${item.IdTipoEntrega}">${
//           item.Descripcion
//         }</option>`;
//       });
//       $('select[name="combo_tipo_entrega"]').html(cargaHtml);
//       // *Se inserta en código html en el elemento seleccionado
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error.');
//     }
//   });
// }

// function cargarDatosCarritoCompraFinalizarCompra() {
//   var actionPromo = 'ObtenerDatosCarrito';
//   var actionAgregados = 'ObtenerDatosAgregadosCarrito';
//   var cargaHtml = '';
//   var cargaHtmlAgregados = '';

//   //   *Se cargan los datos de las promos creadas en el carrito
//   $.ajax({
//     data: `action=${actionPromo}`,
//     url: '../app/control/despPromoCompra.php',
//     type: 'POST',
//     success: function(respuesta) {
//       // *----------------------------------------------------------------------
//       var arr = JSON.parse(respuesta);
//       // *Se parsea la respuesta json obtenida
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           $.each(arr, function(indice, item) {
//             // *------------------------------------------
//             cargaHtml += '<li class="collection-item items-carrito">';
//             cargaHtml += `<span>${item.Nombre}</span>`;
//             cargaHtml += `<span class='green-text'>$${item.PrecioTotal}</span>`;
//             cargaHtml += '</li>';
//           });
//           //   *--------------------------------------------------
//           $('#lista_productos_carrito').append(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });

//   //   *Se cargan los datos de los agregados en el carrito
//   $.ajax({
//     data: `action=${actionAgregados}`,
//     url: '../app/control/despPromoCompra.php',
//     type: 'POST',
//     success: function(respuesta) {
//       // *----------------------------------------------------------------------
//       var arr = JSON.parse(respuesta);
//       // *Se parsea la respuesta json obtenida
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           $.each(arr, function(indice, item) {
//             // *------------------------------------------
//             cargaHtmlAgregados += '<li class="collection-item items-carrito">';
//             cargaHtmlAgregados += `<span class="collapsible-text">${
//               item.Nombre
//             } ${item.Unidades} Unidades</span>`;
//             cargaHtmlAgregados += `<span class='green-text'>$${
//               item.PrecioTotal
//             }</span>`;
//             cargaHtmlAgregados += '</li>';
//           });
//           //   *--------------------------------------------------
//           $('#lista_productos_carrito').append(cargaHtmlAgregados);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// function verificarListaCarrito() {
//   if ($('#lista_productos_carrito').has('li').length == 0) {
//     var cargaHtmlEmpty = '';
//     cargaHtmlEmpty += '<li class="collection-item items-carrito">';
//     cargaHtmlEmpty += `<span>No hay productos en el carrito de compras</span>`;
//     cargaHtmlEmpty += '</li>';
//     $('#lista_productos_carrito').append(cargaHtmlEmpty);
//     // *Verifica la cantidad de items en la lista del carrito
//   }
// }

// // *Si el radio de selección del receptor contiene el texto otro(valor 2)
// // *Se muestra en pantalla el campo de texto de especificación
// $('input[name="radio_receptor"]').change(function() {
//   if ($(this).val() == 2) {
//     $('#input_receptor_pedido').removeClass('hide');
//     $('#form_compra_cliente').validate(); //sets up the validator
//     $('#txt_nombre_receptor').rules('add', {
//       required: true,
//       minlength: 3,
//       maxlength: 100,
//       lettersonly: true,
//       messages: {
//         required: 'Campo requerido *',
//         minlength: 'Mínimo 3 caracteres',
//         maxlength: 'Máximo 100 caracteres',
//         lettersonly: 'Ingresa solo letras'
//       }
//     });
//   } else {
//     $(this).rules('remove');
//     $('#input_receptor_pedido').addClass('hide');
//   }
// });

// // *Se valida el formulario para dar por finalizada la compra
// var formCompra = $('#form_compra_cliente').validate({
//   errorClass: 'invalid red-text',
//   validClass: 'valid',
//   errorElement: 'div',
//   errorPlacement: function(error, element) {
//     $(element)
//       .closest('form')
//       .find(`label[for=${element.attr('id')}]`) //*Se insertará un label para representar el error
//       .attr('data-error', error.text()); //*Se obtiene el texto de erro
//     error.insertAfter(element); //*Se inserta el error después del elemento
//     if (element.is(':checkbox')) {
//       error.appendTo(element.parents('.check_terminos'));
//     }
//     if (element.is(':radio')) {
//       error.appendTo(element.parents('.radio_pago'));
//     }
//   },
//   rules: {
//     txt_hora_entrega: {
//       required: true
//     },
//     txt_direccion_entrega: {
//       required: true,
//       minlength: 3,
//       maxlength: 100
//     },
//     radio_receptor: {
//       required: true
//     },
//     // combo_tipo_pago: {
//     //   required: true
//     // },
//     check_metodo_pago: {
//       required: true
//     },
//     combo_tipo_entrega: {
//       required: true
//     },
//     check_terminos_condiciones: {
//       required: true
//     },
//     txt_comentario_compra: {
//       minlength: 0,
//       maxlength: 200
//     }
//   },
//   messages: {
//     txt_hora_entrega: {
//       required: 'Campo requerido *'
//     },
//     txt_direccion_entrega: {
//       required: 'Campo requerido *',
//       minlength: 'Mínimo 3 caracteres',
//       maxlength: 'Máximo 100 caracteres'
//     },
//     radio_receptor: {
//       required: 'Campo requerido *'
//     },
//     // combo_tipo_pago: {
//     //   required: 'Selecciona una opción'
//     // },
//     combo_tipo_entrega: {
//       required: 'Selecciona una opción'
//     },
//     check_terminos_condiciones: {
//       required: 'Debes aceptar los términos y condiciones de servicio'
//     },
//     check_metodo_pago: {
//       required: 'Selecciona el medio de pago'
//     },
//     txt_comentario_compra: {
//       minlength: 0,
//       maxlength: 'Máximo 200 caracteres'
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
//     // *Se valida la fecha de la compra y el horario de la entrega
//     validarFechaCompra($('#txt_hora_entrega').val()).done(function(data) {
//       switch (data) {
//         case 'errorDiaEntrega':
//           swal(
//             'Error!',
//             'La compra no puede llevarse a cabo debido a que el local está cerrado.',
//             'error'
//           );
//           break;
//         case 'errorHoraEntrega':
//           swal('Error!', 'Selecciona una hora válida.', 'error');
//           break;
//         case 'puedescomprar':
//           var action = 'ConsultarFactibilidadCompra';
//           $.ajax({
//             data: { action: action },
//             url: '../app/control/despPromoCompra.php',
//             type: 'POST',
//             async: false,
//             success: function(resp) {
//               switch (resp) {
//                 case '1':
//                   $('#modal_pago_webpay').modal('open');
//                   // swal(
//                   //   'Listo',
//                   //   'Su solicitud de compra ha sido enviada por favor espere a que esta sea aceptada.',
//                   //   'success'
//                   // );
//                   // setTimeout(function() {
//                   //   location.href = 'index-cliente.php';
//                   // }, 1500);
//                   // *La función se ejecutó correctamente
//                   break;
//                 case '2':
//                   swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//                   break;
//                 case '3':
//                   swal(
//                     'Error!',
//                     'Para generar la compra primero debes haber agregado productos al carro de compras.',
//                     'error'
//                   );
//                   break;
//                 case '4':
//                   swal(
//                     'Error!',
//                     'Lo sentimos has sobrepasado el precio máximo de compra, si necesitas realizar una compra especial contacte con nosotros.',
//                     'error'
//                   );
//                   break;
//                 case '5':
//                   swal('Error!', 'En el día de hoy no atendemos.', 'error');
//                   break;
//               }
//             },
//             error: function() {
//               alert('Lo sentimos ha ocurrido un error.');
//             }
//           });

//           break;
//       }
//     });
//   }
// });

// $('#btn_pagar_webpay').click(function(evt) {
//   evt.preventDefault();
//   finalizarCompraCliente();
// });

// function finalizarCompraCliente() {
//   validarFechaCompra($('#txt_hora_entrega').val()).done(function(data) {
//     switch (data) {
//       case 'errorDiaEntrega':
//         swal(
//           'Error!',
//           'La compra no puede llevarse a cabo debido a que el local está cerrado.',
//           'error'
//         );
//         break;
//       case 'errorHoraEntrega':
//         swal('Error!', 'Selecciona una hora válida.', 'error');
//         break;
//       case 'puedescomprar':
//         var pagoWebpay = '3';
//         swal({
//           title: '¿Estás seguro?',
//           type: 'warning',
//           showCancelButton: true,
//           confirmButtonColor: '#3085d6',
//           cancelButtonColor: '#d33',
//           confirmButtonText: 'Si',
//           cancelButtonText: 'Cancelar'
//         }).then(result => {
//           if (result.value) {
//             swal({
//               title: 'Espera',
//               html: 'Estamos procesando tu compra.',
//               timer: 1800,
//               onOpen: () => {
//                 swal.showLoading();
//               }
//             });
//             var action = 'GenerarVenta';
//             var dataInfo = '';
//             var receptor = '';
//             // *Si el receptor asignado es otro se ingresa el texto ingresado en el texto
//             if ($('input[name=radio_receptor]:checked').val() == 2) {
//               receptor = $('#txt_nombre_receptor').val();
//             } else {
//               receptor = '1';
//               // *Si el mismo cliente recibirá el pedido se ingresa el valor 1 que en el procedimiento
//               // *Guarda el nombre del cliente como receptor
//             }

//             dataInfo = {
//               action: action,
//               tipo_pago: pagoWebpay,
//               tipo_entrega: $('#combo_tipo_entrega_form').val(),
//               hora_entrega: $('#txt_hora_entrega').val(),
//               direccion_entrega: $('#txt_direccion_entrega').val(),
//               comentario: $('#txt_comentario_compra').val(),
//               receptor: receptor
//             };

//             $.ajax({
//               data: dataInfo,
//               url: '../app/control/despPromoCompra.php',
//               type: 'POST',
//               success: function(resp) {
//                 switch (resp) {
//                   case '1':
//                     $('#modal_pago_webpay').modal('close');
//                     swal(
//                       'Listo',
//                       'Su solicitud de compra ha sido enviada por favor espere a que esta sea aceptada.',
//                       'success'
//                     );
//                     setTimeout(function() {
//                       location.href = 'index-cliente.php';
//                     }, 1500);
//                     // *La función se ejecutó correctamente
//                     break;
//                   case '2':
//                     swal(
//                       'Error!',
//                       'Ha ocurrido un error al realizar la venta prueba de nuevo más tarde',
//                       'error'
//                     );
//                     setTimeout(function() {
//                       location.href = 'index-cliente.php';
//                     }, 1500);
//                     break;
//                   case '3':
//                     swal(
//                       'Error!',
//                       'No cuentas con saldo suficiente para realizar la compra',
//                       'error'
//                     );
//                     break;
//                 }
//               },
//               error: function() {
//                 alert('Lo sentimos ha ocurrido un error.');
//               }
//             });
//           }
//         });
//         break;
//     }
//   });
// }

// function ObtenerPrecioTotalCarrito() {
//   var action = 'ObtenerPrecioTotalCarrito';
//   var cargaHtml = '';
//   //   *Se cargan los datos de los ingredientes en el carrito
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despPromoCompra.php',
//     type: 'POST',
//     success: function(respuesta) {
//       // *----------------------------------------------------------------------
//       // var arr = JSON.parse(respuesta);
//       // *Se parsea la respuesta json obtenida
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           cargaHtml += `$${respuesta}`;
//           //   *--------------------------------------------------
//           $('#total_compra').append(cargaHtml);
//           $('#total_compra_carro').html(cargaHtml);
//           $('#precio_total_carrito_webpay').html(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// function validarFechaCompra(hora) {
//   var action = 'ValidarFechaCompra';
//   return $.ajax({
//     data: { action: action, horaEntrega: hora },
//     url: '../app/control/despPromoCompra.php',
//     type: 'POST',
//     async: false,
//     success: function(resp) {
//       return resp;
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// function CargarTablaVentasPendientes() {
//   var action = 'CargarTablaVentas';
//   var cargaHtml = '';
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     success: function(respuesta) {
//       var arr = JSON.parse(respuesta);
//       // *Se parsea la respuesta json obtenida
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           $.each(arr, function(indice, item) {
//             cargaHtml += '<tr>';
//             cargaHtml += '<td>' + item.CodigoVenta + '</td>';
//             cargaHtml += '<td>' + item.NombreCliente + '</td>';
//             cargaHtml += '<td>' + item.Fecha + '</td>';
//             cargaHtml += '<td>' + item.TipoEntrega + '</td>';
//             cargaHtml += '<td>' + item.TipoPago + '</td>';
//             cargaHtml += '<td>' + item.TipoVenta + '</td>';
//             cargaHtml += '<td>' + item.HoraEntrega + '</td>';
//             cargaHtml += '<td>$' + item.Valor + '</td>';
//             cargaHtml += '<td>' + item.EstadoVenta + '</td>';
//             cargaHtml +=
//               "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVenta(" +
//               item.IdVenta +
//               ")'><i class='material-icons'>more_vert</i></a></td>";
//             cargaHtml += `<td><a class='btn-floating btn-medium waves-effect waves-light green' onclick='aceptarVenta("${
//               item.IdVenta
//             }", "${
//               item.CodigoVenta
//             }")'><i class='material-icons'>done</i></a></td>`;
//             cargaHtml += `<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='cancelarVenta("${
//               item.IdVenta
//             }", "${
//               item.CodigoVenta
//             }")'><i class='material-icons'>clear</i></a></td>`;
//             cargaHtml += '</tr>';
//           });

//           $('#body_tabla_ventas_mikasa').html(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Si el motivo de cancelación es otro se muestra el campo de texto de especificación de motivo
// $('input[name="radioMotivo"]').change(function() {
//   if ($(this).val() == 4) {
//     $('#input_motivo_cancelacion').removeClass('hide');
//     $('#form_cancelar_venta').validate(); //sets up the validator
//     $('#txt_motivo_cancelacion').rules('add', {
//       required: true,
//       minlength: 3,
//       maxlength: 200,
//       messages: {
//         required: 'Campo requerido *',
//         minlength: 'Mínimo 3 caracteres',
//         maxlength: 'Máximo 200 caracteres'
//       }
//     });
//   } else {
//     $(this).rules('remove');
//     $('#input_motivo_cancelacion').addClass('hide');
//   }
// });

// // *Al presionar cancelar venta se abre el modal para la selección del motivo
// function cancelarVenta(id, codigoVenta) {
//   $('#modal_mantenedor_cancelar_compra').modal('open');
//   $('#txt_id_venta_cancelar').val(id);
//   $('#txt_codigo_venta_cancelar').val(codigoVenta);
// }

// var markerMap = '';
// // *Variable global que recibe las coordenadas seleccionadas en el mapa
// var mapVenta;
// // *Variable global que garantiza que solo se selecciona una ubicación
// function aceptarVenta(id, codigoCompra) {
//   var action = 'ValidarTipoEntrega';
//   $.ajax({
//     data: { action: action, idVenta: id },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     // async: false,
//     success: function(resp) {
//       switch (resp) {
//         // *Si el tipo de entrega es en local no se ingresan latitud ni longitud
//         case 'Local':
//           aceptarVentaPedido(id, resp, codigoCompra);
//           break;
//         case 'Domicilio':
//           $('#modal_mantenedor_aceptar_compra').modal('open');
//           $('#txt_id_compra_mapa').val(id);
//           $('#txt_entrega_compra_mapa').val(resp);
//           $('#txt_codigo_compra_mapa').val(codigoCompra);
//           // *Se inicializa el mapa en leaflet utilizando la API de openstreetmap
//           var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//             osmAttrib =
//               '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//             osm = L.tileLayer(
//               'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
//               {
//                 maxZoom: 16,
//                 attribution:
//                   '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//               }
//             );
//           mapVenta = L.map('map')
//             .setView([-37.465, -72.3693], 15)
//             .addLayer(osm);
//           // *Centra el mapa para mejor visualización

//           var marker;
//           mapVenta.on('click', function(e) {
//             // *Al hacer click en el mapa se añade un solo marcador
//             // *Si hay otro este se elimina
//             if (typeof marker === 'undefined') {
//               marker = new L.marker(e.latlng, { draggable: true });
//               marker.addTo(mapVenta);
//             } else {
//               marker.setLatLng(e.latlng);
//             }
//             markerMap = marker.getLatLng();
//           });
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error.');
//     }
//   });
// }

// // *Se cierra el modal al presionar el botón cancelar
// $('#cancelar_modal_canc_compra').click(function(evt) {
//   evt.preventDefault();
//   $('#modal_mantenedor_cancelar_compra').modal('close');
// });

// // *Función para filtrar los datos en la tabla
// $('#txt_buscar_ventas').on('keyup', function() {
//   var caracterFiltro = $(this)
//     .val()
//     .toLowerCase();
//   $('#body_tabla_ventas_mikasa tr').filter(function() {
//     $(this).toggle(
//       $(this)
//         .text()
//         .toLowerCase()
//         .indexOf(caracterFiltro) > -1
//     );
//   });
// });

// function aceptarVentaPedido(id, tipoEntrega, codigoCompra) {
//   var action = 'AceptarVenta';
//   var lat = '';
//   var lng = '';
//   // *Dependiendo del tipo de entrega las coordenadas son ingresadas en formato null

//   // *Se valida que se haya seleccionado una ubicación en el mapa
//   if (tipoEntrega == 'Domicilio') {
//     if (markerMap == '' || markerMap == null) {
//       M.toast({
//         html: 'Por favor completa los campos requeridos',
//         displayLength: 3000,
//         classes: 'red'
//       });
//       // *Valida que se haya seleccionado una ubicación
//     } else {
//       lat = markerMap.lat;
//       lng = markerMap.lng;
//     }
//   } else {
//     lat = null;
//     lng = null;
//   }
//   swal({
//     title: '¿Estás seguro?',
//     type: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Si',
//     cancelButtonText: 'Cancelar'
//   }).then(result => {
//     if (result.value) {
//       swal({
//         title: 'Espera',
//         html: 'Estamos procesando la solicitud.',
//         timer: 9000,
//         onOpen: () => {
//           swal.showLoading();
//         }
//       });
//       $.ajax({
//         data: {
//           action: action,
//           idVenta: id,
//           lng: lng,
//           lat: lat,
//           CodigoVenta: codigoCompra
//         },
//         url: '../app/control/despVenta.php',
//         type: 'POST',
//         success: function(resp) {
//           console.log(resp);

//           switch (resp) {
//             case '1':
//               swal('Listo', 'La venta ha sido aceptada.', 'success');
//               markerMap = '';
//               $('#modal_mantenedor_aceptar_compra').modal('close');
//               CargarTablaVentasPendientes();
//               break;
//             case '2':
//               swal('Error!', 'La compra no pudo ser aceptada.', 'error');
//               break;
//             case '3':
//               swal(
//                 'Ha ocurrido un error',
//                 'El correo de notificación no pudo ser enviado',
//                 'error'
//               );
//               break;
//             case '4':
//               swal(
//                 'Ha ocurrido un error',
//                 'Hay uno o más <a href="mantenedor-ingredientes.php">ingredientes</a> que no tienen stock',
//                 'error'
//               );
//               break;
//             case '5':
//               swal(
//                 'Ha ocurrido un error',
//                 'No hay suficiente stock de coberturas',
//                 'error'
//               );
//               break;
//           }
//         },
//         error: function() {
//           alert('Lo sentimos ha ocurrido un error.');
//         }
//       });
//     }
//   });
// }

// // *Se cierra el modal de aceptar venta y se limpia la variable global de ubicación en el mapa seleccionada
// $('#cancelar_modal_aceptar_compra').on('click', function(evt) {
//   evt.preventDefault();
//   markerMap = '';
//   $('#modal_mantenedor_aceptar_compra').modal('close');
// });

// $('#form_aceptar_compra').submit(function(evt) {
//   evt.preventDefault();
//   var id = $('#txt_id_compra_mapa').val();
//   var entrega = $('#txt_entrega_compra_mapa').val();
//   var codigoCompra = $('#txt_codigo_compra_mapa').val();
//   aceptarVentaPedido(id, entrega, codigoCompra);
// });

// // *Se valida el formulario de cancelar compra
// var formCompra = $('#form_cancelar_venta').validate({
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
//     radioMotivo: {
//       required: true
//     }
//   },
//   messages: {
//     radioMotivo: {
//       required: 'Campo requerido *'
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
//     var action = 'CancelarVenta';
//     var idMotivo = $('input[name=radioMotivo]:checked').val();
//     var motivo = $('#txt_motivo_cancelacion').val();
//     var idVenta = $('#txt_id_venta_cancelar').val();
//     var codigoVenta = $('#txt_codigo_venta_cancelar').val();
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
//         swal({
//           title: 'Espera',
//           html: 'Se está procesando la solicitud.',
//           timer: 9000,
//           onOpen: () => {
//             swal.showLoading();
//           }
//         });
//         $.ajax({
//           data: {
//             action: action,
//             idVenta: idVenta,
//             idMotivo: idMotivo,
//             codigoVenta: codigoVenta,
//             motivo: motivo
//           },
//           url: '../app/control/despVenta.php',
//           type: 'POST',
//           success: function(resp) {
//             console.log(resp);
//             switch (resp) {
//               case '1':
//                 swal('Listo', 'La venta ha sido cancelada', 'success');
//                 CargarTablaVentasPendientes();
//                 $('#modal_mantenedor_cancelar_compra').modal('close');
//                 // *La función se ejecutó correctamente
//                 break;
//               case '2':
//                 swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//                 break;
//             }
//           },
//           error: function() {
//             alert('Lo sentimos ha ocurrido un error.');
//           }
//         });
//       }
//     });
//   }
// });

// // *Función para ver el detalle de al venta
// function verDetalleVenta(idVenta) {
//   $('#modal_detalle_venta_pendientes').modal('open');
//   // *Se abre el modal
//   var actionPromoCompra = 'VerDetalleVentaPromoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: actionPromoCompra, IdVenta: idVenta },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     sync: false,
//     success: function(resp) {
//       var arrayDetalleVenta = JSON.parse(resp);
//       // *El json se convierte a array
//       var arrAgregados = arrayDetalleVenta[1];
//       // *Array de agregados vinculado a la venta
//       var arr = arrayDetalleVenta[0];
//       // *Se obtiene el comnetario vinculado a la venta
//       if (arrayDetalleVenta[2] != null) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
//         cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
//         cargaHtml += '</ul>';
//       }
//       // *Si no existe un comentario no e muestra en pantalla
//       $.each(arr, function(i, item) {
//         if (item.NombrePromo != null) {
//           var arrayDetalle = JSON.stringify(eval(arr[i]));
//           // *Se convierte a astring parte del array e formato JSON
//           var arrayDosDetalle = JSON.parse(arrayDetalle);
//           // *Se convierte nuevamente a array
//           var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
//           // *Se parsea el json con el detalle de piezas de la promo creada
//           var arrayTresParse = JSON.parse(arrayTres);

//           cargaHtml += '<ul class="collection">';
//           cargaHtml += `<li class="collection-item"><b>${
//             item.NombrePromo
//           }</b></li>`;
//           $.each(arrayTresParse, function(e, elem) {
//             cargaHtml += `<li class="collection-item">${elem.Piezas} ${
//               elem.Detalle
//             }</li>`;
//             // *Se crea una estructura html que cargue los datos de la venta
//           });
//           cargaHtml += '</ul>';
//         }
//       });
//       if (arrAgregados.length > 0) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
//         $.each(arrAgregados, function(a, agregado) {
//           cargaHtml += `<li class="collection-item">${
//             agregado.NombreAgregado
//           }</li>`;
//           // *Esta estructura html carga los datos de los agregados vinculados a la venta
//         });
//         cargaHtml += '</ul>';
//       }
//       $('#cargar_detalle_venta').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para cargar la tabla de ventas canceladas
// function cargarTablaVentasCanceladas() {
//   var action = 'CargarTablaVentasCanceladas';
//   var cargaHtml = '';
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     success: function(respuesta) {
//       var arr = JSON.parse(respuesta);
//       // *Se parsea la respuesta json obtenida
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           $.each(arr, function(indice, item) {
//             cargaHtml += '<tr>';
//             cargaHtml += '<td>' + item.CodigoVenta + '</td>';
//             cargaHtml += '<td>' + item.NombreCliente + '</td>';
//             cargaHtml += '<td>' + item.Fecha + '</td>';
//             cargaHtml += '<td>' + item.TipoEntrega + '</td>';
//             cargaHtml += '<td>' + item.TipoPago + '</td>';
//             cargaHtml += '<td>$' + item.Valor + '</td>';
//             cargaHtml += '<td>' + item.Motivo + '</td>';
//             cargaHtml += '<td>' + item.Empleado + '</td>';
//             cargaHtml +=
//               "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaCancelada(" +
//               item.IdVenta +
//               ")'><i class='material-icons'>more_vert</i></a></td>";
//             cargaHtml += '</tr>';
//           });

//           $('#body_tabla_ventas_canceladas_mikasa').html(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// function verDetalleVentaCancelada(idVenta) {
//   $('#modal_detalle_venta_cancelada').modal('open');
//   var actionPromoCompra = 'VerDetalleVentaPromoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: actionPromoCompra, IdVenta: idVenta },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     sync: false,
//     success: function(resp) {
//       var arrayDetalleVenta = JSON.parse(resp);
//       // *El json se convierte a array
//       var arrAgregados = arrayDetalleVenta[1];
//       // *Array de agregados vinculado a la venta
//       var arr = arrayDetalleVenta[0];
//       // *Se obtiene el comnetario vinculado a la venta
//       if (arrayDetalleVenta[2] != null) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
//         cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
//         cargaHtml += '</ul>';
//       }
//       // *Si no existe un comentario no e muestra en pantalla
//       $.each(arr, function(i, item) {
//         if (item.NombrePromo != null) {
//           var arrayDetalle = JSON.stringify(eval(arr[i]));
//           // *Se convierte a astring parte del array e formato JSON
//           var arrayDosDetalle = JSON.parse(arrayDetalle);
//           // *Se convierte nuevamente a array
//           var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
//           // *Se parsea el json con el detalle de piezas de la promo creada
//           var arrayTresParse = JSON.parse(arrayTres);

//           cargaHtml += '<ul class="collection">';
//           cargaHtml += `<li class="collection-item"><b>${
//             item.NombrePromo
//           }</b></li>`;
//           $.each(arrayTresParse, function(e, elem) {
//             cargaHtml += `<li class="collection-item">${elem.Piezas} ${
//               elem.Detalle
//             }</li>`;
//             // *Se crea una estructura html que cargue los datos de la venta
//           });
//           cargaHtml += '</ul>';
//         }
//       });
//       if (arrAgregados.length > 0) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
//         $.each(arrAgregados, function(a, agregado) {
//           cargaHtml += `<li class="collection-item">${
//             agregado.NombreAgregado
//           }</li>`;
//           // *Esta estructura html carga los datos de los agregados vinculados a la venta
//         });
//         cargaHtml += '</ul>';
//       }
//       $('#cargar_detalle_venta_cancelada').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para filtrar los datos en la tabla
// $('#txt_buscar_ventas_canceladas').on('keyup', function() {
//   var caracterFiltro = $(this)
//     .val()
//     .toLowerCase();
//   $('#body_tabla_ventas_canceladas_mikasa tr').filter(function() {
//     $(this).toggle(
//       $(this)
//         .text()
//         .toLowerCase()
//         .indexOf(caracterFiltro) > -1
//     );
//   });
// });

// // *Se carga el precio máximo permitido por compra para mostrarlo en pantalla
// function cargarPrecioMaximoCompra() {
//   var action = 'CargarPrecioMaximoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: action },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     success: function(resp) {
//       if (resp != null || parseInt(resp) != 0) {
//         cargaHtml += `<p>Precio Máximo permitido: $${resp}</p>`;
//       } else {
//         cargaHtml += '<p>Precio Máximo permitido: No Definido</p>';
//       }
//       $('#precio_maximo').html(cargaHtml);
//     },
//     error: function() {
//       cargaHtml += cargaHtml += '<p>Precio Máximo permitido: No Definido</p>';
//       $('#precio_maximo').html(cargaHtml);
//     }
//   });
// }

// // *Función para filtrar los datos en la tabla
// $('#txt_buscar_ventas_historial').on('keyup', function() {
//   var caracterFiltro = $(this)
//     .val()
//     .toLowerCase();
//   $('#body_tabla_historial_ventas_mikasa tr').filter(function() {
//     $(this).toggle(
//       $(this)
//         .text()
//         .toLowerCase()
//         .indexOf(caracterFiltro) > -1
//     );
//   });
// });

// // *Función para cargar la tabla de ventas canceladas
// function cargarTablaHistorialVentas() {
//   var action = 'CargarTablaHistorialVentas';
//   var cargaHtml = '';
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     success: function(respuesta) {
//       var arr = JSON.parse(respuesta);

//       // *Se parsea la respuesta json obtenida
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla

//           $.each(arr, function(indice, item) {
//             cargaHtml += '<tr>';
//             cargaHtml += '<td>' + item.CodigoVenta + '</td>';
//             cargaHtml += '<td>' + item.NombreCliente + '</td>';
//             cargaHtml += '<td>' + item.Fecha + '</td>';
//             cargaHtml += '<td>' + item.TipoEntrega + '</td>';
//             cargaHtml += '<td>' + item.TipoPago + '</td>';
//             cargaHtml += '<td>' + item.TipoVenta + '</td>';
//             cargaHtml += '<td>' + item.HoraEntrega + '</td>';
//             cargaHtml += '<td>$' + item.Valor + '</td>';
//             cargaHtml += '<td>' + item.EstadoVenta + '</td>';
//             cargaHtml +=
//               "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaHistorial(" +
//               item.IdVenta +
//               ")'><i class='material-icons'>more_vert</i></a></td>";
//             cargaHtml += '</tr>';
//           });
//           $('#body_tabla_historial_ventas_mikasa').html(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// function verDetalleVentaHistorial(idVenta) {
//   $('#modal_detalle_venta_historial').modal('open');
//   var actionPromoCompra = 'VerDetalleVentaPromoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: actionPromoCompra, IdVenta: idVenta },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     sync: false,
//     success: function(resp) {
//       console.log(resp);

//       var arrayDetalleVenta = JSON.parse(resp);
//       // *El json se convierte a array
//       var arrAgregados = arrayDetalleVenta[1];
//       // *Array de agregados vinculado a la venta
//       var arr = arrayDetalleVenta[0];
//       // *Se obtiene el comnetario vinculado a la venta
//       if (arrayDetalleVenta[2] != null) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
//         cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
//         cargaHtml += '</ul>';
//       }
//       // *Si no existe un comentario no e muestra en pantalla
//       $.each(arr, function(i, item) {
//         if (item.NombrePromo != null) {
//           var arrayDetalle = JSON.stringify(eval(arr[i]));
//           // *Se convierte a astring parte del array e formato JSON
//           var arrayDosDetalle = JSON.parse(arrayDetalle);
//           // *Se convierte nuevamente a array
//           var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
//           // *Se parsea el json con el detalle de piezas de la promo creada
//           var arrayTresParse = JSON.parse(arrayTres);

//           cargaHtml += '<ul class="collection">';
//           cargaHtml += `<li class="collection-item"><b>${
//             item.NombrePromo
//           }</b></li>`;
//           $.each(arrayTresParse, function(e, elem) {
//             cargaHtml += `<li class="collection-item">${elem.Piezas} ${
//               elem.Detalle
//             }</li>`;
//             // *Se crea una estructura html que cargue los datos de la venta
//           });
//           cargaHtml += '</ul>';
//         }
//       });
//       if (arrAgregados.length > 0) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
//         $.each(arrAgregados, function(a, agregado) {
//           cargaHtml += `<li class="collection-item">${
//             agregado.NombreAgregado
//           }</li>`;
//           // *Esta estructura html carga los datos de los agregados vinculados a la venta
//         });
//         cargaHtml += '</ul>';
//       }
//       $('#cargar_detalle_venta_historial').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para filtrar los datos en la tabla
// $('#txt_buscar_ventas_canceladas').on('keyup', function() {
//   var caracterFiltro = $(this)
//     .val()
//     .toLowerCase();
//   $('#body_tabla_ventas_canceladas_mikasa tr').filter(function() {
//     $(this).toggle(
//       $(this)
//         .text()
//         .toLowerCase()
//         .indexOf(caracterFiltro) > -1
//     );
//   });
// });

// // *Se cargan las ordenes pendientes de entrega para que sean visualizadas por el cliente
// function cargarTrackingMisOrdenes() {
//   var action = 'CargarTrackingMisOrdenes';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: action },
//     url: '../app/control/despEntregas.php',
//     type: 'POST',
//     success: function(resp) {
//       var arr = JSON.parse(resp);
//       cargaHtml += '<ul class="collection">';
//       if (arr.length > 0) {
//         $.each(arr, function(i, item) {
//           cargaHtml += '<li class="collection-item avatar">';
//           cargaHtml += `<i class="material-icons circle green">${
//             item.Icono
//           }</i>`;
//           cargaHtml += `<p class="green-text">Estado Entrega: ${
//             item.EstadoEntrega
//           }</p>`;
//           cargaHtml += '<p>';
//           cargaHtml += `Código Venta: ${item.CodigoVenta} </br>`;
//           cargaHtml += `Precio: $${item.Valor} </br>`;
//           cargaHtml += `TipoEntrega: ${item.TipoEntrega} </br>`;
//           cargaHtml += `Receptor: ${item.Receptor}`;
//           cargaHtml += '</p>';
//           cargaHtml += `<a href="#!" class="secondary-content black-text" onclick="verDetalleTrackingMiEntrega(${
//             item.IdVenta
//           })"><i class="material-icons">more_horiz</i></a>`;
//           cargaHtml += '</li>';
//         });
//         cargaHtml += '</ul>';
//       } else {
//         cargaHtml += '<li class="collection-item">';
//         cargaHtml += '<p>No tienes entregas pendientes.</p>';
//         cargaHtml += '</li>';
//       }
//       $('#cargar_tracking_mis_ordenes').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error al cargar los datos');
//     }
//   });
// }

// function verDetalleTrackingMiEntrega(idVenta) {
//   $('#modal_detalle_venta_tracking').modal('open');
//   var actionPromoCompra = 'VerDetalleVentaPromoCompra';
//   var cargaHtml = '';
//   $.ajax({
//     data: { action: actionPromoCompra, IdVenta: idVenta },
//     url: '../app/control/despVenta.php',
//     type: 'POST',
//     sync: false,
//     success: function(resp) {
//       var arrayDetalleVenta = JSON.parse(resp);
//       // *El json se convierte a array
//       var arrAgregados = arrayDetalleVenta[1];
//       // *Array de agregados vinculado a la venta
//       var arr = arrayDetalleVenta[0];
//       // *Se obtiene el comnetario vinculado a la venta
//       if (arrayDetalleVenta[2] != null) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += `<li class="collection-item"><b>Comentario:</b></li>`;
//         cargaHtml += `<li class="collection-item">${arrayDetalleVenta[2]}</li>`;
//         cargaHtml += '</ul>';
//       }
//       // *Si no existe un comentario no e muestra en pantalla
//       $.each(arr, function(i, item) {
//         if (item.NombrePromo != null) {
//           var arrayDetalle = JSON.stringify(eval(arr[i]));
//           // *Se convierte a astring parte del array e formato JSON
//           var arrayDosDetalle = JSON.parse(arrayDetalle);
//           // *Se convierte nuevamente a array
//           var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
//           // *Se parsea el json con el detalle de piezas de la promo creada
//           var arrayTresParse = JSON.parse(arrayTres);

//           cargaHtml += '<ul class="collection">';
//           cargaHtml += `<li class="collection-item"><b>${
//             item.NombrePromo
//           }</b></li>`;
//           $.each(arrayTresParse, function(e, elem) {
//             cargaHtml += `<li class="collection-item">${elem.Piezas} ${
//               elem.Detalle
//             }</li>`;
//             // *Se crea una estructura html que cargue los datos de la venta
//           });
//           cargaHtml += '</ul>';
//         }
//       });
//       if (arrAgregados.length > 0) {
//         cargaHtml += '<ul class="collection">';
//         cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
//         $.each(arrAgregados, function(a, agregado) {
//           cargaHtml += `<li class="collection-item">${
//             agregado.NombreAgregado
//           }</li>`;
//           // *Esta estructura html carga los datos de los agregados vinculados a la venta
//         });
//         cargaHtml += '</ul>';
//       }
//       $('#cargar_detalle_venta_tracking').html(cargaHtml);
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// function ObtenerDineroCartera() {
//   var action = 'ObtenerDineroCartera';
//   var cargaHtml = '';
//   //   *Se cargan los datos de los ingredientes en el carrito
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despPromoCompra.php',
//     type: 'POST',
//     success: function(respuesta) {
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           cargaHtml += `$${respuesta}`;
//           //   *--------------------------------------------------
//           $('#total_cartera_webpay').html(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Variables globales utilizadas para la generación de rolls
// let cantidadPiezasArmaTuPromo = 0;
// let cantidadOpcionesCoberturas = 2;
// let cantidadOpcionesRellenos = 0;
// let arrayRollsCreados = [];
// let coberturasPromoAGustoChef = [];
// let cantidadSeleccionCoberturasChef = 0;
// // *---------------------------------------------------

// function cargarPromosCarta(estado, caracter) {
//   var action = 'CargarPromosCarta';
//   var cargaHtml = '';
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despPromos.php',
//     type: 'POST',
//     success: function(respuesta) {
//       console.log(respuesta);

//       // *----------------------------------------------------------------------
//       var arr = JSON.parse(respuesta);
//       // *Se parsea la respuesta json obtenida

//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           //* Por defecto los datos serán cargados en pantalla
//           $.each(arr, function(indice, item) {
//             // *Se cargarán los datos en el menú index
//             console.log(JSON.parse(item.ArrayTipoCoberturas));
//             var detalleTipoCoberturas = JSON.parse(item.ArrayTipoCoberturas);
//             var detalleAgregados = JSON.parse(item.ArrayAgregados);
//             cargaHtml += '<div class="col s12 m6 l4 xl3">';
//             cargaHtml += '<div class="card col s12 m12 l12">';
//             if (item.Descuento > 0) {
//               cargaHtml += `<div class="descuento"><p class="center-align">-${
//                 item.Descuento
//               }%</p></div>`;
//             }
//             cargaHtml +=
//               '<div class="card-image waves-effect waves-block waves-light">';
//             cargaHtml += `<img class="activator" src="uploads/${item.ImgUrl}">`;
//             cargaHtml += '</div>';
//             cargaHtml += '<div class="card-content">';
//             cargaHtml += `<span class="card-title activator grey-text text-darken-4">${
//               item.Nombre
//             }<i class="material-icons right">more_vert</i></span>`;
//             cargaHtml += '<div class="precios-productos">';
//             if (item.Descuento > 0) {
//               cargaHtml += `<span class="red-text"><strike>Antes: $${
//                 item.Precio
//               }</strike></span>`;
//               cargaHtml += `<span class="green-text">Ahora: $${item.Precio -
//                 (item.Precio / 100) * item.Descuento}</span>`;
//             } else {
//               cargaHtml += `<span class="green-text">Precio: $${
//                 item.Precio
//               }</span>`;
//             }
//             cargaHtml += '</div>';
//             cargaHtml += '<div class="divider"></div>';
//             cargaHtml += '<div class="btn-mant-productos">';

//             if (item.IdTipoPreparacion == 2) {
//               cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light black" onclick="ComprobarTipoDePromo(${
//                 item.IdPromo
//               })"><i class="material-icons">add_shopping_cart</i></a>`;
//             } else if (item.IdTipoPreparacion == 1) {
//               cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light black" onclick="ComprobarTipoDePromo(${
//                 item.IdPromo
//               })"><i class="material-icons">add_shopping_cart</i></a>`;
//             }

//             cargaHtml += '</div>';
//             cargaHtml += '</div>';
//             cargaHtml += '<div class="card-reveal">';
//             cargaHtml += `<span class="card-title grey-text text-darken-4"><b>${
//               item.Nombre
//             }</b><i class="material-icons right">close</i></span>`;
//             // *Carga el detalle de los tipo de coberturas
//             if (detalleTipoCoberturas == null) {
//               cargaHtml += `<p>Arma tu promo de ${item.Cantidad} piezas</p>`;
//             } else {
//               cargaHtml += '<ul>';
//               for (let i = 0; i < detalleTipoCoberturas.length; i++) {
//                 cargaHtml += `<li><p>- ${detalleTipoCoberturas[i]}</p></li>`;
//               }
//               cargaHtml += '</ul>';
//             }

//             if (detalleAgregados != null) {
//               cargaHtml += `<p><b>Incluye: </b></p>`;
//               cargaHtml += '<ul>';
//               for (let i = 0; i < detalleAgregados.length; i++) {
//                 cargaHtml += `<li><p>- ${detalleAgregados[i]}</p></li>`;
//               }
//               cargaHtml += '</ul>';
//             }

//             cargaHtml += '<p></p>';
//             cargaHtml += '</div>';
//             cargaHtml += '</div>';
//             cargaHtml += '</div>';
//           });

//           $('#carga_promos_cliente').html(cargaHtml);
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para cargar los checkbox de coberturas en arma tu promo
// function cargarRadioButtonCoberturas(estado, caracter) {
//   var action = 'CargarCoberturasCarta';
//   var cargaHtml = '';
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despCoberturas.php',
//     type: 'POST',
//     success: function(respuesta) {
//       // *----------------------------------------------------------------------
//       var arr = JSON.parse(respuesta);
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           // *Las coberturas se cargan de forma ordenada según su índice
//           function groupBy(collection, property) {
//             var i = 0,
//               val,
//               index,
//               values = [],
//               result = [];
//             for (; i < collection.length; i++) {
//               val = collection[i][property];
//               index = values.indexOf(val);
//               if (index > -1) result[index].push(collection[i]);
//               else {
//                 values.push(val);
//                 result.push([collection[i]]);
//               }
//             }
//             cantidadOpcionesCoberturas = result.length;

//             return result;
//           }
//           var arrayAgrupado = groupBy(arr, 'Indice');
//           $.each(arrayAgrupado, function(indice, item) {
//             cargaHtml += '<div class="content_coberturas">';
//             cargaHtml += `<p>${indice + 1}.- </p>`;
//             $.each(item, function(i, elementos) {
//               cargaHtml += '<div class="radio_coberturas">';
//               cargaHtml += '<p>';
//               cargaHtml += '<label>';
//               cargaHtml += `<input name='cobertura' type='radio' nombre='${
//                 elementos.Nombre
//               }' value='${elementos.IdCobertura}'></input>`;
//               if (elementos.Precio != 0) {
//                 cargaHtml += `<span>${elementos.Nombre}/+$${
//                   elementos.Precio
//                 }</span>`;
//               } else {
//                 cargaHtml += `<span>${elementos.Nombre}</span>`;
//               }
//               cargaHtml += '</label>';
//               cargaHtml += '</p>';
//               cargaHtml += '</div>';
//             });
//             cargaHtml += '</div>';
//             $('#carga_chekbox_cobertura').html(cargaHtml);
//           });
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// // *Función para cargar los checkbox de rellenos en arma tu promo
// function cargarRadioButtonRellenos(estado, caracter) {
//   var action = 'CargarRellenosCarta';
//   var cargaHtml = '';
//   //*Se envían datos del form y action, al controlador mediante ajax
//   $.ajax({
//     data: `action=${action}`,
//     url: '../app/control/despRellenos.php',
//     type: 'POST',
//     success: function(respuesta) {
//       // *----------------------------------------------------------------------
//       var arr = JSON.parse(respuesta);
//       // *-----------------------------------------------------------------------
//       //*Acción a ejecutar si la respuesta existe
//       switch (respuesta) {
//         case 'error':
//           alert('Lo sentimos ha ocurrido un error');
//           break;
//         default:
//           // *Los rellenos se cargan de forma ordenada según su índice
//           // *Se agrupan y se muestran de forma ordenada
//           // *La función recibe el array con los rellenos y los agrupa en uno nuevo
//           function groupBy(collection, property) {
//             var i = 0,
//               val,
//               index,
//               values = [],
//               result = [];
//             for (; i < collection.length; i++) {
//               val = collection[i][property];
//               index = values.indexOf(val);
//               if (index > -1) result[index].push(collection[i]);
//               else {
//                 values.push(val);
//                 result.push([collection[i]]);
//               }
//             }

//             cantidadOpcionesRellenos = result.length;
//             return result;
//             // *Retorna el nuevo array
//           }
//           var arrayAgrupado = groupBy(arr, 'Indice');
//           // *Se pasa el array y la propiedad por la que se quiere agrupar

//           // *Nuevo array con los datos agrupados por indice
//           $.each(arrayAgrupado, function(indice, item) {
//             // *Se recorre el array en base a los indices
//             cargaHtml += '<div class="content_rellenos">';
//             cargaHtml += `<p>${indice + 1}.- </p>`;
//             // *Se recorre el array de los rellenos
//             $.each(item, function(i, elementos) {
//               cargaHtml += '<div class="radio_rellenos">';
//               cargaHtml += '<p>';
//               cargaHtml += '<label class="radio-button-text">';
//               cargaHtml += `<input name='relleno${
//                 elementos.Indice
//               }' type='radio' nombre='${elementos.Nombre}' value='${
//                 elementos.IdRelleno
//               }'></input>`;
//               if (elementos.Precio != 0) {
//                 cargaHtml += `<span>${elementos.Nombre}/+$${
//                   elementos.Precio
//                 }</span>`;
//               } else {
//                 cargaHtml += `<span>${elementos.Nombre}</span>`;
//               }
//               cargaHtml += '</label>';
//               cargaHtml += '</p>';
//               cargaHtml += '</div>';
//             });
//             cargaHtml += '</div>';
//             $('#carga_chekbox_rellenos').html(cargaHtml);
//           });
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error');
//     }
//   });
// }

// function cargarComboCantidadRollsArmaTuPromo() {
//   // *Recibe la cantidad total de rolls y los divide por diez para distribuir las cantidades opcionales
//   var cantidadOpciones = cantidadPiezasArmaTuPromo / 10;
//   // *cantidadPiezasArmaTuPromo es una variable global que se actualiza en base las opciones de piezas creadas por el cliente
//   var insertHtml = '';
//   if (cantidadOpciones != 0) {
//     for (var i = 1; i <= cantidadOpciones; i++) {
//       insertHtml += `<option value='${i * 10}'>${i * 10}</option>`;
//       // *Se cargan las cantidades opcionales en base a la disponibilidad de agregación
//     }
//   } else {
//     insertHtml += '<option value="0">Selección completada</option>';
//   }
//   $('#cantidad_de_piezas_add_carro').html(insertHtml);
// }

// // *Comprueba el tipo de preparación de la promo mediante el id
// function ComprobarTipoDePromo(id) {
//   var idPromo = id;
//   var action = 'ComprobarTipoDePromo';
//   $.ajax({
//     data: {
//       action: action,
//       id: idPromo
//     },
//     url: '../app/control/despPromos.php',
//     type: 'POST',
//     success: function(resp) {
//       var arrayResp = JSON.parse(resp);
//       $.each(arrayResp, function(indice, item) {
//         // *El tipo de promo es arma tu promo por lo que se abre el modal y se cargan los ingredientes
//         if (item.IdTipoPreparacion == 2) {
//           $('#accion_promo_compra').text(`Arma tu promo ${item.Nombre}`);
//           $('#cantidad_piezas_promo_compra').text(`(${item.Cantidad} piezas)`);
//           $('#modal_add_arma_tu_promo').modal('open');
//           $('#lbl_id_promo_compra').val(idPromo);
//           cantidadPiezasArmaTuPromo = item.Cantidad;
//           cargarComboCantidadRollsArmaTuPromo();
//           cargarRadioButtonCoberturas();
//           cargarRadioButtonRellenos();
//         } else {
//           // *Si el tipo de promo es a gusto del chef se verifica si los tipo de coberturas asociadas poseen más de una opción
//           $('#lbl_id_promo_compra_chef').val(idPromo);
//           var actionPromoChef = 'ComprobarTipoCoberturasPromoChef';
//           var cargaHtml = '';
//           $.ajax({
//             data: {
//               action: actionPromoChef,
//               id: idPromo
//             },
//             url: '../app/control/despPromos.php',
//             type: 'POST',
//             success: function(resp) {
//               var arrayResp = JSON.parse(resp);
//               switch (arrayResp) {
//                 // *No hay tipo de cobertura con más de una opción
//                 case '1':
//                   alert('No hay opciones de selección');
//                   break;
//                 default:
//                   if (arrayResp.length > 0) {
//                     // *Si existe un tipo de cobertura asociado con más de una opción
//                     // *Se abre el modal asociado y se cargan las cobeturas opcionales
//                     $('#modal_promo_chef_compra').modal('open');
//                     $('#accion_promo_compra_chef').text(
//                       `A gusto del chef ${item.Nombre}`
//                     );
//                     $('#cantidad_piezas_promo_compra_chef').text(
//                       `(${item.Cantidad} piezas)`
//                     );
//                     $.each(arrayResp, function(indice, item) {
//                       var index = indice;
//                       var a = JSON.stringify(eval(item.Coberturas));
//                       var arrayCoberturas = JSON.parse(a);
//                       cargaHtml += `<p class="modal-titulo-eleccion-ingredientes">Cobertura ${
//                         item.NombreTipoCobertura
//                       }</p>`;
//                       cargaHtml += '<div class="content_coberturas">';
//                       $.each(arrayCoberturas, function(i, elem) {
//                         cargaHtml += '<div class="radio_coberturas">';
//                         cargaHtml += '<p>';
//                         cargaHtml += '<label class="radio-button-text">';
//                         cargaHtml += `<input name='coberturaChef${index +
//                           1}' type='radio' value='${elem.id}' data-cantidad='${
//                           elem.cantidad
//                         }'></input>`;
//                         cargaHtml += `<span>${elem.nombre}</span>`;
//                         cargaHtml += '</label>';
//                         cargaHtml += '</p>';
//                         cargaHtml += '</div>';
//                       });
//                       cargaHtml += '</div>';
//                       $('#carga_chekbox_coberturas_chef').html(cargaHtml);
//                       cantidadSeleccionCoberturasChef++;
//                     });
//                     // indice++;
//                   } else {
//                     concretarPromoIngresoPromoChef();
//                     // *Si no hay tipos de coberturas con más de una opción se ingresa automaticamente
//                   }
//                   break;
//               }
//             },
//             error: function() {
//               alert(
//                 'Lo sentimos ha ocurrido un error al comprobar la promo seleccionada'
//               );
//             }
//           });
//         }
//       });
//     },
//     error: function() {
//       alert(
//         'Lo sentimos ha ocurrido un error al comprobar la promo seleccionada'
//       );
//     }
//   });
// }

// // *Los datos seleccionados se añaden a la lista para llevar la cuenta total de productos
// // *Almacena los rolls creados
// $('#btn_add_roll_promo').click(function() {
//   if (cantidadPiezasArmaTuPromo == 0) {
//     alert('Ya haz seleccionado la cantidad posible.');
//   } else {
//     $('#lista_rolls_compra').empty();
//     var arrayRoll = [];
//     var arrayCoberturaDetalleRoll = [];
//     var arrayRellenoDetalleRoll = [];
//     var listaHtml = '';
//     var cantidadPiezas = $('#cantidad_de_piezas_add_carro').val();
//     // for (var i = 1; i <= cantidadOpcionesCoberturas; i++) {
//     var idCobertura = $(`input[name=cobertura]:checked`).val();
//     var nombreCobertura = $(`input[name=cobertura]:checked`).attr('nombre');
//     // *Se valida que se seleccione una cobertura
//     if (idCobertura == null || nombreCobertura == null) {
//       M.toast({
//         html: 'Debes seleccionar una cobertura',
//         displayLength: 3000,
//         classes: 'red'
//       });
//       arrayCoberturaDetalleRoll = [];
//     } else {
//       // *Si se selecciona se ingresa al array
//       arrayCoberturaDetalleRoll.push({
//         Id: idCobertura,
//         Nombre: nombreCobertura
//       });
//     }
//     // }
//     // *Se valida que todas las opciones de relleno posean una selección
//     for (var j = 1; j <= cantidadOpcionesRellenos; j++) {
//       var idRelleno = $(`input[name=relleno${j}]:checked`).val();
//       var nombreRelleno = $(`input[name=relleno${j}]:checked`).attr('nombre');
//       // *Si no se elije un relleno válido los array de detalle del roll se vacían
//       if (idRelleno != null || nombreRelleno != null) {
//         // M.toast({
//         //   html: 'Selecciona al menos un relleno por opción.',
//         //   displayLength: 3000,
//         //   classes: 'red'
//         // });
//         // arrayCoberturaDetalleRoll = [];
//         // arrayRellenoDetalleRoll = [];
//         // break;
//         // } else {
//         arrayRellenoDetalleRoll.push({
//           Id: idRelleno,
//           Nombre: nombreRelleno
//         });
//       }
//     }
//     if (
//       arrayCoberturaDetalleRoll.length > 0 &&
//       arrayRellenoDetalleRoll.length > 0
//     ) {
//       arrayRoll.push(cantidadPiezas);
//       cantidadPiezasArmaTuPromo -= cantidadPiezas;
//       // *La variable global de cantidad de piezas arma tu promo se actualiza con la cantidad disponible
//       arrayRoll.push({ Coberturas: arrayCoberturaDetalleRoll });
//       arrayRoll.push({ Rellenos: arrayRellenoDetalleRoll });
//       // *Si seleccionaron piezas para todas las opciones el roll creado se ingresa a un array
//       arrayRollsCreados.push({ arrayRoll: arrayRoll });

//       // *Se carga una lista con los rolls creados
//       $.each(arrayRollsCreados, function(indice, item) {
//         listaHtml += '<li class="collection-item">';
//         listaHtml += `<span>${item.arrayRoll[0]} piezas con: </span>`;
//         $.each(item.arrayRoll, function(indice, elem) {
//           $.each(elem.Coberturas, function(ind, elem) {
//             listaHtml += `<span>${elem.Nombre} | </span>`;
//           });
//           $.each(elem.Rellenos, function(ind, elem) {
//             listaHtml += `<span>${elem.Nombre} | </span>`;
//           });
//         });
//         listaHtml += `<a onclick='eliminarRollCompraList(${indice})' href="#">Eliminar<a/>`;
//         listaHtml += '</li>';
//       });
//       // *Se carga el combobox de cantidad de opciones para los rolls creados
//       cargarComboCantidadRollsArmaTuPromo();
//       $('#lista_rolls_compra').append(listaHtml);
//     } else {
//       // !Cambio
//       M.toast({
//         html: 'Asegurate de haber seleccionado los ingredientes.',
//         displayLength: 3000,
//         classes: 'red'
//       });
//     }
//   }
// });

// // *Elimina el rol específico de la lista arma tu promo
// function eliminarRollCompraList(indice) {
//   // *Se elimina un roll creado de la lista de la promo compra
//   var listaHtml = '';
//   var cantidadEliminada = arrayRollsCreados[indice].arrayRoll[0];
//   cantidadPiezasArmaTuPromo =
//     parseInt(cantidadPiezasArmaTuPromo) + parseInt(cantidadEliminada);
//   arrayRollsCreados.splice(indice, 1);
//   // *La variable cantidad de piezas se actualiza con las cantidades disponible después de la eliminación
//   $('#lista_rolls_compra').empty();
//   $.each(arrayRollsCreados, function(indic, item) {
//     listaHtml += '<li class="collection-item">';
//     listaHtml += `<span>${item.arrayRoll[0]} piezas con: </span>`;
//     $.each(item.arrayRoll, function(indices, elem) {
//       $.each(elem.Coberturas, function(ind, elem) {
//         listaHtml += `<span>${elem.Nombre} | </span>`;
//       });
//       $.each(elem.Rellenos, function(indi, elem) {
//         listaHtml += `<span>${elem.Nombre} | </span>`;
//       });
//     });
//     listaHtml += `<a onclick='eliminarRollCompraList(${indice})' href="#">Eliminar<a/>`;
//     listaHtml += '</li>';
//   });
//   $('#lista_rolls_compra').append(listaHtml);
//   // *Se carga el combobox con las cantidades opcionales de creación de rolls
//   cargarComboCantidadRollsArmaTuPromo();
//   console.log(cantidadPiezasArmaTuPromo);
//   console.log(arrayRollsCreados);
//   console.log(cantidadEliminada);
// }

// $('#cancelar_arma_tu_promo_compra').on('click', function(evt) {
//   evt.preventDefault();
//   $('#modal_add_arma_tu_promo').modal('close');
//   // *Borra los datos de la lista
//   cantidadPiezasArmaTuPromo = 0;
//   cantidadOpcionesCoberturas = 0;
//   cantidadOpcionesRellenos = 0;
//   arrayRollsCreados = [];
//   // *Al cerrar el modal las variable globales se resetean
// });

// $('#cancelar_promo_chef_compra').on('click', function(evt) {
//   evt.preventDefault();
//   $('#modal_promo_chef_compra').modal('close');
//   // *Borra los datos de la lista
//   cantidadPiezasArmaTuPromo = 0;
//   cantidadOpcionesCoberturas = 0;
//   cantidadOpcionesRellenos = 0;
//   arrayRollsCreados = [];
//   cantidadSeleccionCoberturasChef = 0;
//   // *Al cerrar el modal las variables globales se resetean
// });

// $('#form_arma_tu_promo').submit(function(evt) {
//   evt.preventDefault();
//   if (arrayRollsCreados.length == 0 || cantidadPiezasArmaTuPromo != 0) {
//     alert('Por favor selecciona las piezas que deseas comprar');
//   } else {
//     swal({
//       title: 'Espere un momento',
//       html: 'Estamos procesando tu pedido',
//       timer: 2000,
//       onOpen: () => {
//         swal.showLoading();
//       }
//     });
//     var dataInfo = ';';
//     var action = 'IngresarPromoCompra';
//     var arrayRollsAIngresar = JSON.stringify(arrayRollsCreados);
//     var id_promo = $('#lbl_id_promo_compra').val();
//     dataInfo = {
//       rollscompra: arrayRollsAIngresar,
//       id_promo: id_promo,
//       action: action
//     };
//     $.ajax({
//       data: dataInfo,
//       url: '../app/control/despPromoCompra.php',
//       type: 'POST',
//       success: function(resp) {
//         switch (resp) {
//           case '1':
//             $('#modal_add_arma_tu_promo').modal('close');
//             M.toast({
//               html: 'Se añadió un producto al carro',
//               displayLength: 3000,
//               classes: 'light-green accent-3'
//             });
//             pulseBoton();
//             break;
//           case '2':
//             swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//             break;
//         }
//       },
//       error: function() {
//         alert('Lo sentimos ha ocurrido un error.');
//       }
//     });
//   }
// });

// // function pulseBoton() {
// //   $('#btn_carrito').toggleClass('pulse-button animated tada');
// //   setTimeout(function() {
// //     $('#btn_carrito').toggleClass('pulse-button animated tada');
// //   }, 6000);
// // }

// $('#form_arma_tu_promo_chef').submit(function(evt) {
//   evt.preventDefault();
//   // *Se valida que la cantidad de coberturas opcionales para los tipo de coberturas posean una opción seleccionada
//   for (var j = 1; j <= cantidadSeleccionCoberturasChef; j++) {
//     var idCobertura = parseInt(
//       $(`input[name=coberturaChef${j}]:checked`).val()
//     );
//     var cantidad = parseInt(
//       $(`input[name=coberturaChef${j}]:checked`).attr('data-cantidad')
//     );
//     console.log(idCobertura, cantidad);
//     if (idCobertura == null || isNaN(idCobertura)) {
//       M.toast({
//         html: 'Selecciona al menos una cobertura.',
//         displayLength: 3000,
//         classes: 'red'
//       });
//       arrayRollsCreados = [];
//       break;
//       // *Si no selecciona una opción se detiene el foreach
//     } else {
//       arrayRollsCreados.push({
//         Cantidad: cantidad,
//         IdCobertura: idCobertura
//       });
//     }
//   }
//   console.log(arrayRollsCreados);
//   if (arrayRollsCreados.length != 0) {
//     // alert('Por favor selecciona las piezas que deseas comprar');
//     // } else {
//     concretarPromoIngresoPromoChef();
//   }
// });

// function concretarPromoIngresoPromoChef() {
//   swal({
//     title: 'Espera',
//     html: 'Estamos procesando tu pedido',
//     timer: 3000,
//     onOpen: () => {
//       swal.showLoading();
//     }
//   });
//   var dataInfo = '';
//   var action = 'IngresarPromoCompraChef';
//   var id_promo = $('#lbl_id_promo_compra_chef').val();
//   var arrayRollsAIngresarChef = JSON.stringify(arrayRollsCreados);
//   dataInfo = {
//     rollscompra: arrayRollsAIngresarChef,
//     id_promo: id_promo,
//     action: action
//   };
//   $.ajax({
//     data: dataInfo,
//     url: '../app/control/despPromoCompra.php',
//     type: 'POST',
//     success: function(resp) {
//       console.log(resp);
//       switch (resp) {
//         case '1':
//           $('#modal_promo_chef_compra').modal('close');
//           M.toast({
//             html: 'Se añadió un producto al carro',
//             displayLength: 3000,
//             classes: 'light-green accent-3'
//           });
//           pulseBoton();
//           break;
//         case '2':
//           swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
//           break;
//       }
//     },
//     error: function() {
//       alert('Lo sentimos ha ocurrido un error.');
//     }
//   });
// }

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
            $('#lbl_id_empleados').val(id);
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
      emailCom: true
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
      emailCom: 'Correo inválido (ejemplo: dmc@gmail.com)'
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
        var idEmpleado = $('#lbl_id_empleados').val();
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
                swal('Error', 'El correo ingresado ya existe en nuestros registros.', 'error');
                break;
              default:
                swal('Error', 'Lo sentimos hubo un problema al actualizar los datos.', 'error');
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
            tabla += '<td  class="center-align"><button class="btn btn-floating tooltipped waves-effect waves-light red"\n                data-position="right" data-tooltip="Eliminar" class=\'delete\' id=' + item.idEmpleado + ' onclick=\'EliminarEmpleado(' + item.idEmpleado + ')\' ><i class="material-icons">delete</i></button></td>';
            tabla += '<td><a class="waves-effect waves-light blue btn btn-floating modal-trigger" id="' + item.idEmpleado + '" onclick=\'cargaModalEmpleado(' + item.idEmpleado + ')\' data-position="right" href="#modal-actualiza-cliente"><i class="material-icons">edit</i></a><td></tr>';
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
      emailCom: true
    },
    txt_password: {
      required: true,
      minlength: 7,
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
      emailCom: 'Correo inválido (ejemplo: dmc@gmail.com)'
    },
    txt_password: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 7 caracteres',
      maxlength: 'Máximo 100 caracteres'
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
            console.log(resp);
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

// *Busca los empleados cuyos datos coincidan con los ingresados en el campo de textp
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

// *Función para filtrar los datos en la tabla
$('#txt_buscar_info_contacto').on('keyup', function () {
  var caracterFiltro = $(this).val().toLowerCase();
  $('#body_tabla_info_contacto tr').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(caracterFiltro) > -1);
  });
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarInfoContacto(id) {
  var action = 'EliminarInfoContacto';
  swal({
    title: '¿Estás seguro?',
    text: 'Al ser eliminada la información de contacto ya no podrá ser visulizada por los clientes.',
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
        url: '../app/control/despInfoContacto.php',
        type: 'POST',
        success: function success(resp) {
          switch (resp) {
            case '1':
              swal('Listo', 'La información de contacto fue eliminada.', 'success');
              CargarTablaInfoContacto();
              break;
            case '2':
              swal('Error', 'La información no pudo ser eliminada.', 'error');
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
function actualizarInfoContacto(id) {
  $('#accion_info_contacto').text('Actualizar Información de Contacto');
  $('#modal_mantenedor_info_contacto').modal('open');
  var action = 'CargarModalActualizarInfoContacto';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_info_contacto"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_info_contacto').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despInfoContacto.php',
    type: 'POST',
    success: function success(respuesta) {
      $('#accion_info_contacto').text('Actualizar Información de Contacto');
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_info_contacto').text(item.idContacto);
        $("label[for='txt_medio_info_contacto']").addClass('active');
        $('#txt_medio_info_contacto').val(item.medioContacto);
        $("label[for='txt_info_contacto']").addClass('active');
        $('#txt_info_contacto').val(item.infoContacto);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_info_contacto').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_info_contacto').modal('close');
});

$('#form_mantenedor_info_contacto').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_medio_info_contacto: {
      required: true,
      minlength: 3,
      maxlength: 200
    },
    txt_info_contacto: {
      required: true,
      minlength: 3,
      maxlength: 200
    }
  },
  messages: {
    txt_medio_info_contacto: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 200 caracteres'
    },
    txt_info_contacto: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
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
        if ($('#lbl_id_info_contacto').text() == '') {
          var _action6 = 'IngresarInfoContacto';
          dataInfo = {
            medio: $('#txt_medio_info_contacto').val(),
            info: $('#txt_info_contacto').val(),
            action: _action6
          };
        } else {
          var actionUpdate = 'ActualizarInfoContacto';
          dataInfo = {
            id: $('#lbl_id_info_contacto').text(),
            medio: $('#txt_medio_info_contacto').val(),
            info: $('#txt_info_contacto').val(),
            action: actionUpdate
          };
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: dataInfo,
          url: '../app/control/despInfoContacto.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                $('#modal_mantenedor_info_contacto').modal('close');
                swal('Listo', 'Los datos han sido actualizados', 'success');
                CargarTablaInfoContacto();
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

// *---------------Funciones Info Empresa

function CargarDatosInfoEmpresa() {
  var action = 'cargarDatosInfoEmpresa';
  var mensajeEstadoAperturaLocal = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despInfoEmpresa.php',
    type: 'POST',
    success: function success(respuesta) {
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
          $.each(arr, function (indice, item) {
            if (item.horaActual >= item.horaApertura && item.horaActual <= item.horaCierre && item.diaSemana >= item.diaInicio && item.diaSemana <= item.diaFinal) {
              mensajeEstadoAperturaLocal = '<div class="light-green-text">Ahora abierto</div>';
              $('#content_estado_apertura_local').html(mensajeEstadoAperturaLocal);
            } else {
              mensajeEstadoAperturaLocal = '<div class="red-text">Ahora cerrado</div>';
              $('#content_estado_apertura_local').html(mensajeEstadoAperturaLocal);
            }
            console.log(item.horaActual);
            $('#txt_hora_inicio').val(item.horaApertura);
            $('#txt_hora_final').val(item.horaCierre);
            $('#combo_dia_inicio').val(item.diaInicio);
            $('#combo_dia_final').val(item.diaFinal);
          });
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *----------------------------------------------------------

$('#restaurar_mantenedor_horas_actividad').on('click', function (evt) {
  evt.preventDefault();
  CargarDatosInfoEmpresa();
});

$('#restaurar_mantenedor_dias_actividad').on('click', function (evt) {
  evt.preventDefault();
  CargarDatosInfoEmpresa();
});

$('#form_horas_actividad_empresa').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_hora_inicio: {
      required: true,
      time24: true,
      comparar_hora_menor: true
    },
    txt_hora_final: {
      required: true,
      time24: true,
      comparar_hora_mayor: true
    }
  },
  messages: {
    txt_hora_inicio: {
      required: 'Campo requerido *',
      time24: 'Ingresa una hora válida'
    },
    txt_hora_final: {
      required: 'Campo requerido *',
      time24: 'Ingresa una hora válida'
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
      text: 'El cambio de horas de actividad podría alterar la generación de transacciones',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var dataInfo = '';

        var _action7 = 'ActualizarHorasActividadEmpresa';
        dataInfo = {
          horaInicio: $('#txt_hora_inicio').val(),
          horaCierre: $('#txt_hora_final').val(),
          action: _action7
        };

        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: dataInfo,
          url: '../app/control/despInfoEmpresa.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                swal('Listo', 'Las horas activas han sido actualizadas', 'success');
                CargarTablaInfoContacto();
                CargarDatosInfoEmpresa();
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

$('#form_dias_actividad_empresa').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    combo_dia_inicio: {
      required: true,
      min: 1,
      max: 7,
      comparar_dia_menor: true
    },
    combo_dia_final: {
      required: true,
      min: 1,
      max: 7,
      comparar_dia_mayor: true
    }
  },
  messages: {
    combo_dia_inicio: {
      required: 'Campo requerido *',
      min: 'Por favor eliga un día válido',
      max: 'Por favor eliga un día válido'
    },
    combo_dia_final: {
      required: 'Campo requerido *',
      min: 'Por favor eliga un día válido',
      max: 'Por favor eliga un día válido'
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
      text: 'El cambio de dias de actividad podría alterar la generación de transacciones',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(function (result) {
      if (result.value) {
        var dataInfo = '';

        var _action8 = 'ActualizarDiasActividadEmpresa';
        dataInfo = {
          diaInicio: $('#combo_dia_inicio').val(),
          diaCierre: $('#combo_dia_final').val(),
          action: _action8
        };

        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: dataInfo,
          url: '../app/control/despInfoEmpresa.php',
          type: 'POST',
          success: function success(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                swal('Listo', 'Los dias activas han sido actualizados', 'success');
                CargarTablaInfoContacto();
                CargarDatosInfoEmpresa();
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

$.validator.addMethod('time24', function (value, element, param) {
  return value == '' || value.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/);
}, 'Enter a valid time: hh:mm');

$.validator.addMethod('comparar_dia_menor', function (value, element) {
  return $('#combo_dia_inicio').val() < $('#combo_dia_final').val();
}, 'El dia de apertura debe ser anterior al dia de cierre');

$.validator.addMethod('comparar_dia_mayor', function (value, element) {
  return $('#combo_dia_final').val() > $('#combo_dia_inicio').val();
}, 'El dia de cierre debe ser posterior al dia de apertura');

$.validator.addMethod('comparar_hora_menor', function (value, element) {
  return $('#txt_hora_inicio').val() < $('#txt_hora_final').val();
}, 'La hora apertura debe ser anterior a la hora de cierre');

$.validator.addMethod('comparar_hora_mayor', function (value, element) {
  return $('#txt_hora_final').val() > $('#txt_hora_inicio').val();
}, 'La hora de cierre debe ser posterior a la hora de apertura');

function cargarPrecioMaximo() {
  var action = 'CargarPrecioMaximo';
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despInfoEmpresa.php',
    type: 'POST',
    success: function success(respuesta) {
      if (respuesta == '' || respuesta == null) {
        $('#txt_precio_maximo').val(0);
      } else {
        $('#txt_precio_maximo').val(respuesta);
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

$('#form_precio_maximo_compra').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_precio_maximo: {
      required: true,
      min: 1000,
      max: 1000000,
      digits: true
    }
  },
  messages: {
    txt_precio_maximo: {
      required: 'Campo requerido *',
      min: 'Mínimo $1000',
      max: 'Máximo $1000000',
      digits: 'Ingresa un número válido (ejemplo: 150000)'
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
        var action = 'ActualizarPrecioMaximoVenta';
        var precioMaximo = $('#txt_precio_maximo').val();
        console.log(precioMaximo);
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: { action: action, precioMaximo: precioMaximo },
          url: '../app/control/despInfoEmpresa.php',
          type: 'POST',
          success: function success(resp) {
            console.log(resp);
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                cargarPrecioMaximo();
                // *La función se ejecutó correctamente
                swal('Excelente!', 'Los datos han sido actualizados', 'success');
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

function cargarImagenesIndex() {
  var action = 'CargarImagenesIndex';
  //   var cargaHtml = '';
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despImagenesIndex.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      console.log(arr);
      switch (respuesta) {
        case 'error':
          break;
        default:
          var cargaHtmlUno = '\n              <img src="dist/img/' + arr[0].ImgUrl + '" class="img-slider">\n              <!-- random image -->\n              <div class="caption center-align">\n              <h2>This is our big Tagline!</h2>\n              <h5 class="light grey-text text-lighten-3">Here\'s our small slogan.</h5>\n              </div>';
          var cargaHtmlDos = '\n              <img src="dist/img/' + arr[1].ImgUrl + '" class="img-slider">\n              <!-- random image -->\n              <div class="caption left-align">\n                <h3>Left Aligned Caption</h3>\n                <h5 class="light grey-text text-lighten-3">Here\'s our small slogan.</h5>\n            </div>';
          var cargaHtmlTres = '\n              <img src="dist/img/' + arr[2].ImgUrl + '" class="img-slider">\n              <!-- random image -->\n              <div class="caption right-align">\n              <h3>Right Aligned Caption</h3>\n              <h5 class="light grey-text text-lighten-3">Here\'s our small slogan.</h5>\n                </div>';
          //   console.log(cargaHtml);
          $('#img_uno_index').html(cargaHtmlUno);
          $('#img_dos_index').html(cargaHtmlDos);
          $('#img_tres_index').html(cargaHtmlTres);
          break;
      }
    }
  });
}

// *Se cargan los combobox del mantenedor
function cargarComboUnidadMedida() {
  var action = 'CargarComboUnidadMedida';
  $('select').formSelect();
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despUnidadMedida.php',
    type: 'POST',
    success: function success(respuesta) {
      // *cargaHtml es para los combobox del formulario
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        cargaHtml += '<option value=\'' + item.IdUnidad + '\'>' + item.Nombre + '</option>';
      });
      $('select[name*="combo_unidad_medida"]').html(cargaHtml);
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *-----------------------------------------------------------------

function CargarTablaIngredientes() {
  var action = 'CargarMantenedorIngredientes';
  var cargaHtml = '';
  var arrayProductosPocoStock = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despIngredientes.php',
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
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function (indice, item) {
            // *Si el stock es inferior al minimo se ingresará el elemento al id
            if (item.StockTotal < item.MinimoStock) {
              arrayProductosPocoStock.push(item.Nombre);
            }
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.Nombre + '</td>';
            cargaHtml += '<td>' + item.Stock + '</td>';
            cargaHtml += '<td>' + item.Uso + '</td>';
            cargaHtml += '<td>' + item.Minimo + '</td>';
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarIngrediente(" + item.IdIngrediente + ")'><i class='material-icons'>edit</i></a></td>";
            cargaHtml += "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarIngrediente(" + item.IdIngrediente + ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayProductosPocoStock.length > 0) {
            var htmlPocoStock = '<div class="mensaje-precaucion-indice" id="mensaje_stock_ingredientes"><p><b>Atenci\xF3n!:</b> Existen ' + arrayProductosPocoStock.length + ' ingredientes (' + arrayProductosPocoStock.join(', ') + ') que poseen poco stock. Recuerda reabastecerlos.</p></div>';
            $('#mensaje_no_stock_ingredientes').html(htmlPocoStock);
          } else {
            $('#mensaje_stock_ingredientes').remove();
          }

          $('#body_tabla_ingredientes').html(cargaHtml);
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_ingrediente').on('keyup', function () {
  var caracterFiltro = $(this).val().toLowerCase();
  $('#body_tabla_ingredientes tr').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(caracterFiltro) > -1);
  });
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarIngrediente(id) {
  var action = 'EliminarIngrediente';
  swal({
    title: '¿Estás seguro?',
    text: 'Al ser eliminada este ingrediente ya no será utilizable ni comprobable.',
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
        url: '../app/control/despIngredientes.php',
        type: 'POST',
        success: function success(resp) {
          console.log(resp);
          switch (resp) {
            case '1':
              swal('Listo', 'El elemento fue eliminado', 'success');
              CargarTablaIngredientes();
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

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_ingrediente').on('click', function (evt) {
  evt.preventDefault();
  $('#modal_mantenedor_ingrediente').modal('close');
});

var validarFormActualizarAgregados = $('#form_mantenedor_ingrediente').validate({
  errorClass: 'invalid red-text',
  validClass: 'valid',
  errorElement: 'div',
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest('form').find('label[for=' + element.attr('id') + ']') //*Se insertará un label para representar el error
    .attr('data-error', error.text()); //*Se obtiene el texto de erro
    error.insertAfter(element); //*Se inserta el error después del elemento
  },
  rules: {
    txt_nombre_ingrediente: {
      required: true,
      minlength: 3,
      maxlength: 100
    },
    txt_cantidad_stock: {
      required: true,
      min: 0.1,
      max: 1000,
      number: true
    },
    combo_unidad_medida_stock: {
      required: true,
      min: 1,
      max: 200
    },
    txt_cantidad_uso_roll: {
      required: true,
      min: 0.1,
      max: 1000,
      number: true
    },
    txt_cantidad_minima: {
      required: true,
      min: 0.1,
      max: 10000,
      number: true
    }
  },
  messages: {
    txt_nombre_ingrediente: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_cantidad_stock: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 1000',
      number: 'Sólo números permitidos'
    },
    combo_unidad_medida_stock: {
      required: 'Campo requerido *',
      min: 'Selecciona una opción válida',
      max: 'Selecciona una opción válida'
    },
    txt_cantidad_uso_roll: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 1000',
      number: 'Sólo números permitidos'
    },
    txt_cantidad_minima: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 10000',
      number: 'Sólo números permitidos'
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
        // *La variable formData inicializa el formulario al cual se le pasan los datos usando append
        var formData = new FormData();

        formData.append('nombre', $('#txt_nombre_ingrediente').val());
        formData.append('stock', $('#txt_cantidad_stock').val());
        formData.append('unidadStock', $('#combo_unidad_ingrediente_stock').val());
        formData.append('uso', $('#txt_cantidad_uso_roll').val());
        formData.append('minima', $('#txt_cantidad_minima').val());

        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *Dependiendo de la acción se anexan más datos al formulario (formData)

        if ($('#lbl_id_ingrediente').text() == '') {
          var _action9 = 'IngresarIngrediente';
          formData.append('action', _action9);
        } else {
          var actionUpdate = 'ActualizarDatosIngrediente';
          formData.append('id', $('#lbl_id_ingrediente').text());
          formData.append('action', actionUpdate);
        }
        //*Se envían datos del form y action, al controlador mediante ajax
        console.log(formData);
        $.ajax({
          data: formData,
          url: '../app/control/despIngredientes.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function success(resp) {
            console.log(resp);
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                $('#modal_mantenedor_ingrediente').modal('close');
                swal('Listo', 'Los datos han sido ingresados', 'success');
                CargarTablaIngredientes();
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

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarIngrediente(id) {
  $('#modal_mantenedor_ingrediente').modal('open');
  $('#accion_ingredientes').text('Actualizar Ingrediente');
  var action = 'CargarModalIngrediente';
  var mensajeHtml = '<div class="mensaje-precaucion" id="mensaje_precaucion_ingredientes"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_ingrediente').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despIngredientes.php',
    type: 'POST',
    success: function success(respuesta) {
      var arr = JSON.parse(respuesta);
      $.each(arr, function (indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_ingrediente').text(item.Id);
        $("label[for='txt_nombre_ingrediente']").addClass('active');
        $('#txt_nombre_ingrediente').val(item.Nombre);
        $('label[for=\'txt_cantidad_stock\']').addClass('active');
        $('#txt_cantidad_stock').val(item.Stock);
        $('label[for=\'txt_cantidad_minima\']').addClass('active');
        $('#txt_cantidad_minima').val(item.Minima);
        $('label[for=\'txt_cantidad_uso_roll\']').addClass('active');
        $('#txt_cantidad_uso_roll').val(item.Uso);
        $('#combo_unidad_ingrediente_stock').val(item.StockUnidad);
      });
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

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

            cargaHtml += '<div class="col s12 m6 l4 xl3">';
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

  if ($('#txt_cantidad_tipo_coberturas_chef').val() < 10) {
    M.toast({
      html: 'Debes ingresar una cantidad válida (mínimo 10).',
      displayLength: 3000,
      classes: 'red'
    });
  } else if (total < 200) {
    if ($('#txt_cantidad_tipo_coberturas_chef').val() % 10 == 0) {
      var listaHtml = '<li id-tipo-cobertura-chef=\'' + $('#combo_tipo_coberturas_promo_form_chef').val() + '\' cantidad-tipo-cobertura-chef=\'' + $('#txt_cantidad_tipo_coberturas_chef').val() + '\'>' + $('#txt_cantidad_tipo_coberturas_chef').val() + ' - ' + $('#combo_tipo_coberturas_promo_form_chef option:selected').text() + ' <a id="eliminar_lista_tipo_cobertura_chef" href="#">Eliminar<a/></li>';

      $('#lista_tipo_coberturas_chef').append(listaHtml);
    } else {
      M.toast({
        html: 'Selecciona una cantidad que sea múltiplo de 10',
        displayLength: 3000,
        classes: 'red'
      });
    }
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
      digits: true,
      multiploDeDiez: true
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
      extension: 'jpeg|jpg|png'
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
          var _action10 = 'IngresarPromoCliente';
          formData.append('action', _action10);
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
      digits: 'Ingresa solo números',
      multiploDeDiez: true
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
          var _action11 = 'IngresarPromoChef';
          formData.append('action', _action11);
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
        console.log(agregados);
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
          }, 2000);
          break;
        case '2':
          location.href = 'index.php';
          break;
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

$.validator.addMethod('multiploDeDiez', function (value, element) {
  return this.optional(element) || value % 10 == 0;
}, 'Selecciona una cantidad que sea múltiplo de diez.');

// *Consulta ajax para consultar el estado y existencia del correo

$('#form_recuperar_pass').validate({
  //*configuración de jquery validaty para la validación de campos
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
      emailCom: true
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_email: {
      required: 'Campo requerido *',
      emailCom: 'Ingresa un correo válido'
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
    var timerInterval = void 0;
    swal({
      title: 'Espere',
      html: 'La petición se está procesando.',
      timer: 5000,
      onOpen: function onOpen() {
        swal.showLoading();
      },
      onClose: function onClose() {
        clearInterval(timerInterval);
      }
    }).then(function (result) {
      if (
      // Read more about handling dismissals
      result.dismiss === swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
    var action = 'ValidarCorreo';
    //*Se envían datos del form y action, al controlador mediante ajax
    $.ajax({
      data: $('#form_recuperar_pass').serialize() + '&action=' + action,
      url: '../app/control/despRecuperarPass.php',
      type: 'POST',
      success: function success(resp) {
        console.log(resp);
        //*Acción a ejecutar si la respuesta existe
        switch (resp) {
          case '1':
            swal('Listo', 'Se ha enviado un correo a la dirección ingresada.', 'success');
            break;
          case '2':
            swal('Error', 'El correo ingresado no existe.', 'error');
            break;
          case '3':
            swal('Error', 'El correo ingresado no posee los permisos para acceder al sistema.', 'error');
            break;
        }
      },
      error: function error() {
        alert('Lo sentimos ha ocurrido un error');
      }
    });
  }
});

function consultarEstadoToken() {
  var action = 'ConsultarEstadoToken';
  var token = $('#token').val();
  var idUsuario = $('#idUsuario').val();
  $.ajax({
    data: 'token=' + token + '&action=' + action,
    url: '../app/control/despRecuperarPass.php',
    type: 'POST',
    success: function success(resp) {
      if (!resp) {
        location.href = 'index.php';
      }
    },
    error: function error() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

$('#form_cambiar_password_rec').validate({
  //*configuración de jquery validaty para la validación de campos
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
    txt_nueva_password: {
      required: true,
      minlength: 7,
      maxlength: 100
    },
    txt_confirmar_nueva_password: {
      required: true,
      minlength: 7,
      maxlength: 100,
      equalTo: '#txt_nueva_password'
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_nueva_password: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 7 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_confirmar_nueva_password: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 7 caracteres',
      maxlength: 'Máximo 100 caracteres',
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
        var action = 'CambiarPasswordUsuario';
        var token = $('#token').val();
        var idTipoUsuario = $('#tipoUsuario').val();
        var nuevaPass = $('#txt_confirmar_nueva_password').val();

        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: {
            action: action,
            token: token,
            tipoUsuario: idTipoUsuario,
            nuevaPass: nuevaPass
          },
          url: '../app/control/despRecuperarPass.php',
          type: 'POST',
          success: function success(resp) {
            console.log(resp);
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                swal('Listo', 'Tu contraseña ha sido cambiada.', 'success');
                setTimeout(function () {
                  location.href = 'login.php';
                }, 2000);
                break;
              case '2':
                swal('Error', 'Lo sentimos la contraseña no se ha podido reestablecer.', 'error');
                setTimeout(function () {
                  location.href = 'index.php';
                }, 2000);
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
      minlength: 7,
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
      minlength: 'Mínimo 7 caracteres',
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

// *Se añadió el método para validar que el formato del correo posea .com
jQuery.validator.addMethod('emailCom', function (value, element) {
  return this.optional(element) || /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$/.test(value);
}, 'Ingresa un correo válido');

function cargarMantenedorRellenos(estado, caracter) {
  var action = 'CargarMantenedorRellenos';
  var cargaHtml = '';
  // *Los arrays almacenarán los datos de aquellas coberturas que no puedan ser seleccionados por el cliente
  var arrayIndiceNingunoRellenos = [];
  var arrayNoEnCartaRellenos = [];
  var arrayProductosPocoStock = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: 'action=' + action,
    url: '../app/control/despRellenos.php',
    type: 'POST',
    success: function success(respuesta) {
      // *----------------------------------------------------------------------
      // *Se filtra el array obtenido en base a los parámetros obtenidos
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenid|a
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
            // *Si el stock es inferior al minimo se ingresará el elemento al id
            if (item.StockTotal < item.MinimoStock) {
              arrayProductosPocoStock.push(item.Nombre);
            }
            // *Si el item tiene como indice el valor 2 este se ingresará en el array indicado
            if (item.idEstado == 2) {
              arrayNoEnCartaRellenos.push(item.Nombre);
            }

            cargaHtml += '<div class="col s12 m6 l4 xl3">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml += '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += '<img class="activator" src="uploads/' + item.ImgUrl + '">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += '<span class="card-title activator grey-text text-darken-4">' + item.Nombre + '<i class="material-icons right">more_vert</i></span>';
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += '<span class="grey-text text-darken-4">Precio: $' + item.Precio + '</span>';
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
          if (arrayProductosPocoStock.length > 0) {
            var htmlPocoStock = '<div class="mensaje-precaucion-indice" id="mensaje_stock_rellenos"><p><b>Atenci\xF3n!:</b> Existen ' + arrayProductosPocoStock.length + ' rellenos (' + arrayProductosPocoStock.join(', ') + ') que poseen poco stock. Recuerda que estos no podr\xE1n ser elegidos por el cliente.</p></div>';
            $('#mensaje_poco_stock_rellenos').html(htmlPocoStock);
          } else {
            $('#mensaje_stock_rellenos').remove();
          }

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
        // *------------------------------
        $('label[for=\'txt_cantidad_stock_relleno\']').addClass('active');
        $('#txt_cantidad_stock_relleno').val(item.Stock);
        $('label[for=\'txt_cantidad_minima_relleno\']').addClass('active');
        $('#txt_cantidad_minima_relleno').val(item.Minima);
        $('label[for=\'txt_cantidad_uso_roll_relleno\']').addClass('active');
        $('#txt_cantidad_uso_roll_relleno').val(item.Uso);
        $('#combo_unidad_relleno_stock').val(item.StockUnidad);
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
    },
    imagen_rellenos: {
      extension: 'jpeg|jpg|png'
    },
    txt_cantidad_stock_relleno: {
      required: true,
      min: 0.1,
      max: 1000,
      number: true
    },
    combo_unidad_medida_stock: {
      required: true,
      min: 1,
      max: 200
    },
    txt_cantidad_uso_roll_relleno: {
      required: true,
      min: 0.1,
      max: 1000,
      number: true
    },
    txt_cantidad_minima_relleno: {
      required: true,
      min: 0.1,
      max: 10000,
      number: true
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
    },
    txt_cantidad_stock_relleno: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 1000',
      number: 'Sólo números permitidos'
    },
    combo_unidad_medida_stock: {
      required: 'Campo requerido *',
      min: 'Selecciona una opción válida',
      max: 'Selecciona una opción válida'
    },
    txt_cantidad_uso_roll_relleno: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 1000',
      number: 'Sólo números permitidos'
    },
    txt_cantidad_minima_relleno: {
      required: 'Campo requerido *',
      min: 'La cantidad mínima es 0.1',
      max: 'La cantidad mínima es 10000',
      number: 'Sólo números permitidos'
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
        formData.append('stock', $('#txt_cantidad_stock_relleno').val());
        formData.append('unidadStock', $('#combo_unidad_relleno_stock').val());
        formData.append('uso', $('#txt_cantidad_uso_roll_relleno').val());
        formData.append('minima', $('#txt_cantidad_minima_relleno').val());
        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'relleno'
        // *Dependiendo de la acción se anexan más datos al formulario (formData)
        if ($('#lbl_id_rellenos').text() == '') {
          var _action12 = 'IngresarRelleno';
          formData.append('action', _action12);
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
            console.log(resp);
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
          cargaHtml += '<p>Opciones disponibles: ' + respuesta;
          cargaHtml += '<a class="btn-indice btn-floating btn-medium waves-effect waves-light blue tooltipped" data-position="bottom" data-tooltip="A\xF1adir \xEDndice de elecci\xF3n" onclick="sumarIndiceRelleno()"><i class="fa fa-plus"></i></a>';
          cargaHtml += '<a class="btn-indice btn-floating btn-medium waves-effect waves-light red tooltipped" data-position="bottom" data-tooltip="Eliminar \xEDndice de elecci\xF3n" onclick="restarIndiceRelleno()"><i class="fa fa-minus"></i></a>';
          cargaHtml += '</p>';
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
                  swal('Listo', 'Se ha restado un \xEDndice, ' + respuestaDatosVinculados + ' rellenos han quedado sin \xEDndice de selecci\xF3n, por lo tanto no podr\xE1n ser seleccionadas por el cliente.', 'success');
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
              swal('Listo', 'Se ha sumado un índice de elección', 'success');
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
          var _action13 = 'IngresarTipoPago';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            action: _action13
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
          var _action14 = 'IngresarTipoPromo';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            action: _action14
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