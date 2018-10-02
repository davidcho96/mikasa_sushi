$(document).ready(function() {
  function CargarTablaClientes() {
    var action = 'CargarTablaClientes';
    //*Se envían datos del form y action, al controlador mediante ajax
    $.ajax({
      data: `action=${action}`,
      url: '../app/control/despCliente.php',
      type: 'POST',
      success: function(respuesta) {
        var arr = JSON.parse(respuesta);
        var tabla = '';
        alert(respuesta);
        //*Acción a ejecutar si la respuesta existe
        switch (respuesta) {
          case 'error':
            alert('Lo sentimos ha ocurrido un error');
            break;
          default:
            //* Por defecto los datos serán cargados en pantalla
            $.each(arr, function(indice, item) {
              tabla += `<tr><td>${item.Nombre}</td></tr>`;
              //   $('#txt_nombre').val(item.Nombre);
              //   $('#txt_apellidos').val(item.Apellidos);
              //   $('#txt_correo').val(item.Correo);
              //   if (item.Telefono === 'NULL') {
              //     $('#txt_telefono').val('');
              //   } else {
              //     $('#txt_telefono').val(item.Telefono);
              //   }
            });
            $('#tabla_clientes').html(tabla);
            break;
        }
      },
      error: function() {
        alert('Lo sentimos ha ocurrido un error');
      }
    });
  }
  CargarTablaClientes();
});
