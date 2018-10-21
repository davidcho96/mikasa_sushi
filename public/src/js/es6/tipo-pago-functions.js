function CargarTablaTipoPago() {
  var action = 'CargarMantenedorTipoPago';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despTipoPago.php',
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
          //   alert(respuesta);
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function(indice, item) {
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.Descripcion + '</td>';
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarTipoPago(" +
              item.IdTipoPago +
              ")'><i class='material-icons'>edit</i></a></td>";
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarTipoPago(" +
              item.IdTipoPago +
              ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_tipo_pago').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_tipo_pago').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#tabla_tipo_pago tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarTipoPago(id) {
  var action = 'EliminarTipoPago';
  swal({
    title: '¿Estás seguro?',
    text:
      'Al ser eliminada este tipo de pago ya no podrá ser seleccionado para ser vinculado a una compra.',
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
        url: '../app/control/despTipoPago.php',
        type: 'POST',
        success: function(resp) {
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
        error: function() {
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
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_tipo_pago"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_tipo_pago').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despTipoPago.php',
    type: 'POST',
    success: function(respuesta) {
      $('#accion_tipo_pago').text('Actualizar Tipo Pago');
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_tipo_pago').text(item.IdTipoPago);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Descripcion);
      });
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_tipo_pago').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_tipo_pago').modal('close');
});

var validarFormActualizarTipoPago = $('#form_mantenedor_tipo_pago').validate({
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
        if ($('#lbl_id_tipo_pago').text() == '') {
          let action = 'IngresarTipoPago';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            action: action
          };
        } else {
          let actionUpdate = 'ActualizarTipoPago';
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
          success: function(resp) {
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
          error: function() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});
