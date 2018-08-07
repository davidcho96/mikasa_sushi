'use strict';

$(document).ready(function () {
  // Activa sidenav en el index
  $(document).ready(function () {
    $('.sidenav').sidenav();
  });

  $(document).ready(function () {
    $('.parallax').parallax();
  });

  $(document).ready(function () {
    $('.scrollspy').scrollSpy();
  });
  $(document).ready(function () {
    $('.modal').modal();
  });
  $(document).ready(function () {
    $('.collapsible').collapsible();
  });
  $(document).ready(function () {
    $('.tabs').tabs();
  });
});
'use strict';

$("#form_registro").validate({
  errorClass: "invalid red-text",
  validClass: "valid",
  errorElement: "div",
  errorPlacement: function errorPlacement(error, element) {
    $(element).closest("form").find('label[for=' + element.attr("id") + ']').attr("data-error", error.text());
    error.insertAfter(element);
  },
  rules: {
    txt_nombre: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_apellidoP: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_apellidoM: {
      required: true,
      minlength: 3,
      maxlength: 45,
      lettersonly: true
    },
    txt_email: {
      required: true,
      email: true
    },
    txt_password: {
      required: true,
      minlength: 10,
      maxlength: 100
    }
  },
  messages: {
    txt_nombre: {
      required: "Campo requerido *",
      minlength: "Ingresa un nombre válido",
      maxlength: "Máximo permitido 45 caracteres"
    },
    txt_apellidoP: {
      required: "Campo requerido *",
      minlength: "Ingresa un apellido válido",
      maxlength: "Máximo permitido 45 caracteres"
    },
    txt_apellidoM: {
      required: "Campo requerido *",
      minlength: "Ingresa un apellido válido",
      maxlength: "Máximo 45 caracteres"
    },
    txt_email: {
      required: "Campo requerido *",
      email: "Correo inválido (ejemplo: dmc@gmail.com)"
    },
    txt_password: {
      required: "Campo requerido *",
      minlength: "Mínimo 10 caractere"
    }
  },
  invalidHandler: function invalidHandler(form) {
    M.toast({
      html: 'Por favor completa los campos requeridos',
      displayLength: 3000,
      classes: "red"
    });
  },
  submitHandler: function submitHandler() {
    var action = "RegistroCliente";
    $.ajax({
      data: $("#form_registro").serialize() + '&action=' + action,
      url: "../app/control/despCliente.php",
      type: "POST",
      success: function success(resp) {
        console.log('' + $("#form_registro").serialize());
        console.log(resp);
        switch (resp) {
          case "1":
            alert("El correo ingresado ya está registrado");
            break;
          case "2":
            alert("Registro Exitoso");
            break;
        }
      },
      error: function error() {
        alert("Lo sentimos ha ocurrido un error inesperado");
      }
    });
  }
});

jQuery.validator.addMethod("lettersonly", function (value, element) {
  return this.optional(element) || /^[a-z ]+$/i.test(value);
}, "Ingresa solo letras por favor");