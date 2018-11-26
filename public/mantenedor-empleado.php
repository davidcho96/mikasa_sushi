<?php 
session_start();

require 'templates/session.php';

$sesionUsuario = new Sesion();

$sesionUsuario->validarSesionMantenedores();

$sesionUsuario->validacionSesionAdmin();

// $sesionUsuario->validarEstadoSesion();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Coberturas Mikasa</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
</head>
<body>
<nav class="top-nav background red">
        <div class="container">
            <div class="nav-wrapper">
                <div class="row">
                    <div class="col s12 m10 l10">
                        <h1 class="center-align">Mantenedor empleado</h1>
                    </div>
                </div>
            </div>
        </div>
    </nav>
<?php
require_once "templates/nav-admin.php";
?>
<!-- Seccion de las tablas de carga de informacion-->
<div class="row container">
    <div class="col s12 m12 l12">
        <div>
            <label for="">Filtro empleado</label>
            <input type="text" name="" id="txt_filtro_empleados">
        </div>
        <div style="overflow-x:auto;">
            <table class="striped" id='tabla_filtro_empleados'>
                <thead>
                    <tr class="">
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Tipo Empleado</th>
                        <th>Estado</th>
                        <th colspan="2">Accion</th>
                    </tr>
                </thead>
                <tbody id="tabla_empleados">
                </tbody>
            </table>
        </div>
    </div>
</div>
    <!-- Modal de actualizar empleado -->
<div>
    <form action="" method="POST" name="ActualizaEmpleados" id="ActualizaEmpleados">
        <div id="modal_actualiza_empleado" class="modal info-perfil-content">
            <div class="modal-content">
            <div id="content_mensaje_precaucion_empleados"></div>
                <h4 class="center-align">Actualiza empleado</h4>
                <input type="text" id="lbl_id_empleados" class="lbl-id" name="_charset_">
                    <div class="input-field">
                        <input name="txt_nombre" id="txt_nombre" type="text" class="validate">
                        <label for="txt_nombre">Nombre</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_apellidos" name="txt_apellidos" type="text" class="validate">
                        <label for="txt_apellidos">Apellido</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_email" name="txt_email" type="text" class="validate">
                        <label for="txt_email">Correo</label>
                    </div>
                    <div class="input-field">
                        <label class="active">Estado empleado</label>
                        <select name="combo_EstadoEmpleado" id="combo_EstadoEmpleado" class="browser-default">
                        </select>
                    </div>
                    <!-- combo_tipoEmpleado2 se nombra el combobox ya que si se deja como el combo del formulario solo se logran insertar los datos en uno-->
                    <div class="input-field">
                        <label class="active">Tipo empleado</label>
                        <select name="combo_TipoEmpleado2" id="combo_TipoEmpleado2" class="browser-default">
                        </select>
                    </div>
                    <div class="center-align">
                        <button class="btn black" type="submit" name="action">
                            Actualizar
                        </button>
                        <button class="btn red" id="cancelar_actualizar_empleado">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
    <!-- Formulario de ingreso de los mantenedores-->
<div class="row container">
    <div class="card col s12 m12 l12">
        <form id="form_registro_empleado" action="" method="POST">
            <div class="card-content">
                <span class="card-title">Ingreso empleado</span>
                <div class="input-field">
                    <input name="txt_nombre" id="nombre" type="text" class="validate">
                    <label for="nombre">Nombre</label>
                </div>
                <div class="input-field">
                    <input id="apellidos" name="txt_apellidos" type="text" class="validate">
                    <label for="apellidos">Apellido</label>
                </div>
                <div class="input-field">
                    <label class="active">Tipo empleado</label>
                    <select name="combo_TipoEmpleado" id="combo_TipoEmpleado" class="browser-default">
                    </select>
                </div>
                <div class="input-field">
                    <input id="email" name="txt_email" type="text" class="validate">
                    <label for="email">Correo</label>
                </div>
                <div class="input-field">
                    <input id="password" name="txt_password" type="password" class="validate">
                    <label for="password">Contraseña</label>
                </div>
                <div class="center-align">
                    <button class="btn black" type="submit"
                        name="action">
                        Registrar
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<script src="dist/js/script.min.js"></script>
<!-- <script src="src/js/es6/funciones-empleados.js"></script> -->
<script>
    $(document).ready(function () {
        CargarTablaEmpleados();
        // Estas dos funciones cargan los combobox respectivos
        CargaTipoEmpleado();
        CargaTipoEmpleadoModal();
        CargaEstadoEmpleadoModal();
        comprobarEstadoSesion();
        setInterval(function(){
            // CargarTablaEmpleados();
            comprobarEstadoSesion();
        }, 60000);
        $('#modal_actualiza_empleado').modal({
            dismissible: false,
            onCloseEnd: function () {
                // $('#lbl_id_empleados').text('');
            }
        });
    });
</script>
</body>

</html>