function cargarMantenedorRellenos(estado, caracter) {
  var action = 'CargarMantenedorRellenos';
  var cargaHtml = '';
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despRellenos.php',
    type: 'POST',
    success: function(respuesta) {
      // console.log(respuesta);
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
          $.each(arr, function(indice, item) {
            cargaHtml += '<div class="col s12 m4 l4">';
            cargaHtml += '<div class="card col s12 m12 l12">';
            cargaHtml +=
              '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml +=
              '<img class="activator" src="https://www.tusushiya.cl/wp-content/uploads/2018/06/wasabi_paste.jpg">';
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += `<span class="card-title activator grey-text text-darken-4">${
              item.Nombre
            }<i class="material-icons right">more_vert</i></span>`;
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += `<span class="grey-text text-darken-4">Precio Adicional: $${
              item.Precio
            }</span>`;
            if (item.Indice != null) {
              cargaHtml += `<span class="grey-text text-darken-4">Opción de elección: ${
                item.Indice
              }</span>`;
            } else {
              cargaHtml += `<span class="grey-text text-darken-4">Opción de elección: Ninguno</span>`;
            }
            cargaHtml += '</div>';
            cargaHtml += '<div class="divider"></div>';
            cargaHtml += '<div class="btn-mant-productos">';
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light blue" onclick="actualizarRellenoM(${
              item.IdRelleno
            })"><i class="material-icons">edit</i></a>`;
            cargaHtml += `<h5 class="grey-text text-darken-4">${
              item.Estado
            }</h5>`;
            cargaHtml += `<a class="btn-floating btn-medium waves-effect waves-light red" onclick="eliminarRellenoM(${
              item.IdRelleno
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

          $('#rellenosCarga').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

$('#comboBoxEstadoRellenosFiltro').change(function(item) {
  cargarMantenedorCoberturas(
    $(this)
      .find('option:selected')
      .text(),
    $('#txt_buscar_rellenos').val()
  );
  /* 
      //*Al cambiar el valor del combobox de filtro se ejecuta la función de cargar mantenedor y se pasan los dos parámetros
      //*que la función solicita. El primer parámetro es el valor seleccionado del combobox, y el segundo es el valor de la caja de búsqueda
      //*De esta manera se cargan los datos que coincidan con estos dos parámetros
      */
});

$('#txt_buscar_rellenos').keyup(function(item) {
  cargarMantenedorCoberturas(
    $('#comboBoxEstadoRellenosFiltro')
      .find('option:selected')
      .text(),
    $(this).val()
  );
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
  }).then(result => {
    if (result.value) {
      $.ajax({
        data: {
          action: action,
          id: id
        },
        url: '../app/control/despRellenos.php',
        type: 'POST',
        success: function(resp) {
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
        error: function() {
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
    success: function(respuesta) {
      //   alert(respuesta);
      var arr = JSON.parse(respuesta);
      $.each(arr, function(indice, item) {
        // *Los label adquieren la clase active para no quedar sobre el texto definido en val
        $('#lbl_id_rellenos').text(item.IdRelleno);
        $("label[for='txt_nombre']").addClass('active');
        $('#txt_nombre').val(item.Nombre);
        $(`label[for='txt_descripcion']`).addClass('active');
        $('#txt_descripcion').val(item.Descripcion);
        $(`label[for='txt_precioRelleno']`).addClass('active');
        $('#txt_precioRelleno').val(item.Precio);
        $('#comboBoxEstadoRelleno').val(item.Estado);
        $('#comboBoxIndiceRelleno').val(item.Indice);
      });
    },
    error: function() {
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
    data: `action=${action}`,
    url: '../app/control/despIndiceRelleno.php',
    type: 'POST',
    success: function(respuesta) {
      // *cargaHtml es para los combobox del formulario
      // *cargaHtmlFiltro es para el combobox de filtro del mantenedor
      var arr = JSON.parse(respuesta);
      cargaHtml += `<option disabled selected>Índice</option>`;
      $.each(arr, function(indice, item) {
        cargaHtml += `<option value='${item.IdIndiceRelleno}'>${
          item.Descripcion
        }</option>`;
      });
      $('#comboBoxIndiceRelleno').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_actualizar_relleno').on('click', function(evt) {
  evt.preventDefault();
  $('#modal-mantenedor-relleno').modal('close');
});

var validarFormActualizarAgregados = $('#form-actualizar-relleno').validate({
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
        if ($('#lbl_id_rellenos').text() == '') {
          let action = 'IngresarRelleno';
          dataInfo = {
            nombre: $('#txt_nombre').val(),
            descripcion: $('#txt_descripcion').val(),
            precio: $('#txt_precioRelleno').val(),
            estado: $('#comboBoxEstadoRelleno').val(),
            indice: $('#comboBoxIndiceRelleno').val(),
            action: action
          };
        } else {
          let actionUpdate = 'ActualizarDatosRelleno';
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
          success: function(resp) {
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
          error: function() {
            alert('Lo sentimos ha ocurrido un error');
          }
        });
      }
    });
  }
});
