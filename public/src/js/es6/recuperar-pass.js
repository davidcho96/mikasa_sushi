// *Consulta ajax para consultar el estado y existencia del correo

$('#form_recuperar_pass').validate({
  //*configuración de jquery validaty para la validación de campos
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
    //*Se establecen reglas de validación para campos del form
    txt_email: {
      required: true,
      emailCom: true
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_email: {
      required: 'Campo requerido *',
      emailCom: 'Ingresa un correo válido'
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
    let timerInterval;
    swal({
      title: 'Espere',
      html: 'La petición se está procesando.',
      timer: 5000,
      onOpen: () => {
        swal.showLoading();
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then(result => {
      if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.timer
      ) {
        console.log('I was closed by the timer');
      }
    });
    var action = 'ValidarCorreo';
    //*Se envían datos del form y action, al controlador mediante ajax
    $.ajax({
      data: `${$('#form_recuperar_pass').serialize()}&action=${action}`,
      url: '../app/control/despRecuperarPass.php',
      type: 'POST',
      success: function(resp) {
        console.log(resp);
        //*Acción a ejecutar si la respuesta existe
        switch (resp) {
          case '1':
            swal(
              'Listo',
              'Se ha enviado un correo a la dirección ingresada.',
              'success'
            );
            break;
          case '2':
            swal('Error', 'El correo ingresado no existe.', 'error');
            break;
          case '3':
            swal(
              'Error',
              'El correo ingresado no posee los permisos para acceder al sistema.',
              'error'
            );
            break;
        }
      },
      error: function() {
        alert('Lo sentimos ha ocurrido un error');
      }
    });
  }
});

function consultarEstadoToken() {
  var action = 'ConsultarEstadoToken';
  var token = $('#token').val();
  var idUsuario = $('#idUsuario').val();
  $.ajax({
    data: `token=${token}&action=${action}`,
    url: '../app/control/despRecuperarPass.php',
    type: 'POST',
    success: function(resp) {
      if (!resp) {
        location.href = 'index.php';
      }
    },
    error: function() {
      alert('Lo sentimos ha ocurrido un error.');
    }
  });
}

$('#form_cambiar_password_rec').validate({
  //*configuración de jquery validaty para la validación de campos
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
    //*Se establecen reglas de validación para campos del form
    txt_nueva_password: {
      required: true,
      minlength: 7,
      maxlength: 100
    },
    txt_confirmar_nueva_password: {
      required: true,
      minlength: 7,
      maxlength: 100,
      equalTo: '#txt_nueva_password'
    }
  },
  messages: {
    //*Se establecen mensajes de error a imprimir
    txt_nueva_password: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 7 caracteres',
      maxlength: 'Máximo 100 caracteres'
    },
    txt_confirmar_nueva_password: {
      required: 'Campo requerido *',
      minlength: 'Mínimo 7 caracteres',
      maxlength: 'Máximo 100 caracteres',
      equalTo: 'Las contraseñas no coinciden'
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
        var action = 'CambiarPasswordUsuario';
        var token = $('#token').val();
        var idTipoUsuario = $('#tipoUsuario').val();
        var nuevaPass = $('#txt_confirmar_nueva_password').val();

        //*Se envían datos del form y action, al controlador mediante ajax
        $.ajax({
          data: {
            action: action,
            token: token,
            tipoUsuario: idTipoUsuario,
            nuevaPass: nuevaPass
          },
          url: '../app/control/despRecuperarPass.php',
          type: 'POST',
          success: function(resp) {
            console.log(resp);
            //*Acción a ejecutar si la respuesta existe
            switch (resp) {
              case '1':
                swal('Listo', 'Tu contraseña ha sido cambiada.', 'success');
                location.href = 'login.php';
                break;
              case '2':
                swal(
                  'Error',
                  'Lo sentimos la contraseña no se ha podido reestablecer.',
                  'error'
                );
                setTimeout(function() {
                  location.href = 'index.php';
                }, 2000);
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
