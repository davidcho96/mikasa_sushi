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
    <title>Ingredientes Mikasa</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="row mantenedor-content">
        <div class="title-mantenedor center-align">
            <h1>Gestión Ingredientes Mikasa
            <a class="btn-floating btn-large waves-effect waves-light red modal-trigger tooltipped" href="#modal_mantenedor_ingrediente" data-position="bottom" data-tooltip="Añadir ingrediente"><i class="material-icons">add</i></a>
            </h1>
        </div>

        
        <div id="mensaje_no_stock_ingredientes" class="col l12 m12 s12"></div>
        <div class="contenido-mantenedor row container">
        <div class="col l12 m12 s12">
            <div class="input-field col l6 m6 s12">
                <label for="txt_buscar_ingrediente">Buscar Ingrediente</label>
                <input type="text" id="txt_buscar_ingrediente">
            </div>
            <div class="col l12 s12 m12">
                <div style="overflow-x:auto;">
                    <table id="tabla_ingredientes">
                    <thead>
                        <h5>Ingredientes</h5>
                        <tr>
                            <td>Ingrediente</td>
                            <td>Stock Disponible</td>
                            <td>Cantidad por roll</td>
                            <td>Cantidad Minima</td>
                            <td colspan='2'>Acciones</td>
                        </tr>
                    </thead>
                    <tbody id="body_tabla_ingredientes"></tbody>
                    </table>
                </div>
            </div>
            </div>
        </div>
        
        <div id="modal_mantenedor_ingrediente" class="modal">
            <div class="modal-content">
        
                <div id="content_mensaje_precaucion_ingrediente"></div>
        
                <h5 class="center" id="accion_ingredientes">Ingresar Ingrediente</h5>
                <form action="" name="form_mantenedor_ingrediente" id="form_mantenedor_ingrediente">
                <label id="lbl_id_ingrediente" class="lbl-id"></label>
                    <div class="input-field col l12 m12 s12">
                        <input id="txt_nombre_ingrediente" name="txt_nombre_ingrediente" type="text">
                        <label for="txt_nombre_ingrediente">Nombre</label>
                    </div>
                    <div class="input-field col l8 m8 s6">
                        <input id="txt_cantidad_stock" name="txt_cantidad_stock" type="number">
                        <label for="txt_cantidad_stock">Cantidad en stock</label>
                    </div>
                    <div class="input-field col l4 m4 s6">
                        <label class="active">Medida Stock</label>
                        <select name="combo_unidad_medida_stock" id="combo_unidad_ingrediente_stock" class="browser-default">
                            
                        </select>
                    </div>
                    <div class="input-field col l12 m12 s12">
                        <input id="txt_cantidad_minima" name="txt_cantidad_minima" type="number">
                        <label for="txt_cantidad_minima">Cantidad Minima</label>
                    </div>
                    <div class="input-field col l12 m12 s12">
                        <input id="txt_cantidad_uso_roll" name="txt_cantidad_uso_roll" type="number">
                        <label for="txt_cantidad_uso_roll">Cantidad uso en roll</label>
                    </div>
                    <div class="center input-field col l12">
                        <input type="submit" class="btn black" id="btn_mantenedor_ingrediente" value="Confirmar">
                        <button id="cancelar_mantenedor_ingrediente" class="btn red">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>
    <!-- <script src="src/js/es6/ingredientes-functions.js"></script> -->

    <script>
        $(document).ready(function(){
            cargarNotificaciones();
            cargarComboUnidadMedida();
            CargarTablaIngredientes();
            comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
                cargarNotificaciones();
            }, 60000);
            $('#modal_mantenedor_ingrediente').modal({
                dismissible: false,
                onCloseEnd: function() {
                $('#form_mantenedor_ingrediente')[0].reset();
                $('#lbl_id_ingrediente').text('');
                $('#accion_ingredientes').text('Ingresar Ingrediente');
                $('#mensaje_precaucion_ingrediente').remove();
                }
            });
        });
    </script>
</body>
</body>
</html>
