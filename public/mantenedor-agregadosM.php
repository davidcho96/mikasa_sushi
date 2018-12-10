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
    <title>Agregados Mikasa</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />

</head>
<body>
    <?php require 'templates/nav-admin.php' ?>

    <div class="row mantenedor-content">
        <div class="title_mantenedor center-align">
            <h1>Gestión agregados Mikasa
            <a class="btn-floating btn-large waves-effect waves-light red modal-trigger tooltipped" id="abrir_modal_agregado" href="#modal_mantenedor_agregado" data-position="bottom" data-tooltip="Añadir agregado"><i class="material-icons">add</i></a>
            </h1>
        </div>
        <div class="col l6 m6 s12">
            <label>Estado en carta</label>
            <select name="combo_estado_elemento_filtro" id="combo_estado_agregados_filtro" class="browser-default">
                <option value="">Todos</option>
            </select>
        </div>
        <div class="input-field col s12 m6 l6">
            <label for="txt_buscar_agregados">Buscar Agregados</label>
            <input type="text" id="txt_buscar_agregados">
        </div>
        
        <div id="mensaje_no_carta_agregados" class="col l12 m12 s12"></div>
        
        <div id="agregados_carga" class="row productos-content"></div>
        
        <div id="modal_mantenedor_agregado" class="modal">
            <div class="modal-content">
        
                <div id="content_mensaje_precaucion_agregados"></div>
        
                <h5 class="center" id="accion_agregados">Ingresar Agregado</h5>
                <form action="" name="form_mantenedor_agregado" id="form_mantenedor_agregado">
                <label id="lbl_id" class="lbl-id"></label>
                    <div class="input-field">
                        <input id="txt_nombre" name="txt_nombre" type="text">
                        <label for="txt_nombre">Nombre</label>
                    </div>
                    <div class="input-field">
                        <textarea id="txt_descripcion" class="materialize-textarea" name="txt_descripcion"></textarea>
                        <label for="txt_descripcion">Descripción</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_unidades" name="txt_unidades" type="number">
                        <label for="txt_unidades">Unidades</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_precio_agregado" name="txt_precio_agregado" type="number">
                        <label for="txt_precio_agregado">Precio</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_descuento_agregado" name="txt_descuento_agregado" type="number">
                        <label for="txt_descuento_agregado">Descuento (%)</label>
                        <p>Precio Descuento: <p id="precio_descuento_agregado"></p></p>
                    </div>
                    <div class="file-field input-field">
                        <div class="btn black">
                            <span>Imagen</span>
                            <input type="file" name="imagen_agregados" id="imagen_agregados" accept="image/x-png,image/jpg,image/jpeg">
                        </div>
                            <div class="file-path-wrapper">
                                <input class="file-path" type="text" id="imagen_agregados_text" name="imagen_agregados_text">
                            </div>
                    </div>
                    <div class="input-field">
                        <label class="active">Estado en carta</label>
                        <select name="combo_estado_elemento" id="combo_estado_elemento_form" class="browser-default">
                            
                        </select>
                    </div>
                    <div class="center">
                        <input type="submit" class="btn black" id="submit_mantenedor_agregados" value="Confirmar">
                        <button id="cancelar_actualizar_agregados" class="btn red">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="dist/js/script.min.js"></script>
    <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>
    <!-- <script src="src/js/es6/agregados-functions.js"></script> -->
    <script>
        $(document).ready(function(){
            cargarComboEstadoElemento();
            cargarMantenedorAgregados();
            cargarNotificaciones();
            comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
                cargarNotificaciones();
                // cargarMantenedorAgregados();
            }, 60000);
            $('#modal_mantenedor_agregado').modal({
                dismissible: false,
                onCloseEnd: function() {
                $('#form_mantenedor_agregado')[0].reset();
                $('#lbl_id').text('');
                $('#precio_descuento_agregado').text('');
                $('#accion_agregados').text('Ingresar Agregado');
                $('#mensaje_precaucion_agregados').remove();
                }
            });
        });
    </script>
</body>
</html>