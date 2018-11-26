function cargarTablaEntregasPendientes() {
  var action = 'CargarTablaEntregasPendientes';
  var cargaHtml = '';
  $.ajax({
    data: { action: action },
    type: 'POST',
    url: '../app/control/despEntregas.php',
    success: function(resp) {
      var arr = JSON.parse(resp);
      $.each(arr, function(i, item) {
        cargaHtml += '<tr>';
        cargaHtml += `<td>${item.CodigoVenta}</td>`;
        cargaHtml += `<td data-position="bottom" data-tooltip="I am a tooltip" class="tooltipped">${
          item.Cliente
        }</td>`;
        cargaHtml += `<td>${item.Direccion}</td>`;
        cargaHtml += `<td>${item.TipoEntrega}</td>`;
        cargaHtml += `<td>${item.TipoPago}</td>`;
        cargaHtml += `<td>${item.Hora}</td>`;
        cargaHtml += `<td>${item.Receptor}</td>`;
        cargaHtml += `<td>$${item.Valor}</td>`;
        cargaHtml += `<td>${item.EstadoEntrega}</td>`;
        cargaHtml += `<td><button class="btn green" onclick="cambiarEstadoEntrega('${
          item.IdEntrega
        }', '${item.CodigoVenta}')">Estado Entrega</button></td>`;
        cargaHtml += '</tr>';
      });
      $('#body_tabla_entregas_pendientes_mikasa').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error al cargar los datos');
    }
  });
}

