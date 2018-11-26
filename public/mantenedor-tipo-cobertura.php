<?php 
session_start();

require 'templates/session.php';

$sesionUsuario = new Sesion();

$sesionUsuario->validarSesionMantenedores();

$sesionUsuario->validacionSesionAdmin();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Tipo Coberturas</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor center-align">
        <h1>Gestión Tipos de Coberturas
        <a class="btn-floating btn-large waves-effect waves-light red modal-trigger tooltipped" data-position="bottom" data-tooltip="Añadir tipo de cobertura" href="#modal_mantenedor_tipo_cobertura"><i class="material-icons">add</i></a>
        </h1>
    </div>

    <div class="contenido-mantenedor row container">
        <div class="col l12 m12 s12 center-align">
            <div class="input-field">
                <label for="txt_buscar_tipo_cobertura">Buscar Tipo Coberturas</label>
                <input type="text" id="txt_buscar_tipo_cobertura">
            </div>
            <table id="tabla_tipo_cobertura">
            <thead>
                <h5>Tipo Cobertura</h5>
                <tr>
                    <td>Tipo de cobertura</td>
                    <td>Coberturas</td>
                    <td colspan='2'>Acciones</td>
                </tr>
            </thead>
            <tbody id="body_tabla_tipo_cobertura"></tbody>
            </table>
        </div>
    </div>

    <div id="modal_mantenedor_tipo_cobertura" class="modal">
        <div class="modal-content">

            <div id="content_mensaje_precaucion_tipo_cobertura"></div>

            <h5 class="center" id="accion_tipo_coberturas">Ingresar Tipo Cobertura</h5>
            <form action="" name="form_mantenedor_tipo_coberturas" id="form_mantenedor_tipo_coberturas">
            <label id="lbl_id_tipo_cobertura" class="lbl-id"></label>
                <div class="input-field">
                    <input id="txt_nombre" name="txt_nombre" type="text">
                    <label for="txt_nombre">Nombre</label>
                </div>
                <div id="carga_chekbox_cobertura">
                </div>
                <div class="center">
                    <input type="submit" class="btn black" value="Confirmar">
                    <button id="cancelar_mantenedor_coberturas" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/tipo-coberturas-functions.js"></script>
    <script>
    $(document).ready(function(){
        CargarTablaTipoCobertura();
        cargarCheckboxCoberturas();
        comprobarEstadoSesion();
        setInterval(function(){
            comprobarEstadoSesion();
            // CargarTablaTipoCobertura();
            // cargarCheckboxCoberturas();
        }, 60000);
        $('#modal_mantenedor_tipo_cobertura').modal({
            dismissible: false,
            onCloseEnd: function() {
            // $('input[name="coberturas_check"]').removeAttr('checked');
            $('#form_mantenedor_tipo_coberturas')[0].reset();
            $('#lbl_id_tipo_cobertura').text('');
            $('#accion_tipo_coberturas').text('Ingresar Tipo de cobertura');
            $('#mensaje_precaucion_tipo_cobertura').remove();
            }
        });
    });
    </script>
</body>
</html>