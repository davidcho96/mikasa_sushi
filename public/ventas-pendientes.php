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
        <h1>Ventas Mikasa</h1>
    </div>

    <div class="contenido-mantenedor row">
        <div class="col l12 m12 s12 center-align">
            <div class="input-field">
                <input type="text" id="txt_buscar_ventas" name="txt_buscar_ventas">
                <label for="txt_buscar_ventas">Buscar Venta</label>
            </div>
            <h5>Últimas ventas del día</h5>
            <div style="overflow-x:auto;">
                <table id="tabla_ventas_mikasa">
                <thead>
                    <tr>
                        <td>Código Venta</td>
                        <td>Cliente</td>
                        <td>Fecha/Hora</td>
                        <td>Tipo Entrega</td>
                        <td>Tipo Pago</td>
                        <td>Tipo Venta</td>
                        <td>Hora Entrega</td>
                        <td>Valor</td>
                        <td>Estado Venta</td>
                        <td colspan='3'>Acciones</td>
                    </tr>
                </thead>
                <tbody id="body_tabla_ventas_mikasa"></tbody>
                </table>
            </div>
        </div>
    </div>

    <div id="modal_mantenedor_cancelar_compra" class="modal">
        <div class="modal-content">

            <h5 class="center" id="accion_tipo_coberturas">Selecciona el motivo del rechazo de la compra.</h5>
            <form action="" name="form_cancelar_venta" id="form_cancelar_venta">
            <input type="hidden" id="txt_id_venta_cancelar">
                <div>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivo" type="radio" checked value="1">
                        <span>Dirección no específica.</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivo" type="radio" value="2">
                        <span>No hay disponibilidad de envío.</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivo" type="radio" value="3">
                        <span>El local está cerrado.</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivo" type="radio" value="4"/>
                        <span>Otro.</span>
                        </label>
                    </p>
                </div>
                <div class="input-field col l12 m12 s12 hide" id="input_motivo_cancelacion">
                    <input type="text" id="txt_motivo_cancelación" name="txt_motivo_cancelación">
                    <label for="txt_motivo_cancelación">Motivo de cancelación</label>
                </div>
                <div class="center">
                    <input type="submit" class="btn black" value="Confirmar">
                    <button id="cancelar_modal_canc_compra" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <div id="modal_mantenedor_aceptar_compra" class="modal">
        <div class="modal-content">

            <h5 class="center">Selecciona la ubicación de la entrega.</h5>
            <form action="" name="form_aceptar_compra" id="form_aceptar_compra">
                    <div id="map"></div>
                <input type="hidden" id="txt_id_compra_mapa">
                <input type="hidden" id="txt_entrega_compra_mapa">
                <input type="hidden" id="txt_codigo_compra_mapa">
                <div class="center">
                    <input type="submit" class="btn black" value="Confirmar">
                    <button id="cancelar_modal_aceptar_compra" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <div id="modal_detalle_venta_pendientes" class="modal">
    <div class="modal-content">

        <h5 class="center">Detalle Venta</h5>
            <div id="cargar_detalle_venta">
            </div>
        </form>
    </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/leaflet.js"></script>
    <script src="src/js/es6/funciones-compra-venta.js"></script>
    <script>
    $(document).ready(function(){
        CargarTablaVentasPendientes();
        comprobarEstadoSesion();
        setInterval(function(){
            comprobarEstadoSesion();
            // CargarTablaVentasPendientes();
        }, 60000);
        $('#modal_mantenedor_aceptar_compra').modal({
            dismissible: false,
            onCloseEnd: function() {
            $('#txt_id_compra_mapa').val(0);
            markerMap = '';
            mapVenta.remove();
            }
        });
        $('#modal_mantenedor_cancelar_compra').modal({
            dismissible: false,
            onCloseEnd: function() {
            $('#txt_id_venta_cancelar').val('');
            $('#form_cancelar_venta')[0].reset();
            }
        });
    });
    </script>
</body>
</html>