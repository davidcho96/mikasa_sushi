function CargarTablaTipoPromo() {
  var action = 'CargarMantenedorTipoPromo';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despTipoPromo.php',
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
              "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarTipoPromo(" +
              item.IdTipoPromo +
              ")'><i class='material-icons'>edit</i></a></td>";
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarTipoPromo(" +
              item.IdTipoPromo +
              ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_tipo_promo').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_tipo_promo').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#body_tabla_tipo_promo tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarTipoPromo(id) {
  var action = 'EliminarTipoPromo';
  var actionGetDatos = 'ComprobarVinculacionTipoPromo';
  $.ajax({
    data: `action=${actionGetDatos}&id=${id}`,
    url: '../app/control/despTipoPromo.php',
    type: 'POST',
    success: function(respuestaDatosVinculados) {
      switch (respuestaDatosVinculados) {
        case '1':
          swal({
            title: '¿Estás seguro?',
            text:
              'Al ser eliminada esta tipo promo ya no podrá ser seleccionado para ser vinculada a una promo.',
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
                url: '../app/control/despTipoPromo.php',
                type: 'POST',
                success: function(resp) {
                  console.log(resp);
                  switch (resp) {
                    case '1':
                      swal('Listo', 'El elemento fue eliminado', 'success');
                      CargarTablaTipoPromo();
                      break;
                    case '2':
                      swal(
                        'Error',
                        'El elemento no pudo ser eliminado',
                        'error'
                      );
                      break;
                    case '3':
                      swal(
                        'Error',
                        'El elemento no pudo ser eliminado ya que al menos una promo es de este tipo',
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

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarTipoPromo(id) {
  $('#accion_tipo_promo').text('Actualizar Tipo Promo');
  $('#modal_mantenedor_tipo_promo').modal('open');
  var action = 'CargarModalTipoPromo';
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_tipo_promo"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_tipo_promo').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despTipoPromo.php',
    type: 'POST',
    success: function(respuesta) {
      $('#accion_tipo_promo').text('Actualizar Tipo Promo');
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_tipo_promo').text(item.IdTipoPromo);
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
$('#cancelar_mantenedor_tipo_promo').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_tipo_promo').modal('close');
});

var validarFormActualizarTipoPago = $('#form_mantenedor_tipo_promo').validate({
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
        // *Si no contiene valor se interpreta que se ingresará una nueva 'promo'
        // *El valor de 'action' y 'dataInfo' se establecerá dependiendo de la acción a realizar (ingresar nuevo ó actualizar)
        if ($('#lbl_id_tipo_promo').text() == '') {
          let action = 'IngresarTipoPromo';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            action: action
          };
        } else {
          let actionUpdate = 'ActualizarTipoPromo';
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
          success: function(resp) {
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
          error: function() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});
