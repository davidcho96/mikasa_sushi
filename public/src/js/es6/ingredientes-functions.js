// *Se cargan los combobox del mantenedor
function cargarComboUnidadMedida() {
  var action = 'CargarComboUnidadMedida';
  $('select').formSelect();
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despUnidadMedida.php',
    type: 'POST',
    success: function(respuesta) {
      // *cargaHtml es para los combobox del formulario
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value='${item.IdUnidad}'>${item.Nombre}</option>`;
      });
      $('select[name*="combo_unidad_medida"]').html(cargaHtml);
    },
    error: function() {
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
    data: `action=${action}`,
    url: '../app/control/despIngredientes.php',
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
            // *Si el stock es inferior al minimo se ingresará el elemento al id
            if (item.StockTotal < item.MinimoStock) {
              arrayProductosPocoStock.push(item.Nombre);
            }
            cargaHtml += '<tr>';
            cargaHtml += '<td>' + item.Nombre + '</td>';
            cargaHtml += '<td>' + item.Stock + '</td>';
            cargaHtml += '<td>' + item.Uso + '</td>';
            cargaHtml += '<td>' + item.Minimo + '</td>';
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='actualizarIngrediente(" +
              item.IdIngrediente +
              ")'><i class='material-icons'>edit</i></a></td>";
            cargaHtml +=
              "<td><a class='btn-floating btn-medium waves-effect waves-light red' onclick='eliminarIngrediente(" +
              item.IdIngrediente +
              ")'><i class='material-icons'>delete</i></a></td>";
            cargaHtml += '</tr>';
          });

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayProductosPocoStock.length > 0) {
            var htmlPocoStock = `<div class="mensaje-precaucion-indice" id="mensaje_stock_ingredientes"><p><b>Atención!:</b> Existen ${
              arrayProductosPocoStock.length
            } ingredientes (${arrayProductosPocoStock.join(
              ', '
            )}) que poseen poco stock. Recuerda reabastecerlos.</p></div>`;
            $('#mensaje_no_stock_ingredientes').html(htmlPocoStock);
          } else {
            $('#mensaje_stock_ingredientes').remove();
          }

          $('#body_tabla_ingredientes').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Función para filtrar los datos en la tabla
$('#txt_buscar_ingrediente').on('keyup', function() {
  var caracterFiltro = $(this)
    .val()
    .toLowerCase();
  $('#body_tabla_ingredientes tr').filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(caracterFiltro) > -1
    );
  });
});

// *La función recibe el id del elemento y ejecuta la query en BD
function eliminarIngrediente(id) {
  var action = 'EliminarIngrediente';
  swal({
    title: '¿Estás seguro?',
    text:
      'Al ser eliminada este ingrediente ya no será utilizable ni comprobable.',
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
        url: '../app/control/despIngredientes.php',
        type: 'POST',
        success: function(resp) {
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
        error: function() {
          alert('Lo sentimos ha habido un error inesperado');
        }
      });
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_ingrediente').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_ingrediente').modal('close');
});

var validarFormActualizarAgregados = $('#form_mantenedor_ingrediente').validate(
  {
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
          // *La variable formData inicializa el formulario al cual se le pasan los datos usando append
          var formData = new FormData();

          formData.append('nombre', $('#txt_nombre_ingrediente').val());
          formData.append('stock', $('#txt_cantidad_stock').val());
          formData.append(
            'unidadStock',
            $('#combo_unidad_ingrediente_stock').val()
          );
          formData.append('uso', $('#txt_cantidad_uso_roll').val());
          formData.append('minima', $('#txt_cantidad_minima').val());

          // *Si el label id oculto contiene un valor significa que se actualizará el registro con ese valor
          // *Si no contiene valor se interpreta que se ingresará un nuevo 'agregado'
          // *Dependiendo de la acción se anexan más datos al formulario (formData)

          if ($('#lbl_id_ingrediente').text() == '') {
            let action = 'IngresarIngrediente';
            formData.append('action', action);
          } else {
            let actionUpdate = 'ActualizarDatosIngrediente';
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
            success: function(resp) {
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
            error: function() {
              alert('Lo sentimos ha ocurrido un error');
            }
          });
        }
      });
    }
  }
);

// *Al presionar el botón de editar del producto se cargarán los datos en los campos permitiendo editar los valores actuales
function actualizarIngrediente(id) {
  $('#modal_mantenedor_ingrediente').modal('open');
  $('#accion_ingredientes').text('Actualizar Ingrediente');
  var action = 'CargarModalIngrediente';
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_ingredientes"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_ingrediente').html(mensajeHtml);
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: {
      id: id,
      action: action
    },
    url: '../app/control/despIngredientes.php',
    type: 'POST',
    success: function(respuesta) {
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_ingrediente').text(item.Id);
        $("label[for='txt_nombre_ingrediente']").addClass('active');
        $('#txt_nombre_ingrediente').val(item.Nombre);
        $(`label[for='txt_cantidad_stock']`).addClass('active');
        $('#txt_cantidad_stock').val(item.Stock);
        $(`label[for='txt_cantidad_minima']`).addClass('active');
        $('#txt_cantidad_minima').val(item.Minima);
        $(`label[for='txt_cantidad_uso_roll']`).addClass('active');
        $('#txt_cantidad_uso_roll').val(item.Uso);
        $('#combo_unidad_ingrediente_stock').val(item.StockUnidad);
      });
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un problema');
    }
  });
}
