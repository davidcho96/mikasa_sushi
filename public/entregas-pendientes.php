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
    <title>Ventas Pendientes.</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="../public/dist/css/leaflet.css" />
    
    <style>
        #map{
            height: 340px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor center-align">
        <h1>Entregas Pendientes Mikasa</h1>
    </div>

    <div class="contenido-mantenedor row">
        <div class="col l12 m12 s12 center-align">
            <div class="input-field">
                <input type="text" id="txt_buscar_entregas_pendientes" name="txt_buscar_entregas_pendientes">
                <label for="txt_buscar_entregas_pendientes">Buscar Entrega Pendiente</label>
            </div>
            <h5>Últimas ventas del día</h5>
            <div style="overflow-x:auto;">
                <table id="tabla_entregas_pendientes_mikasa">
                <thead>
                    <tr>
                        <th>Código Venta</th>
                        <th>Cliente</th>
                        <th>Dirección</th>
                        <th>Tipo Entrega</th>
                        <th>Tipo Pago</th>
                        <th>Hora Entrega</th>
                        <th>Receptor</th>
                        <th>Valor</th>
                        <th>Estado Entrega</th>
                        <th colspan="2">Acciones</th>
                    </tr>
                </thead>
                <tbody id="body_tabla_entregas_pendientes_mikasa"></tbody>
                </table>
            </div>
        </div>
    </div>

    <div id="modal_cambiar_estado_entrega" class="modal">
        <div class="modal-content">

            <h5 class="center">Selecciona el estado de entrega.</h5>
            <form action="" name="form_actualizar_estado_entrega_admin_venta" id="form_actualizar_estado_entrega_admin_venta">
            <input type="hidden" id="txt_id_entrega_admin">
                <div id="cargar_opciones_estado_entrega">
                </div>
                <div class="center">
                    <input type="submit" class="btn black" value="Confirmar">
                    <button id="cancelar_modal_canc_compra" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="src/js/leaflet.js"></script>
    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/entregas-functions.js"></script>
    <script>
    $(document).ready(function(){
    $('.tooltipped').tooltip();
        cargarTablaEntregasPendientes();
        comprobarEstadoSesion();
        setInterval(function(){
            comprobarEstadoSesion();
            // cargarTablaEntregasPendientes();
        }, 60000);
        // $('#modal_mantenedor_aceptar_compra').modal({
        //     dismissible: false,
        //     onCloseEnd: function() {
        //     $('#txt_id_compra_mapa').val(0);
        //     markerMap = '';
        //     }
        // });
        // $('#modal_mantenedor_cancelar_compra').modal({
        //     dismissible: false,
        //     onCloseEnd: function() {
        //     $('#txt_id_venta_cancelar').val('');
        //     $('#form_cancelar_venta')[0].reset();
        //     }
        // });
    });
    </script>
</body>
</html>