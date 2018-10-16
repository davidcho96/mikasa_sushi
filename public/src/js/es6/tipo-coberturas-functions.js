function CargarTablaTipoCobertura() {
  var action = 'CargarMantenedorTablaTipoCoberturas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despTipoCoberturas.php',
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
            cargaHtml += '<td>' + item.Nombre + '</td>';
            cargaHtml += '<td>' + item.Coberturas + '</td>';
            cargaHtml += `<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarTipoCobertura("${
              item.Nombre
            }", "${
              item.IdTipoCobertura
            }");'><i class='material-icons'>edit</i></a></td>`;
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarTipoCobertura(" +
              item.IdTipoCobertura +
              ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          $('#body_tabla_tipo_cobertura').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function cargarCheckboxCoberturas(estado, caracter) {
  var action = 'CargarChecboxCoberturas';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despCoberturas.php',
    type: 'POST',
    success: function(respuesta) {
      var arr = JSON.parse(respuesta);
      // *-----------------------------------------------------------------------
      //*Acción a ejecutar si la respuesta existe
      switch (respuesta) {
        case 'error':
          alert('Lo sentimos ha ocurrido un error');
          break;
        default:
          //* Por defecto los datos serán cargados en pantalla
          $.each(arr, function(indice, item) {
            cargaHtml += '<p>';
            cargaHtml += '<label>';
            cargaHtml += `<input type="checkbox" name="coberturas_check[]" value="${
              item.IdCobertura
            }">`;
            cargaHtml += `<span>${item.Nombre}</span>`;
            cargaHtml += '</label>';
            cargaHtml += '</p>';
          });

          $('#carga_chekbox_cobertura').html(cargaHtml);
          break;
      }
    },
    error: function() {
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
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despDetalleTipoCobertura.php',
    type: 'POST',
    success: function(respuesta) {
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        $(`input[name="coberturas_check[]"][value="${item.IdCobertura}"]`).prop(
          'checked',
          true
        );
      });
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}

$('#form_mantenedor_tipo_coberturas').validate({
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
    }
    // 'coberturas_check[]': {
    //   required: true
    // }
    // !Falta validar los checkbox
  },
  messages: {
    txt_nombre: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 3 caracteres',
      maxlength: 'Máximo 100 caracteres'
    }
    // 'coberturas_check[]': {
    //   required: 'Selecciona una opción'
    // }
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
        var action = '';
        var coberturas = [];
        var dataInfo = '';
        var nombre = $('#txt_nombre').val();

        $('input[name="coberturas_check[]"]').each(function() {
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
          success: function(resp) {
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
          error: function() {
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
        url: '../app/control/despTipoCoberturas.php',
        type: 'POST',
        success: function(resp) {
          console.log(resp);
          switch (resp) {
            case '1':
              swal('Listo', 'El producto fue eliminado', 'success');
              CargarTablaTipoCobertura();
              break;
            // case '2':
            //   swal('Error', 'El producto no pudo ser eliminado', 'error');
            //   break;
            case '3':
              swal(
                'Error',
                'El producto no puede ser eliminado ya que una promo la contiene',
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
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_tipo_cobertura').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#body_tabla_tipo_cobertura tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_coberturas').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_tipo_cobertura').modal('close');
});
