$('#form_mantenedor_feriados').validate({
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
          success: function(resp) {
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
          error: function() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});

// *Cerrar el modal al presionar cancelar
$('#cancelar_mantenedor_feriados').click(function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_feriados').modal('close');
});

// *Cargar tabla de datos feriados
function cargarMantenedorFeriados(estado, caracter) {
  var action = 'CargarMantenedorFeriados';
  var cargaHtml = '';
  var arrayMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despFeriados.php',
    type: 'POST',
    success: function(respuesta) {
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          var arr = JSON.parse(respuesta);
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function(indice, item) {
            cargaHtml += '<tr>';
            cargaHtml += `<td>${item.Dia} de ${
              arrayMeses[parseInt(item.Mes) - 1]
            }</td>`;
            cargaHtml += `<td>${item.Descripcion}</td>`;
            cargaHtml += `<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='obtenerDatosActualizarFeriado(${
              item.IdFeriado
            })'><i class='material-icons'>edit</i></a></td>`;
            cargaHtml += `<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarFeriado(${
              item.IdFeriado
            })'><i class='material-icons'>delete</i></a></td>`;
            cargaHtml += '</tr>';
          });
          $('#body_tabla_feriados').html(cargaHtml);
          break;
      }
    },
    error: function() {
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
  }).then(result => {
    if (result.value) {
      var action = 'EliminarFeriado';
      $.ajax({
        data: { action: action, id: IdFeriado },
        url: '../app/control/despFeriados.php',
        type: 'POST',
        success: function(resp) {
          switch (resp) {
            case '1':
              swal(
                'Listo',
                'El feriado se ha eliminado exitosamente',
                'success'
              );
              cargarMantenedorFeriados();
              break;
            case '2':
              swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
              cargarMantenedorFeriados();
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
    success: function(respuesta) {
      $('#accion_info_feriado').text('Actualizar Información de Feriado');
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_feriado').text(item.IdFeriado);
        $("label[for='txt_descripcion_feriado']").addClass('active');
        $('#txt_descripcion_feriado').val(item.Descripcion);
        $('#combo_dia_feriado').val(item.Dia);
        $('#combo_mes_feriado').val(item.Mes);
      });
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}
