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
    <?php require 'templates/nav-admin.php' ?>
    <div class="row mantenedor-content">
        <div class="title-mantenedor center-align">
            <h1>Gestión Coberturas Mikasa
            <a class="btn-floating btn-large waves-effect waves-light red modal-trigger tooltipped" href="#modal_mantenedor_cobertura" data-position="bottom" data-tooltip="Añadir cobertura"><i class="material-icons">add</i></a>
            </h1>
        </div>
        
        <div>
            <div class="col l6 m6 s12">
                <label>Estado en carta</label>
                <select name="combo_estado_elemento_filtro" id="combo_estado_coberturas_filtro" class="browser-default">
                </select>
            </div>
            <div class="input-field col l6 m6 s12">
                <label for="txt_buscar_coberturas">Buscar Cobertura</label>
                <input type="text" id="txt_buscar_coberturas">
            </div>
        </div>
        
        <div id="mensaje_no_indice_cobertura" class="col l12 m12 s12"></div>
        <div id="mensaje_no_carta_cobertura" class="col l12 m12 s12"></div>
        <div id="indice_cobertura_carga" class='indices-carga col l12 m12 s12'></div>
        <div id="coberturas_carga" class="row">
        </div>
        
        <div id="modal_mantenedor_cobertura" class="modal">
            <div class="modal-content">
        
                <div id="content_mensaje_precaucion_coberturas"></div>
        
                <h5 class="center" id="accion_coberturas">Ingresar Agregado</h5>
                <form action="" name="form_mantenedor_cobertura" id="form_mantenedor_cobertura">
                <label id="lbl_id_cobertura" class="lbl-id"></label>
                    <div class="input-field">
                        <input id="txt_nombre" name="txt_nombre" type="text">
                        <label for="txt_nombre">Nombre</label>
                    </div>
                    <div class="input-field">
                        <textarea id="txt_descripcion" class="materialize-textarea" name="txt_descripcion"></textarea>
                        <label for="txt_descripcion">Descripción</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_precio_cobertura" name="txt_precio_cobertura" type="number">
                        <label for="txt_precio_cobertura">Precio</label>
                    </div>
                    <div class="input-field">
                        <label class="active">Estado en carta</label>
                        <select name="combo_estado_elemento" id="combo_estado_cobertura" class="browser-default">
                            
                        </select>
                    </div>
                    <div class="input-field">
                        <label class="active">Índice de elección</label>
                        <select name="combo_indice_cobertura" id="combo_indice_cobertura" class="browser-default">
                            
                        </select>
                    </div>
                    <div class="file-field input-field">
                        <div class="btn black">
                            <span>Imagen</span>
                            <input type="file" name="imagen_coberturas" id="imagen_coberturas" accept="image/x-png,image/jpg,image/jpeg">
                        </div>
                            <div class="file-path-wrapper">
                                <input class="file-path" type="text" id="imagen_coberturas_text" name="imagen_coberturas_text">
                            </div>
                    </div>
                    <div class="center">
                        <input type="submit" class="btn black" id="btn_mantenedor_cobertura" value="Confirmar">
                        <button id="cancelar_mantenedor_cobertura" class="btn red">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>

    <!-- <script src="src/js/es6/coberturas-functions.js"></script> -->
    <script>
        $(document).ready(function(){
            cargarComboEstadoElemento();
            cargarMantenedorCoberturas();
            cargarIndiceCobertura();
            cargarTotalIndiceCoberturas();
            comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
                cargarMantenedorCoberturas();
                cargarTotalIndiceCoberturas();
            }, 25000);
            $('#modal_mantenedor_cobertura').modal({
                dismissible: false,
                onCloseEnd: function() {
                $('#form_mantenedor_cobertura')[0].reset();
                $('#lbl_id_cobertura').text('');
                $('#accion_coberturas').text('Ingresar Cobertura');
                $('#mensaje_precaucion_coberturas').remove();
                }
            });
        });
    </script>
</body>
</body>
</html>
