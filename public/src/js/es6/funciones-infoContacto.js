function CargarTablaInfoContacto() {
  var action = 'CargarMantenedorInfoContacto';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despInfoContacto.php',
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
            cargaHtml += '<td>' + item.medioContacto + '</td>';
            cargaHtml += '<td>' + item.infoContacto + '</td>';
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarInfoContacto(" +
              item.idContacto +
              ")'><i class='material-icons'>edit</i></a></td>";
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarInfoContacto(" +
              item.idContacto +
              ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_info_contacto').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_info_contacto').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#body_tabla_info_contacto tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarInfoContacto(id) {
  var action = 'EliminarInfoContacto';
  swal({
    title: '¿Estás seguro?',
    text:
      'Al ser eliminada la información de contacto ya no podrá ser visulizada por los clientes.',
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
        url: '../app/control/despInfoContacto.php',
        type: 'POST',
        success: function(resp) {
          switch (resp) {
            case '1':
              swal(
                'Listo',
                'La información de contacto fue eliminada.',
                'success'
              );
              CargarTablaInfoContacto();
              break;
            case '2':
              swal('Error', 'La información no pudo ser eliminada.', 'error');
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

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarInfoContacto(id) {
  $('#accion_info_contacto').text('Actualizar Información de Contacto');
  $('#modal_mantenedor_info_contacto').modal('open');
  var action = 'CargarModalActualizarInfoContacto';
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_info_contacto"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_info_contacto').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despInfoContacto.php',
    type: 'POST',
    success: function(respuesta) {
      $('#accion_info_contacto').text('Actualizar Información de Contacto');
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_info_contacto').text(item.idContacto);
        $("label[for='txt_medio_info_contacto']").addClass('active');
        $('#txt_medio_info_contacto').val(item.medioContacto);
        $("label[for='txt_info_contacto']").addClass('active');
        $('#txt_info_contacto').val(item.infoContacto);
      });
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_info_contacto').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_info_contacto').modal('close');
});

$('#form_mantenedor_info_contacto').validate({
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
    txt_medio_info_contacto: {
      required: true,
      minlength: 3,
      maxlength: 200,
      lettersonly: true
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
      maxlength: 'Máximo 200 caracteres',
      lettersonly: 'Ingresa solo letras'
    },
    txt_info_contacto: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
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
        // var action = 'ActualizarDatosAgregados';
        var dataInfo = '';
        // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
        // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
        // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
        if ($('#lbl_id_info_contacto').text() == '') {
          let action = 'IngresarInfoContacto';
          dataInfo = {
            medio: $('#txt_medio_info_contacto').val(),
            info: $('#txt_info_contacto').val(),
            action: action
          };
        } else {
          let actionUpdate = 'ActualizarInfoContacto';
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
          success: function(resp) {
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
          error: function() {
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
    data: `action=${action}`,
    url: '../app/control/despInfoEmpresa.php',
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
          $.each(arr, function(indice, item) {
            if (
              item.horaActual > item.horaApertura &&
              item.horaActual < item.horaCierre
            ) {
              mensajeEstadoAperturaLocal =
                '<div class="light-green-text">Ahora abierto</div>';
              $('#content_estado_apertura_local').html(
                mensajeEstadoAperturaLocal
              );
            } else {
              mensajeEstadoAperturaLocal =
                '<div class="red-text">Ahora cerrado</div>';
              $('#content_estado_apertura_local').html(
                mensajeEstadoAperturaLocal
              );
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
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *----------------------------------------------------------

$('#restaurar_mantenedor_horas_actividad').on('click', function(evt) {
  evt.preventDefault();
  CargarDatosInfoEmpresa();
});

$('#restaurar_mantenedor_dias_actividad').on('click', function(evt) {
  evt.preventDefault();
  CargarDatosInfoEmpresa();
});

$('#form_horas_actividad_empresa').validate({
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
    txt_hora_inicio: {
      required: true,
      time24: true
    },
    txt_hora_final: {
      required: true,
      time24: true
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
      text:
        'El cambio de horas de actividad podría alterar la generación de transacciones',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        var dataInfo = '';

        let action = 'ActualizarHorasActividadEmpresa';
        dataInfo = {
          horaInicio: $('#txt_hora_inicio').val(),
          horaCierre: $('#txt_hora_final').val(),
          action: action
        };

        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: dataInfo,
          url: '../app/control/despInfoEmpresa.php',
          type: 'POST',
          success: function(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                swal(
                  'Listo',
                  'Las horas activas han sido actualizadas',
                  'success'
                );
                CargarTablaInfoContacto();
                CargarDatosInfoEmpresa();
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

$('#form_dias_actividad_empresa').validate({
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
    combo_dia_inicio: {
      required: true,
      min: 1,
      max: 7
    },
    combo_dia_final: {
      required: true,
      min: 1,
      max: 7
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
      text:
        'El cambio de dias de actividad podría alterar la generación de transacciones',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        var dataInfo = '';

        let action = 'ActualizarDiasActividadEmpresa';
        dataInfo = {
          diaInicio: $('#combo_dia_inicio').val(),
          diaCierre: $('#combo_dia_final').val(),
          action: action
        };

        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: dataInfo,
          url: '../app/control/despInfoEmpresa.php',
          type: 'POST',
          success: function(resp) {
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                swal(
                  'Listo',
                  'Los dias activas han sido actualizados',
                  'success'
                );
                CargarTablaInfoContacto();
                CargarDatosInfoEmpresa();
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

$.validator.addMethod(
  'time24',
  function(value, element, param) {
    return value == '' || value.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/);
  },
  'Enter a valid time: hh:mm'
);
