function cargarMantenedorRellenos(estado, caracter) {
  var action = 'CargarMantenedorRellenos';
  var cargaHtml = '';
  // *Los arrays almacenarán los datos de aquellas coberturas que no puedan ser seleccionados por el cliente
  var arrayIndiceNingunoRellenos = [];
  var arrayNoEnCartaRellenos = [];
  var arrayProductosPocoStock = [];
  //*Se envían datos del form y action, al controlador mediante ajax
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despRellenos.php',
    type: 'POST',
    success: function(respuesta) {
      // *----------------------------------------------------------------------
      // *Se filtra el array obtenido en base a los parámetros obtenidos
      var arr = JSON.parse(respuesta);
      // *Se parsea la respuesta json obtenid|a
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
            cargaHtml +=
              '<div class="card-image waves-effect waves-block waves-light">';
            cargaHtml += `<img class="activator" src="uploads/${item.ImgUrl}">`;
            cargaHtml += '</div>';
            cargaHtml += '<div class="card-content">';
            cargaHtml += `<span class="card-title activator grey-text text-darken-4">${
              item.Nombre
            }<i class="material-icons right">more_vert</i></span>`;
            cargaHtml += '<div class="precios-productos">';
            cargaHtml += `<span class="grey-text text-darken-4">Precio: $${
              item.Precio
            }</span>`;
            // *Si el indice es igual a 'Ninguno' el texto se marca en rojo
            if (item.Indice != 'Ninguno') {
              cargaHtml += `<span class="grey-text text-darken-4">Opción de elección: ${
                item.Indice
              }</span>`;
            } else {
              cargaHtml += `<span class="red-text text-darken-4">Opción de elección: ${
                item.Indice
              }</span>`;
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

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayProductosPocoStock.length > 0) {
            var htmlPocoStock = `<div class="mensaje-precaucion-indice" id="mensaje_stock_rellenos"><p><b>Atención!:</b> Existen ${
              arrayProductosPocoStock.length
            } rellenos (${arrayProductosPocoStock.join(
              ', '
            )}) que poseen poco stock. Recuerda que estos no podrán ser elegidos por el cliente.</p></div>`;
            $('#mensaje_poco_stock_rellenos').html(htmlPocoStock);
          } else {
            $('#mensaje_stock_rellenos').remove();
          }

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayIndiceNingunoRellenos.length > 0) {
            var htmlNoIndice = `<div class="mensaje-precaucion-indice" id="mensaje_indice_rellenos"><p><b>Atención!:</b> Existen ${
              arrayIndiceNingunoRellenos.length
            } rellenos (${arrayIndiceNingunoRellenos.join(
              ', '
            )}) que no poseen un índice de selección. Recuerda que estos no podrán ser elegidos por el cliente.</p></div>`;
            $('#mensaje_no_indice_rellenos').html(htmlNoIndice);
          } else {
            $('#mensaje_indice_rellenos').remove();
          }

          // *Si el array contiene elementos se mostrará un mensaje de cuantos y cuales son
          if (arrayNoEnCartaRellenos.length > 0) {
            var htmlNoEnCarta = `<div class="mensaje-precaucion-indice" id="mensaje_indice_no_carta_rellenos"><p><b>Atención!:</b> Existen ${
              arrayNoEnCartaRellenos.length
            } rellenos (${arrayNoEnCartaRellenos.join(
              ', '
            )}) que no están en carta. Recuerda que estos no podrán ser elegidos por el cliente.</p></div>`;
            $('#mensaje_no_carta_rellenos').html(htmlNoEnCarta);
          } else {
            $('#mensaje_indice_no_carta_rellenos').remove();
          }

          // *Se cargan los datos de la bd en la pantalla
          $('#rellenos_carga').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

$('#combo_estado_rellenos_filtro').change(function(item) {
  cargarMantenedorRellenos(
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
  cargarMantenedorRellenos(
    $('#combo_estado_rellenos_filtro')
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
    text:
      'Al ser eliminada este relleno ya no podrá ser seleccionado para ser adquirido.',
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
  $('#modal_mantenedor_relleno').modal('open');
  var action = 'CargarModalRelleno';
  var mensajeHtml =
    '<div class="mensaje-precaucion" id="mensaje_precaucion_rellenos"><p><b>Cuidado!:</b> Considera que puede que este elemento esté vinculado a uno o más registros y de ser alterado se verá también reflejado en aquella información.</p></div>';
  $('#content_mensaje_precaucion_rellenos').html(mensajeHtml);
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
        $(`label[for='txt_precio_relleno']`).addClass('active');
        $('#txt_precio_relleno').val(item.Precio);
        $('#combo_estado_relleno').val(item.Estado);
        $('#combo_indice_relleno').val(item.Indice);
        $('#imagen_rellenos_text').val(item.ImgUrl);
        // *------------------------------
        $(`label[for='txt_cantidad_stock_relleno']`).addClass('active');
        $('#txt_cantidad_stock_relleno').val(item.Stock);
        $(`label[for='txt_cantidad_minima_relleno']`).addClass('active');
        $('#txt_cantidad_minima_relleno').val(item.Minima);
        $(`label[for='txt_cantidad_uso_roll_relleno']`).addClass('active');
        $('#txt_cantidad_uso_roll_relleno').val(item.Uso);
        $('#combo_unidad_relleno_stock').val(item.StockUnidad);
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
      $('#combo_indice_relleno').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

// *Al presionar el botón cancelar del modal de ingreso de datos el formulario se formateará
// *De esta forma detectará si existe el valor del label id y definirá la acción a realizar
$('#cancelar_mantenedor_relleno').on('click', function(evt) {
  evt.preventDefault();
  $('#modal_mantenedor_relleno').modal('close');
});

var validarFormRelleno = $('#form_mantenedor_relleno').validate({
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
        var imgExtension = $('#imagen_rellenos')
          .val()
          .substr(
            $('#imagen_rellenos')
              .val()
              .lastIndexOf('.') + 1
          );
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
          let action = 'IngresarRelleno';
          formData.append('action', action);
          if ($('#imagen_rellenos').val() != '') {
            formData.append('imagenUrl', $('input[type=file]')[0].files[0]);
          } else {
            formData.append('imagenUrl', '');
          }
        } else {
          let actionUpdate = 'ActualizarDatosRelleno';
          formData.append('id', $('#lbl_id_rellenos').text());
          formData.append('action', actionUpdate);
          // *Se comprueba la extensión de la imagen por la variable imgExtension
          if (
            $('#imagen_rellenos').val() != '' ||
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
          url: '../app/control/despRellenos.php',
          type: 'POST',
          contentType: false,
          processData: false,
          success: function(resp) {
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
          error: function() {
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
    data: `action=${action}`,
    url: '../app/control/despIndiceRelleno.php',
    type: 'POST',
    success: function(respuesta) {
      switch (respuesta) {
        case 'error':
          console.log(
            'Lo sentimos ha ocurrido un error al cargar la cantidad de indices de relleno'
          );
          break;
        default:
          cargaHtml += `<p>Opciones disponibles: ${respuesta}`;
          cargaHtml += `<a class="btn-indice btn-floating btn-medium waves-effect waves-light blue tooltipped" data-position="bottom" data-tooltip="Añadir índice de elección" onclick="sumarIndiceRelleno()"><i class="fa fa-plus"></i></a>`;
          cargaHtml += `<a class="btn-indice btn-floating btn-medium waves-effect waves-light red tooltipped" data-position="bottom" data-tooltip="Eliminar índice de elección" onclick="restarIndiceRelleno()"><i class="fa fa-minus"></i></a>`;
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
    data: `action=${actionGetDatosVinculadosRellenos}`,
    url: '../app/control/despIndiceRelleno.php',
    type: 'POST',
    success: function(respuestaDatosVinculados) {
      var action = 'RestarIndiceRellenos';
      //*Se envían datos del form y action, al controlador mediante ajax
      swal({
        title: '¿Estás seguro?',
        text: `Existen ${respuestaDatosVinculados} rellenos vinculados a este índice, al elimnarlo estos no podrán ser seleccionados por el cliente.`,
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
            url: '../app/control/despIndiceRelleno.php',
            type: 'POST',
            success: function(respuesta) {
              switch (respuesta) {
                case '1':
                  // *Eliminación exitosa
                  cargarTotalIndiceRellenos();
                  cargarMantenedorRellenos();
                  cargarIndiceRelleno();
                  swal(
                    'Listo',
                    `Se ha restado un índice, ${respuestaDatosVinculados} rellenos han quedado sin índice de selección, por lo tanto no podrán ser seleccionadas por el cliente.`,
                    'success'
                  );
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
  }).then(result => {
    if (result.value) {
      $.ajax({
        data: `action=${action}`,
        url: '../app/control/despIndiceRelleno.php',
        type: 'POST',
        success: function(respuesta) {
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
