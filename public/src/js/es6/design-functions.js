$(document).ready(function() {
  // *Activa sidenav
  $('.sidenav').sidenav();
  // *Activa parallax
  $('.parallax').parallax();
  // *Activa función de scrollspy
  $('.scrollspy').scrollSpy();
  // *Activa modal
  $('.modal').modal();
  // *Activa collapsible
  $('.collapsible').collapsible();
  // *Activa dropdown en li nav
  $('.dropdown-trigger').dropdown();
  // *Activa tabs
  $('.tabs').tabs();
  //* Activa slider
  $('.slider').slider();
  $('.dropdown-trigger').dropdown();
  $('.tooltipped').tooltip();
});

// * Activa funciones de cambios de slide en slider de index
$('.rigth-arrow-slider').click(() => {
  $('.slider').slider('next');
});

$('.left-arrow-slider').click(() => {
  $('.slider').slider('prev');
});
// -----------

function CargarDatosInfoEmpresaIndex() {
  var action = 'cargarDatosInfoEmpresa';
  var mensajeEstadoAperturaLocal = '';
  var arraySemanas = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];
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
          var infoContacto = '';
          $.each(arr, function(indice, item) {
            if (
              item.horaActual >= item.horaApertura &&
              item.horaActual <= item.horaCierre &&
              item.diaSemana >= item.diaInicio &&
              item.diaSemana <= item.diaFinal
            ) {
              mensajeEstadoAperturaLocal =
                '<div class="light-green-text">Ahora abierto</div>';
              $('#content_estado_apertura_local_index').html(
                mensajeEstadoAperturaLocal
              );
            } else {
              mensajeEstadoAperturaLocal =
                '<div class="red-text">Ahora cerrado</div>';
              $('#content_estado_apertura_local_index').html(
                mensajeEstadoAperturaLocal
              );
            }

            $('#info_apertura').html(
              `Horario de atención: ${arraySemanas[item.diaInicio - 1]} a ${
                arraySemanas[item.diaFinal - 1]
              } ${item.horaApertura} - ${item.horaCierre}`
            );
          });
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}

function CargarTablaInfoContactoIndex() {
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
            cargaHtml += `<p>${item.medioContacto}: ${
              item.infoContacto
            }</p></br>`;
          });

          $('#content_info_contacto_index').html(cargaHtml);
          break;
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error');
    }
  });
}
