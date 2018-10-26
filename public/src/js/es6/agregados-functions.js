function cargarMantenedorAgregados(estado, caracter) {
  var action = 'CargarMantenedorAgregados';
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
      // *Se filtra el array obtenido en base a los parámetros obtenidos
      var arrFilter = '';
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenida
      if (estado == null || estado == 'Todos') {
        arrFilter = JSON.parse(respuesta);
      } else {
        arrFilter = arr.filter(function(n) {
          return (
            n.Estado == estado && n.Nombre.toLowerCase().indexOf(caracter) > -1
          );
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
          $.each(arrFilter, function(indice, item) {
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
            } ${
              item.Unidades
            }u<i class="material-icons right">more_vert</i></span>`;
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += `<span class="grey-text text-darken-4">Precio normal: $${
              item.Precio
            }</span>`;
            cargaHtml += `<span class="grey-text text-darken-4">Precio descuento: $${item.Precio -
              (item.Precio / 100) * item.Descuento}</span>`;
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarAgregadoM(${
              item.IdAgregado
            })"><i class="material-icons">edit</i></a>`;
            cargaHtml += `<h5 class="grey-text text-darken-4">${
              item.Estado
            }</h5>`;
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light red" onclick="eliminarAgregadoM(${
              item.IdAgregado
            })"><i class="material-icons">delete</i></a>`;
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

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayNoEnCarta.length > 0) {
            var htmlNoEnCarta = `<div class="mensaje-precaucion-indice" id="mensaje_indice_no_carta_agregados"><p><b>Atención!:</b> Existen ${
              arrayNoEnCarta.length
            } agregados (${arrayNoEnCarta.join(
              ', '
            )}) que no están en carta. Recuerda que estos no podrán ser adquiridos por el cliente.</p></div>`;
            $('#mensaje_no_carta_agregados').html(htmlNoEnCarta);
          } else {
            $('#mensaje_indice_no_carta_agregados').remove();
          }

          $('#agregados_carga').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarAgregadoM(id) {
  var action = 'EliminarAgregado';
  var actionGetDatos = 'ComprobarVinculacionAgregados';
  $.ajax({
    data: `action=${actionGetDatos}&id=${id}`,
    url: '../app/control/despAgregados.php',
    type: 'POST',
    success: function(respuestaDatosVinculados) {
      switch (respuestaDatosVinculados) {
        case '1':
          swal({
            title: '¿Estás seguro?',
            text:
              'Al ser eliminada esta cobertura ya no podrá ser seleccionada para ser adquirida, ni vinculada a una promo.',
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
                url: '../app/control/despAgregados.php',
                type: 'POST',
                success: function(resp) {
                  switch (resp) {
                    case '1':
                      swal('Listo', 'El producto fue eliminado', 'success');
                      cargarMantenedorAgregados();
                      break;
                    case '2':
                      swal(
                        'Error',
                        'El producto no pudo ser eliminado',
                        'error'
                      );
                      break;
                    case '3':
                      swal(
                        'Error',
                        'El producto no puede ser eliminado ya que una promo lo contiene',
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
          break;
        default:
          swal(
            'Error',
            `El producto no pudo ser eliminado ya que está vinculado a las promos '${respuestaDatosVinculados}'`,
            'error'
          );
          break;
      }
    },
    error: function() {
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
    data: `action=${action}`,
    url: '../app/control/despEstadoElementos.php',
    type: 'POST',
    success: function(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += `<option disabled selected>Estado</option>`;
      cargaHtmlFiltro += `<option selected>Todos</option>`;
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value='${item.Id}'>${item.Descripcion}</option>`;
        cargaHtmlFiltro += `<option value='${item.Id}'>${
          item.Descripcion
        }</option>`;
      });
      $('select[name="combo_estado_elemento"]').html(cargaHtml);
      $('select[name="combo_estado_elemento_filtro"]').html(cargaHtmlFiltro);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarAgregadoM(id) {
  $('#modal_mantenedor_agregado').modal('open');
  $('#accion_agregados').text('Actualizar Agregado');
  var action = 'CargarModalAgregado';
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_agregados"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_agregados').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despAgregados.php',
    type: 'POST',
    success: function(respuesta) {
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id').text(item.Id);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Nombre);
        $(`label[for='txt_descripcion']`).addClass('active');
        $('#txt_descripcion').val(item.Descripcion);
        $(`label[for='txt_unidades']`).addClass('active');
        $('#txt_unidades').val(item.Unidades);
        $(`label[for='txt_precio_agregado']`).addClass('active');
        $('#txt_precio_agregado').val(item.Precio);
        $(`label[for='txt_descuento_agregado']`).addClass('active');
        $('#txt_descuento_agregado').val(item.Descuento);
        $('#precio_descuento_agregado').text(`$
          ${item.Precio - (item.Precio / 100) * item.Descuento}`);
        $('#imagen_agregados_text').val(item.ImgUrl);
        $('#combo_estado_elemento_form').val(item.Estado);
      });
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_agregado').keyup(function() {
  var precioFinalDescuento =
    $('#txt_precio_agregado').val() -
    ($('#txt_precio_agregado').val() / 100) *
      $('#txt_descuento_agregado').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_agregado').text('0');
  } else {
    $('#precio_descuento_agregado').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_descuento_agregado').change(function() {
  var precioFinalDescuento =
    $('#txt_precio_agregado').val() -
    ($('#txt_precio_agregado').val() / 100) *
      $('#txt_descuento_agregado').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_agregado').text('0');
  } else {
    $('#precio_descuento_agregado').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_agregado').keyup(function() {
  var precioFinalDescuento =
    $('#txt_precio_agregado').val() -
    ($('#txt_precio_agregado').val() / 100) *
      $('#txt_descuento_agregado').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_agregado').text('0');
  } else {
    $('#precio_descuento_agregado').text('$ ' + precioFinalDescuento);
  }
});

// *Permitirá dar a conocer en tiempo real el valor final del producto al ingresar un valor de descuento
$('#txt_precio_agregado').change(function() {
  var precioFinalDescuento =
    $('#txt_precio_agregado').val() -
    ($('#txt_precio_agregado').val() / 100) *
      $('#txt_descuento_agregado').val();
  if (precioFinalDescuento == 'NaN') {
    $('#precio_descuento_agregado').text('0');
  } else {
    $('#precio_descuento_agregado').text('$ ' + precioFinalDescuento);
  }
});

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_actualizar_agregados').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_agregado').modal('close');
});

var validarFormActualizarAgregados = $('#form_mantenedor_agregado').validate({
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
  invalidHandler: function(form) {
    //*Acción a ejecutar al no completar todos los campos requeridos
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: 'red'
    });
  },
  submitHandler: function(form) {
    // *Sweet alert para mostrar mensaje de confirmación de acción
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
        // *imgExtension obtiene la extensión de la imagen
        var imgExtension = $('#imagen_agregados')
          .val()
          .substr(
            $('#imagen_agregados')
              .val()
              .lastIndexOf('.') + 1
          );
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
          let action = 'IngresarAgregados';
          formData.append('action', action);
          if ($('#imagen_agregados').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
            console.log('imagen');
          } else {
            formData.append('imagenUrl', '');
            console.log('no imagen');
          }
        } else {
          let actionUpdate = 'ActualizarDatosAgregados';
          formData.append('id', $('#lbl_id').text());
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
        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: formData,
          url: '../app/control/despAgregados.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function(resp) {
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
          error: function() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});

$('#combo_estado_agregados_filtro').change(function(item) {
  cargarMantenedorAgregados(
    $(this)
      .find('option:selected')
      .text(),
    $('#txt_buscar_agregados').val()
  );
  /* 
  //*Al cambiar el valor del combobox de filtro se ejecuta la función de cargar mantenedor y se pasan los dos parámetros
  //*que la función solicita. El primer parámetro es el valor seleccionado del combobox, y el segundo es el valor de la caja de búsqueda
  //*De esta manera se cargan los datos que coincidan con estos dos parámetros
  */
});

$('#combo_estado_agregados_filtro').keyup(function(item) {
  cargarMantenedorAgregados(
    $('#combo_estado_agregados_filtro')
      .find('option:selected')
      .text(),
    $(this).val()
  );
  // *La función de carga de los datos se ejecuta al presionar la tecla y pasa como parámetros el valor ingresado en la caja de texto
  // *y además el valor seleccionado del combobox
});

//! Añadir función para validar extensión de imagen