// *Función para ver detalle de la venta
function verDetalleVentaEntregasRepartidor(idVenta) {
  $('#modal_ver_detalle_venta_entrega_repartidor').modal('open');
  var actionPromoCompra = 'VerDetalleVentaPromoCompra';
  var cargaHtml = '';
  $.ajax({
    data: { action: actionPromoCompra, IdVenta: idVenta },
    url: '../app/control/despVenta.php',
    type: 'POST',
    sync: false,
    success: function(resp) {
      // console.log(resp);
      var arrayDetalleVenta = JSON.parse(resp);
      var arrAgregados = arrayDetalleVenta[1];
      var arr = arrayDetalleVenta[0];
      console.log(arr);
      $.each(arr, function(i, item) {
        if (item.NombrePromo != null) {
          var arrayDetalle = JSON.stringify(eval(arr[i]));
          var arrayDosDetalle = JSON.parse(arrayDetalle);
          var arrayTres = JSON.stringify(eval(arrayDosDetalle.Detalle));
          var arrayTresParse = JSON.parse(arrayTres);

          cargaHtml += '<ul class="collection">';
          cargaHtml += `<li class="collection-item"><b>${
            item.NombrePromo
          }</b></li>`;
          $.each(arrayTresParse, function(e, elem) {
            cargaHtml += `<li class="collection-item">${elem.Piezas} ${
              elem.Detalle
            }</li>`;
          });
          cargaHtml += '</ul>';
        }
      });
      if (arrAgregados.length > 0) {
        cargaHtml += '<ul class="collection">';
        cargaHtml += '<li class="collection-item"><b>Agregados Mikasa</b></li>';
        $.each(arrAgregados, function(a, agregado) {
          cargaHtml += `<li class="collection-item">${
            agregado.NombreAgregado
          }</li>`;
        });
        cargaHtml += '</ul>';
      }
      $('#cargar_detalle_venta_entrega_repartidor').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function corroborarTipoEntregaF(IdEntrega, CodigoVenta) {
  var action = 'CorroborarTipoEntrega';
  return $.ajax({
    data: { action: action, IdEntrega: IdEntrega, CodigoVenta: CodigoVenta },
    url: '../app/control/despEntregas.php',
    type: 'POST',
    async: false,
    success: function(resp) {
      return resp;
    },
    error: function() {
      alert('Los sentimos ha ocurrido un error');
    }
  });
}

function cambiarEstadoEntrega(IdEntrega, CodigoVenta) {
  var action = '';
  var cargaHtml = '';
  $('#txt_id_entrega_admin').val(IdEntrega);
  $('#modal_cambiar_estado_entrega').modal('open');
  corroborarTipoEntregaF(IdEntrega, CodigoVenta).done(function(data) {
    var arr = JSON.parse(data);
    var tipo = arr[0].IdTipoEntrega;
    var checked = arr[0].IdEstadoEntrega;
    switch (tipo.toString()) {
      case '1':
        action = 'CargarOpcionesEntregaDomicilio';
        $.ajax({
          data: {
            action: action
          },
          url: '../app/control/despEntregas.php',
          type: 'POST',
          // async: false,
          success: function(resp) {
            var arr = JSON.parse(resp);
            $.each(arr, function(i, item) {
              cargaHtml += '<p>';
              cargaHtml += '<label>';
              if (item.IdEstadoEntrega == checked) {
                cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" checked value="${
                  item.IdEstadoEntrega
                }"/>`;
              } else {
                if (item.IdEstadoEntrega < checked) {
                  cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" disabled="disabled" value="${
                    item.IdEstadoEntrega
                  }"/>`;
                } else {
                  cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" value="${
                    item.IdEstadoEntrega
                  }"/>`;
                }
              }
              cargaHtml += `<span>${item.EstadoEntrega}</span>`;
              cargaHtml += '</label>';
              cargaHtml += '</p>';
            });
            $('#cargar_opciones_estado_entrega').html(cargaHtml);
          },
          error: function() {
            alert('Los sentimos ha ocurrido un error');
          }
        });
        $('#cargarOpcionesEstadoEntrega').html(cargaHtml);
        break;
      case '2':
        action = 'CargarOpcionesEntregaLocal';
        $.ajax({
          data: {
            action: action
          },
          url: '../app/control/despEntregas.php',
          type: 'POST',
          // async: false,
          success: function(resp) {
            var arr = JSON.parse(resp);
            $.each(arr, function(i, item) {
              cargaHtml += '<p>';
              cargaHtml += '<label>';
              if (item.IdEstadoEntrega == checked) {
                cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" checked value="${
                  item.IdEstadoEntrega
                }"/>`;
              } else {
                if (item.IdEstadoEntrega < checked) {
                  cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" disabled="disabled" value="${
                    item.IdEstadoEntrega
                  }"/>`;
                } else {
                  cargaHtml += `<input class="with-gap" name="radioEstadoEntrega" type="radio" value="${
                    item.IdEstadoEntrega
                  }"/>`;
                }
              }
              cargaHtml += `<span>${item.EstadoEntrega}</span>`;
              cargaHtml += '</label>';
              cargaHtml += '</p>';
            });
            $('#cargar_opciones_estado_entrega').html(cargaHtml);
          },
          error: function() {
            alert('Los sentimos ha ocurrido un error');
          }
        });
        break;
    }
  });
}

// *Se cambia el estado de la entrega según lo seleccionado por el admin o vendedor0.

$('#form_actualizar_estado_entrega_admin_venta').validate({
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
    radioEstadoEntrega: {
      required: true
    }
  },
  messages: {
    radioEstadoEntrega: {
      required: 'Campo requerido *'
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
    var action = 'ActualizarEstadoEntregaAdmin';
    var IdEntrega = $('#txt_id_entrega_admin').val();
    var IdEstadoEntrega = $('input[name=radioEstadoEntrega]:checked').val();
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
            IdEntrega: IdEntrega,
            IdEstadoEntrega: IdEstadoEntrega
          },
          url: '../app/control/despEntregas.php',
          type: 'POST',
          success: function(resp) {
            switch (resp) {
              case '1':
                swal('Listo', 'La tarea se llevó a cabo', 'success');
                cargarTablaEntregasPendientes();
                $('#modal_cambiar_estado_entrega').modal('close');
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

// *Función para tabla entregas pendientes en repartidor
function cargarTablaEntregasPendientesRepartidor() {
  var action = 'CargarTablaEntregasPendientesRepartidor';
  var cargaHtml = '';
  $.ajax({
    data: { action: action },
    type: 'POST',
    url: '../app/control/despEntregas.php',
    success: function(resp) {
      var arr = JSON.parse(resp);
      if (arr.length > 0) {
        $.each(arr, function(i, item) {
          cargaHtml += '<tr>';
          cargaHtml += `<td>${item.CodigoVenta}</td>`;
          cargaHtml += `<td>${item.Cliente}</td>`;
          cargaHtml += `<td>${item.Direccion}</td>`;
          cargaHtml += `<td>${item.TipoPago}</td>`;
          cargaHtml += `<td>${item.Hora}</td>`;
          cargaHtml += `<td>${item.Receptor}</td>`;
          cargaHtml += `<td>$${item.Valor}</td>`;
          cargaHtml += `<td>${item.EstadoEntrega}</td>`;
          if (item.HorasDiferencia < '00:00') {
            cargaHtml += `<td class="green-text">Faltan: ${
              item.HorasDiferencia
            }</td>`;
          } else {
            cargaHtml += `<td class="red-text">Retraso de: ${
              item.HorasDiferencia
            }</td>`;
            console.log(item.HorasDiferencia.toString());
          }
          cargaHtml += `<td><button class="btn green" onclick="entregarPedido('${
            item.IdEntrega
          }', '${item.CodigoVenta}')">Entregar Pedido</button></td>`;
          cargaHtml +=
            "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaEntregasRepartidor(" +
            item.IdVenta +
            ")'><i class='material-icons'>more_vert</i></a></td>";
          cargaHtml += '</tr>';
        });
      } else {
        cargaHtml += '<tr>';
        cargaHtml += '<td colspan="10">No hay entregas pendientes</td>';
        cargaHtml += '</tr>';
      }
      $('#body_tabla_entregas_pendientes_repartidor_mikasa').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error al cargar los datos');
    }
  });
}

// *Inicializa el mapa de la lobería leaflet con la API de openstreetMap
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  osmAttrib =
    '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
    {
      maxZoom: 16,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  );

var mapInfoEntrega;
var mapLlevarEntrega;

// *Muestra los datos del pedido para que el repartidor determine si adjudicarse la entrega
function entregarPedido(IdEntrega, CodigoVenta) {
  var action = 'ObtenerDatosPedidoPendienteRepartidor';
  var cargaHtml = '';
  $('#txt_id_entrega_mapa').val(IdEntrega);
  $('#txt_codigo_venta_mapa').val(CodigoVenta);
  $('#modal_realizar_entrega_repartidor').modal('open');
  $.ajax({
    data: { action: action, IdEntrega: IdEntrega, CodigoVenta: CodigoVenta },
    url: '../app/control/despEntregas.php',
    type: 'POST',
    success: function(resp) {
      mapInfoEntrega = L.map('map_repartidor')
        .setView([-37.465, -72.3693], 15)
        .addLayer(osm);
      var arr = JSON.parse(resp);

      $.each(arr, function(i, item) {
        // *Carga la ubicación del pedido indicada previamente por el admin
        L.marker([item.Lat, item.Lng])
          .addTo(mapInfoEntrega)
          .bindPopup(item.Direccion);
        // *Carga la información de la entrega
        cargaHtml += `<li class="collection-item"><b>Dirección: </b>${
          item.Direccion
        }</li>`;
        cargaHtml += `<li class="collection-item"><b>Receptor: </b>${
          item.Receptor
        }</li>`;
        cargaHtml += `<li class="collection-item"><b>Hora de entrega: </b>${
          item.Hora
        }</li>`;
        // *Geolocalización
        if (navigator.geolocation) {
          // *El navegador soporta la geolocalización por lo que se marca la ruta
          navigator.geolocation.getCurrentPosition(
            function(position) {
              var lat = position.coords.latitude;
              var lng = position.coords.longitude;
              L.Routing.control({
                waypoints: [L.latLng(item.Lat, item.Lng), L.latLng(lat, lng)]
              }).addTo(mapInfoEntrega);
            },
            function() {
              handleNoGeolocation(true);
            }
          );
        } else {
          // *El navegador no soporta el uso de geolocalización
          var lat = '-37.470144';
          var lng = '-72.353745';
          L.Routing.control({
            waypoints: [L.latLng(item.Lat, item.Lng), L.latLng(lat, lng)]
          }).addTo(mapInfoEntrega);
          handleNoGeolocation(false);
        }
      });
      $('#info_entrega_pendiente_repartidor').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error al cargar los datos');
    }
  });
}

// *Función que cambia el estado de la entrega a 'En camino'
$('#form_realizar_entrega_mantenedor').submit(function(evt) {
  evt.preventDefault();
  var action = 'CambiarEstadoEntregaEnCaminoRepartidor';
  var IdEntrega = $('#txt_id_entrega_mapa').val();
  var CodigoVenta = $('#txt_codigo_venta_mapa').val();
  swal({
    title: '¿Estás seguro?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    $.ajax({
      data: { action: action, IdEntrega: IdEntrega, CodigoVenta: CodigoVenta },
      url: '../app/control/despEntregas.php',
      type: 'POST',
      success: function(resp) {
        console.log(resp);
        switch (resp) {
          case '1':
            swal('Listo', 'La tarea se llevó a cabo', 'success');
            cargarTablaEntregasPendientesRepartidor();
            cargarTablaMisEntregasPendientesRepartidor();
            $('#modal_realizar_entrega_repartidor').modal('close');
            break;
          case '2':
            swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
            break;
          case '3':
            swal(
              'Error!',
              'La entrega ya fue adjudicada por otro vendedor',
              'error'
            );
            cargarTablaEntregasPendientesRepartidor();
            cargarTablaMisEntregasPendientesRepartidor();
            $('#modal_realizar_entrega_repartidor').modal('close');
            break;
        }
      },
      error: function() {
        alert('Lo sentimos ha ocurrido un error al cargar los datos');
      }
    });
  });
});

// *Función para tabla entregas pendientes del repartidor logueado
function cargarTablaMisEntregasPendientesRepartidor() {
  var action = 'CargarTablaMisEntregasPendientesRepartidor';
  var cargaHtml = '';
  $.ajax({
    data: { action: action },
    type: 'POST',
    url: '../app/control/despEntregas.php',
    success: function(resp) {
      var arr = JSON.parse(resp);
      if (arr.length > 0) {
        $.each(arr, function(i, item) {
          cargaHtml += '<tr>';
          cargaHtml += `<td>${item.CodigoVenta}</td>`;
          cargaHtml += `<td>${item.Cliente}</td>`;
          cargaHtml += `<td>${item.Direccion}</td>`;
          cargaHtml += `<td>${item.TipoPago}</td>`;
          cargaHtml += `<td>${item.Hora}</td>`;
          cargaHtml += `<td>${item.Receptor}</td>`;
          cargaHtml += `<td>$${item.Valor}</td>`;
          cargaHtml += `<td>${item.EstadoEntrega}</td>`;
          cargaHtml += `<td><button class="btn green btn-floating" onclick="verRecorridoEntregaRepartidor('${
            item.IdEntrega
          }', '${
            item.CodigoVenta
          }')"><i class="material-icons">not_listed_location</i></button></td>`;
          cargaHtml += `<td><button class="btn blue btn-floating" onclick="terminarEntregaPedido('${
            item.IdEntrega
          }', '${
            item.CodigoVenta
          }')"><i class="material-icons">done_all</i></button></td>`;
          cargaHtml +=
            "<td><a class='btn-floating btn-medium waves-effect waves-light blue' onclick='verDetalleVentaEntregasRepartidor(" +
            item.IdVenta +
            ")'><i class='material-icons'>more_vert</i></a></td>";
          cargaHtml += '</tr>';
        });
      } else {
        cargaHtml += '<tr>';
        cargaHtml +=
          '<td colspan="10">No tienes entregas pendientes por realizar.</td>';
        cargaHtml += '</tr>';
      }
      $('#body_tabla__mis_entregas_pendientes_repartidor_mikasa').html(
        cargaHtml
      );
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error al cargar los datos');
    }
  });
}

var routingControl = null;
var intervaloMapaRecorrido;

function verRecorridoEntregaRepartidor(IdEntrega, CodigoVenta) {
  var action = 'ObtenerDatosPedidoPendienteRepartidor';
  var cargaHtml = '';
  $('#txt_id_entrega_mapa').val(IdEntrega);
  $('#txt_codigo_venta_mapa').val(CodigoVenta);
  $('#modal_recorrido_info_entrega_repartidor').modal('open');
  $.ajax({
    data: { action: action, IdEntrega: IdEntrega, CodigoVenta: CodigoVenta },
    url: '../app/control/despEntregas.php',
    type: 'POST',
    success: function(resp) {
      mapLlevarEntrega = L.map('map_recorrido_repartidor')
        .setView([-37.465, -72.3693], 15)
        .addLayer(osm);
      var arr = JSON.parse(resp);

      $.each(arr, function(i, item) {
        // *Carga la ubicación del pedido indicada previamente por el admin

        // *Carga la información de la entrega
        cargaHtml += `<li class="collection-item"><b>Dirección: </b>${
          item.Direccion
        }</li>`;
        cargaHtml += `<li class="collection-item"><b>Receptor: </b>${
          item.Receptor
        }</li>`;
        cargaHtml += `<li class="collection-item"><b>Hora de entrega: </b>${
          item.Hora
        }</li>`;
        // *Geolocalización
        function success(position) {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          routingControl = L.Routing.control({
            waypoints: [L.latLng(item.Lat, item.Lng), L.latLng(lat, lng)]
          }).addTo(mapLlevarEntrega);
        }

        function error(err) {
          console.warn('ERROR(' + err.code + '): ' + err.message);
        }
        // intervaloMapaRecorrido =
        intervaloMapaRecorrido = setInterval(function() {
          if (document.hasFocus()) {
            navigator.geolocation.getCurrentPosition(success, error);
            if (
              typeof routingControl == 'undefined' ||
              routingControl == null
            ) {
              console.log(routingControl);
            } else {
              routingControl.getPlan().setWaypoints([]);
            }
            console.log('u');
          } else {
            console.log('No focus');
          }
          // routingControl.getPlan().setWaypoints([]);
        }, 5000);
      });
      $('#info_entrega_recorrido_repartidor').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error al cargar los datos');
    }
  });
}

// *Envía los datos para cambiar el estado del pedido seleccionado
function terminarEntregaPedido(IdEntrega, CodigoVenta) {
  swal({
    title: '¿Estás seguro de dar por finalizada esta entrega?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    var action = 'FinalizarEntregaPedido';
    $.ajax({
      data: { action: action, IdEntrega: IdEntrega, CodigoVenta: CodigoVenta },
      url: '../app/control/despEntregas.php',
      type: 'POST',
      success: function(resp) {
        switch (resp) {
          // *Entrega realizada
          case '1':
            swal('Listo', 'La tarea se llevó a cabo', 'success');
            cargarTablaEntregasPendientesRepartidor();
            cargarTablaMisEntregasPendientesRepartidor();
            break;
          // *Error al ejecutar la acción
          case '2':
            swal('Error!', 'La tarea no pudo llevarse a cabo', 'error');
            break;
          // *El pedido ya fue registrado como entrega
          case '3':
            swal(
              'Error!',
              'La entrega ya fue adjudicada por otro vendedor',
              'error'
            );
            cargarTablaEntregasPendientesRepartidor();
            cargarTablaMisEntregasPendientesRepartidor();
            break;
        }
      },
      error: function() {
        alert('Lo sentimos ha ocurrido un error al cargar los datos');
      }
    });
  });
}

// *Si se presiona el botón entregar pedido en el modal la función terminar entrega se ejecuta
$('#form_finalizar_entrega_repartidor').submit(function(evt) {
  evt.preventDefault();
  var IdEntrega = $('#txt_id_entrega_mapa').val();
  var CodigoVenta = $('#txt_codigo_venta_mapa').val();
  terminarEntregaPedido(IdEntrega, CodigoVenta);
});

function cargarTablaMisEntregasRealizadas() {
  var action = 'CargarTablaMisEntregasRealizadas';
  var cargaHtml = '';
  $.ajax({
    data: { action: action },
    type: 'POST',
    url: '../app/control/despEntregas.php',
    success: function(resp) {
      console.log(resp);
      var arr = JSON.parse(resp);
      $.each(arr, function(i, item) {
        cargaHtml += '<tr>';
        cargaHtml += `<td>${item.CodigoVenta}</td>`;
        cargaHtml += `<td data-position="bottom" data-tooltip="I am a tooltip" class="tooltipped">${
          item.Cliente
        }</td>`;
        cargaHtml += `<td>${item.Direccion}</td>`;
        cargaHtml += `<td>${item.Fecha}</td>`;
        cargaHtml += `<td>${item.Hora}</td>`;
        cargaHtml += `<td>${item.Receptor}</td>`;
        cargaHtml += `<td>${item.Cliente}</td>`;
        cargaHtml += `<td>${item.TipoPago}</td>`;
        cargaHtml += `<td>$${item.Valor}</td>`;
        cargaHtml += `<td>${item.HoraEntrega}</td>`;
        cargaHtml += '</tr>';
      });
      $('#body_tabla_mis_entregas_realizadas').html(cargaHtml);
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error al cargar los datos');
    }
  });
}
