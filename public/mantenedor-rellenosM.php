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
    <title>Rellenos Mikasa</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="../node_modules/font-awesome/css/font-awesome.min.css">
</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="row mantenedor-content">
        <div class="title-mantenedor center-align">
            <h1>Gestión Rellenos Mikasa
            <a class="btn-floating btn-large waves-effect waves-light red modal-trigger tooltipped" data-position="bottom" data-tooltip="Añadir relleno" href="#modal_mantenedor_relleno"><i class="material-icons">add</i></a>
            </h1>
        </div>
        
        <div class="">
            <div class="col l6 m6 s12">
                <label>Estado en carta</label>
                <select name="combo_estado_elemento_filtro" id="combo_estado_rellenos_filtro" class="browser-default">
                </select>
            </div>
            <div class="input-field col l6 m6 s12">
                <label for="txt_buscar_rellenos">Buscar Rellenos</label>
                <input type="text" id="txt_buscar_rellenos">
            </div>
        </div>
        <div id="indice_relleno_carga" class='indices-carga'></div>
        <div id="mensaje_no_indice_rellenos"></div>
        <div id="mensaje_no_carta_rellenos"></div>
        <div id="rellenos_carga" class="row"></div>
        
        <div id="modal_mantenedor_relleno" class="modal">
            <div class="modal-content">
        
                <div id="content_mensaje_precaucion_rellenos"></div>
        
                <h5 class="center" id="accion_rellenos">Ingresar Relleno</h5>
                <form action="" name="form_mantenedor_relleno" id="form_mantenedor_relleno">
                <label id="lbl_id_rellenos" class="lbl-id"></label>
                    <div class="input-field">
                        <input id="txt_nombre" name="txt_nombre" type="text">
                        <label for="txt_nombre">Nombre</label>
                    </div>
                    <div class="input-field">
                        <textarea id="txt_descripcion" class="materialize-textarea" name="txt_descripcion"></textarea>
                        <label for="txt_descripcion">Descripción</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_precio_relleno" name="txt_precio_relleno" type="number">
                        <label for="txt_precio_relleno">Precio</label>
                    </div>
                    <div class="input-field">
                        <label class="active">Estado en carta</label>
                        <select name="combo_estado_elemento" id="combo_estado_relleno" class="browser-default">
                            
                        </select>
                    </div>
                    <div class="input-field">
                        <label class="active">Índice de elección</label>
                        <select name="combo_indice_relleno" id="combo_indice_relleno" class="browser-default">
                            
                        </select>
                    </div>
                    <div class="file-field input-field">
                        <div class="btn black">
                            <span>Imagen</span>
                            <input type="file" name="imagen_rellenos" id="imagen_rellenos" accept="image/x-png,image/jpg,image/jpeg">
                        </div>
                            <div class="file-path-wrapper">
                                <input class="file-path" type="text" id="imagen_rellenos_text" name="imagen_rellenos_text">
                            </div>
                    </div>
                    <div class="center">
                        <input type="submit" class="btn black" id="btn_mant_relleno" value="Confirmar">
                        <button id="cancelar_mantenedor_relleno" class="btn red">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>
    <script>
        $(document).ready(function(){
            cargarComboEstadoElemento()
            cargarMantenedorRellenos();
            cargarIndiceRelleno();
            cargarTotalIndiceRellenos();
            comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
                cargarMantenedorRellenos();
                cargarTotalIndiceRellenos();
            }, 25000);
            $('#modal_mantenedor_relleno').modal({
                dismissible: false,
                onCloseEnd: function() {
                $('#form_mantenedor_relleno')[0].reset();
                $('#lbl_id_rellenos').text('');
                $('#accion_rellenos').text('Ingresar Relleno');
                $('#mensaje_precaucion_rellenos').remove();
                }
            });
        });
    </script>
</body>
</html>
