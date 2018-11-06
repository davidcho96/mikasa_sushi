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
    <title>Tipo pago</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />

</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor center-align">
        <h1>Gestión Tipos de pago
        <a class="btn-floating btn-large waves-effect waves-light red modal-trigger tooltipped" data-position="bottom" data-tooltip="Añadir tipo de pago" href="#modal_mantenedor_tipo_pago"><i class="material-icons">add</i></a>
        </h1>
    </div>

    <div class="contenido-mantenedor row container">
        <div class="col l12 m12 s12">
            <div class="input-field">
                <label for="txt_buscar_tipo_pago">Buscar Tipo Pago</label>
                <input type="text" id="txt_buscar_tipo_pago">
            </div>
            <table id="tabla_tipo_pago">
            <thead>
                <h5>Tipo Pago</h5>
                <tr>
                    <td>Tipo de pago</td>
                    <td colspan='2'>Acciones</td>
                </tr>
            </thead>
            <tbody id="body_tabla_tipo_pago"></tbody>
            </table>
        </div>
    </div>

    <div id="modal_mantenedor_tipo_pago" class="modal">
        <div class="modal-content">

            <div id="content_mensaje_precaucion_tipo_pago"></div>

            <h5 class="center" id="accion_tipo_pago">Ingresar Tipo Pago</h5>
            <form action="" name="form_mantenedor_tipo_pago" id="form_mantenedor_tipo_pago">
            <label id="lbl_id_tipo_pago" class="lbl-id"></label>
                <div class="input-field">
                    <input id="txt_nombre" name="txt_nombre" type="text">
                    <label for="txt_nombre">Nombre</label>
                </div>
                <div class="center">
                    <input type="submit" class="btn black" id="btn_mant_tipo_pago" value="Confirmar">
                    <button id="cancelar_mantenedor_tipo_pago" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/tipo-pago-functions.js"></script>
    <script>
    $(document).ready(function(){
        CargarTablaTipoPago();
        comprobarEstadoSesion();
        setInterval(function(){
            comprobarEstadoSesion();
            CargarTablaTipoPago();
        }, 25000);
        $('#modal_mantenedor_tipo_pago').modal({
                dismissible: false,
                onCloseEnd: function() {
                $('#form_mantenedor_tipo_pago')[0].reset();
                $('#lbl_id_tipo_pago').text('');
                $('#accion_tipo_pago').text('Ingresar Tipo Pago');
                $('#mensaje_precaucion_tipo_pago').remove();
                }
            });
    });
    </script>
</body>
</html>