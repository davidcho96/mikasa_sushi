function cargarMantenedorCoberturas(estado, caracter) {
  var action = 'CargarMantenedorCoberturas';
  var cargaHtml = '';
  // *Los arrays almacenarán los datos de aquellas coberturas que no puedan ser seleccionados por el cliente
  var arrayIndiceNinguno = [];
  var arrayNoEnCarta = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function(respuesta) {
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
            cargaHtml +=
              '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += `<img class="activator" src="uploads/${item.ImgUrl}">`;
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += `<span class="card-title activator grey-text text-darken-4">${
              item.Nombre
            }<i class="material-icons right">more_vert</i></span>`;
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += `<span class="grey-text text-darken-4">Precio Adicional: $${
              item.Precio
            }</span>`;
            // *Si el indice es igual a 'Ninguno' el texto se marca en rojo
            if (item.Indice != 'Ninguno') {
              cargaHtml += `<span class="grey-text text-darken-4" indice-cobertura="${
                item.Indice
              }">Opción de elección: ${item.Indice}</span>`;
            } else {
              cargaHtml += `<span class="red-text" indice-cobertura="${
                item.Indice
              }">Opción de elección: ${item.Indice}</span>`;
            }
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light blue" name="indice_cobertura" onclick="actualizarCoberturaM(${
              item.IdCobertura
            })"><i class="material-icons">edit</i></a>`;
            cargaHtml += `<h5 class="grey-text text-darken-4">${
              item.Estado
            }</h5>`;
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light red" name="indice_cobertura" onclick="eliminarCoberturaM(${
              item.IdCobertura
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
          if (arrayIndiceNinguno.length > 0) {
            var htmlNoIndice = `<div class="mensaje-precaucion-indice" id="mensaje_indice_coberturas"><p><b>Atención!:</b> Existen ${
              arrayIndiceNinguno.length
            } coberturas (${arrayIndiceNinguno.join(
              ', '
            )}) que no poseen un índice de selección. Recuerda que estos no podrán ser elegidos por el cliente.</p></div>`;
            $('#mensaje_no_indice_cobertura').html(htmlNoIndice);
          } else {
            $('#mensaje_indice_coberturas').remove();
          }
          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayNoEnCarta.length > 0) {
            var htmlNoEnCarta = `<div class="mensaje-precaucion-indice" id="mensaje_indice_no_carta_coberturas"><p><b>Atención!:</b> Existen ${
              arrayNoEnCarta.length
            } coberturas (${arrayNoEnCarta.join(
              ', '
            )}) que no están en carta. Recuerda que estos no podrán ser elegidos por el cliente.</p></div>`;
            $('#mensaje_no_carta_cobertura').html(htmlNoEnCarta);
          } else {
            $('#mensaje_indice_no_carta_coberturas').remove();
          }

          // *Se cargan los datos de la bd en la pantalla
          $('#coberturas_carga').html(cargaHtml);

          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

$('#combo_estado_coberturas_filtro').change(function(item) {
  cargarMantenedorCoberturas(
    $(this)
      .find('option:selected')
      .text(),
    $('#txt_buscar_coberturas').val()
  );
  /* 
    //*Al cambiar el valor del combobox de filtro se ejecuta la función de cargar mantenedor y se pasan los dos parámetros
    //*que la función solicita. El primer parámetro es el valor seleccionado del combobox, y el segundo es el valor de la caja de búsqueda
    //*De esta manera se cargan los datos que coincidan con estos dos parámetros
    */
});

$('#txt_buscar_coberturas').keyup(function(item) {
  cargarMantenedorCoberturas(
    $('#combo_estado_coberturas_filtro')
      .find('option:selected')
      .text(),
    $(this).val()
  );
  // *La función de carga de los datos se ejecuta al presionar la tecla y pasa como parámetros el valor ingresado en la caja de texto
  // *y además el valor seleccionado del combobox
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarCoberturaM(id) {
  var action = 'EliminarCobertura';
  var actionGetDatos = 'ComprobarVinculacionCoberturas';
  $.ajax({
    data: `action=${actionGetDatos}&id=${id}`,
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function(respuestaDatosVinculados) {
      switch (respuestaDatosVinculados) {
        case '1':
          swal({
            title: '¿Estás seguro?',
            text:
              'Al ser eliminada esta cobertura ya no podrá ser seleccionada para ser adquirida, ni vinculada a un tipo de cobertura.',
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
                url: '../app/control/despCoberturas.php',
                type: 'POST',
                success: function(resp) {
                  switch (resp) {
                    case '1':
                      swal('Listo', 'El producto fue eliminado', 'success');
                      cargarMantenedorCoberturas();
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
                        'El producto no puede ser eliminado ya que un tipo de cobertura lo contiene',
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
            `El producto no pudo ser eliminado ya que está vinculado a los tipos de cobertura '${respuestaDatosVinculados}'`,
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

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarCoberturaM(id) {
  $('#accion_coberturas').text('Actualizar Cobertura');
  $('#modal_mantenedor_cobertura').modal('open');
  var action = 'CargarModalCobertura';
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_coberturas"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_coberturas').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function(respuesta) {
      // alert(respuesta);
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_cobertura').text(item.IdCobertura);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Nombre);
        $(`label[for='txt_descripcion']`).addClass('active');
        $('#txt_descripcion').val(item.Descripcion);
        $(`label[for='txt_precio_cobertura']`).addClass('active');
        $('#txt_precio_cobertura').val(item.Precio);
        $('#combo_estado_cobertura').val(item.Estado);
        $('#imagen_coberturas_text').val(item.ImgUrl);
        $('#combo_indice_cobertura').val(item.Indice);
      });
    },
    error: function() {
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
    data: `action=${action}`,
    url: '../app/control/despIndiceCobertura.php',
    type: 'POST',
    success: function(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += `<option disabled selected>Índice</option>`;
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value='${item.IdIndiceCobertura}'>${
          item.Descripcion
        }</option>`;
      });
      $('#combo_indice_cobertura').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_cobertura').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_cobertura').modal('close');
});

var validarFormCoberturas = $('#form_mantenedor_cobertura').validate({
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
        // *imgExtension obtiene la extensión de la imagen
        var imgExtension = $('#imagen_coberturas')
          .val()
          .substr(
            $('#imagen_coberturas')
              .val()
              .lastIndexOf('.') + 1
          );

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
          let action = 'IngresarCobertura';
          formData.append('action', action);
          if ($('#imagen_coberturas').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
          } else {
            formData.append('imagenUrl', '');
          }
        } else {
          let actionUpdate = 'ActualizarDatosCobertura';
          formData.append('id', $('#lbl_id_cobertura').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if (
            $('#imagen_coberturas').val() != '' ||
            imgExtension == 'jpg' ||
            imgExtension == 'png' ||
            imgExtension == 'jpeg'
          ) {
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
          success: function(resp) {
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
          error: function() {
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
    data: `action=${action}`,
    url: '../app/control/despIndiceCobertura.php',
    type: 'POST',
    success: function(respuesta) {
      switch (respuesta) {
        case 'error':
          alert(
            'Lo sentimos ha ocurrido un error al cargar la cantidad de indices de cobertura'
          );
          break;
        default:
          cargaHtml += `<p>${respuesta}</p>`;
          cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="sumarIndiceCobertura()"><i class="fa fa-plus"></i></a>`;
          cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light red" onclick="restarIndiceCobertura(${respuesta})"><i class="fa fa-minus"></i></a>`;
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
    data: `action=${action}`,
    url: '../app/control/despIndiceCobertura.php',
    type: 'POST',
    success: function(respuesta) {},
    error: function() {
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
    data: `action=${actionGetDatos}`,
    url: '../app/control/despIndiceCobertura.php',
    type: 'POST',
    success: function(respuestaDatosVinculados) {
      var action = 'RestarIndiceCoberturas';
      //*Se envían datos del form y action, al controlador mediante ajax
      swal({
        title: '¿Estás seguro?',
        text: `Existen ${respuestaDatosVinculados} coberturas vinculadas a este índice, al elimnarlo estos no podrán ser seleccionados por el cliente.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.value) {
          $.ajax({
            data: `action=${action}`,
            url: '../app/control/despIndiceCobertura.php',
            type: 'POST',
            success: function(respuesta) {
              switch (respuesta) {
                case '1':
                  cargarTotalIndiceCoberturas();
                  cargarMantenedorCoberturas();
                  cargarIndiceCobertura();
                  swal(
                    'Listo',
                    `Se ha restado un índice, ${respuestaDatosVinculados} coberturas han quedado sin índice de selección, por lo tanto no podràn ser seleccionadas por el cliente.`,
                    'success'
                  );
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
  }).then(result => {
    if (result.value) {
      $.ajax({
        data: `action=${action}`,
        url: '../app/control/despIndiceCobertura.php',
        type: 'POST',
        success: function(respuesta) {
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
