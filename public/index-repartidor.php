<?php 
    session_start();

    require 'templates/session.php';

    $sesionUsuario = new Sesion();

    $sesionUsuario->validarSesionMantenedores();

    $sesionUsuario->validacionSesionRepartidor();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mikasa Repartidor</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="dist/css/style.min.css">
    <link rel="stylesheet" href="../public/dist/css/leaflet.css" />
    <style>
        #map_repartidor{
            height: 300px;
            margin-bottom: 20px;
        }
        #map_recorrido_repartidor{
            height: 300px;
            margin-bottom: 20px;
        }
        .leaflet-routing-alternatives-container{
            display: none;
        }
        .leaflet-routing-alt {
            display: none;
        }
    </style>
</head>

<body>
    <?php require_once 'templates/nav-repartidor.php';?>

    <div class="row">
        <div class="col s12">
        <ul class="tabs">
            <li class="tab col s3"><a class="active" href="#test1">Entregas pendientes.</a></li>
            <li class="tab col s3"><a href="#test2">Mis entregas pendientes.</a></li>
        </ul>
        </div>
        <div id="test1" class="col s12">
            <div class="contenido-mantenedor row">
                <div class="col l12 m12 s12 center-align">
                    <div class="input-field col l4 m4 s12 right">
                        <input type="text" id="txt_buscar_entregas_pendientes" name="txt_buscar_entregas_pendientes">
                        <label for="txt_buscar_entregas_pendientes">Buscar Entrega Pendiente</label>
                    </div>
                    <div class="col l12 m12 s12">
                        <h5>Entregas pendientes del día</h5>
                    </div>
                    <div style="overflow-x:auto;" class="col l12 m12 s12">
                        <table id="tabla_entregas_pendientes_mikasa">
                        <thead>
                            <tr>
                                <th>Código Venta</th>
                                <th>Cliente</th>
                                <th>Dirección</th>
                                <th>Tipo Pago</th>
                                <th>Hora Entrega</th>
                                <th>Receptor</th>
                                <th>Valor</th>
                                <th>Estado Entrega</th>
                                <th>Horas de retraso</th>
                                <th colspan="2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="body_tabla_entregas_pendientes_repartidor_mikasa"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        
            <div id="modal_realizar_entrega_repartidor" class="modal">
                <div class="modal-content">
                    <h5 class="center">Información de entrega.</h5>
                    <form action="" name="form_realizar_entrega_mantenedor" id="form_realizar_entrega_mantenedor">
                        <ul class="collection" id="info_entrega_pendiente_repartidor">
        
                        </ul>
                        <div id="map_repartidor"></div>
                        <input type="hidden" id="txt_id_entrega_mapa">
                        <input type="hidden" id="txt_codigo_venta_mapa">
                        <div class="center">
                            <input type="submit" class="btn black" value="Confirmar">
                            <button id="cancelar_modal_realizar_entrega" class="btn red">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <div id="test2" class="col s12">
        <div class="contenido-mantenedor row">
                <div class="col l12 m12 s12 center-align">
                    <div class="input-field col l4 m4 s12 right">
                        <input type="text" id="txt_buscar_entregas_mis_pendientes" name="txt_buscar_entregas_mis_pendientes">
                        <label for="txt_buscar_entregas_mis_pendientes">Buscar Mis Entregas Pendientes</label>
                    </div>
                    <div class="col l12 m12 s12">
                        <h5>Mis entregas pendientes</h5>
                    </div>
                    <div style="overflow-x:auto;" class="col l12 m12 s12">
                        <table id="tabla_mis_entregas_pendientes_mikasa">
                        <thead>
                            <tr>
                                <th>Código Venta</th>
                                <th>Cliente</th>
                                <th>Dirección</th>
                                <th>Tipo Pago</th>
                                <th>Hora</th>
                                <th>Receptor</th>
                                <th>Valor</th>
                                <th>Estado Entrega</th>
                                <th colspan="4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="body_tabla__mis_entregas_pendientes_repartidor_mikasa"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        
            <div id="modal_recorrido_info_entrega_repartidor" class="modal">
                <div class="modal-content">
                    <h5 class="center">Información de entrega.</h5>
                    <form action="" name="form_finalizar_entrega_repartidor" id="form_finalizar_entrega_repartidor">
                        <ul class="collection" id="info_entrega_recorrido_repartidor">
        
                        </ul>
                        <div id="map_recorrido_repartidor"></div>
                        <input type="hidden" id="txt_id_entrega_realizada">
                        <input type="hidden" id="txt_codigo_entrega_realizada">
                        <div class="center">
                            <input type="submit" class="btn black" value="Finalizar Entrega">
                            <button id="cancelar_modal_recorrido_info_entrega" class="btn red">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div id="modal_ver_detalle_venta_entrega_repartidor" class="modal">
    <div class="modal-content">

        <h5 class="center">Detalle Venta</h5>
            <div id="cargar_detalle_venta_entrega_repartidor">
            </div>
        </form>
    </div>
    </div>

     <div id="modal_cancelar_entrega_repartidor" class="modal">
        <div class="modal-content">

            <h5 class="center" id="accion_tipo_coberturas">Selecciona el motivo del rechazo de la compra.</h5>
            <form action="" name="form_cancelar_entrega_repartidor" id="form_cancelar_entrega_repartidor">
            <input type="hidden" id="txt_id_entrega_cancelar_repartidor">
                <div>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivoCancelacionEntregaRepartidor" type="radio" checked value="1">
                        <span>Dirección no encontrada.</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivoCancelacionEntregaRepartidor" type="radio" value="2">
                        <span>No se encontraba receptor.</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivoCancelacionEntregaRepartidor" type="radio" value="3">
                        <span>El pago no pudo ser realizado.</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivoCancelacionEntregaRepartidor" type="radio" value="4"/>
                        <span>Otro.</span>
                        </label>
                    </p>
                </div>
                <div class="input-field col l12 m12 s12 hide" id="input_motivo_cancelacion_entrega_repartidor">
                    <input type="text" id="txt_motivo_cancelacion_entrega_repartidor" name="txt_motivo_cancelacion_entrega_repartidor">
                    <label for="txt_motivo_cancelacion_entrega_repartidor">Motivo de cancelación</label>
                </div>
                <div class="center">
                    <input type="submit" class="btn black" value="Confirmar">
                    <button id="cancelar_modal_cancelar_entrega_repartidor" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="src/js/leaflet.js"></script>
    <script src="src/js/leaflet-routing-machine.min.js"></script>
    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/entregas-functions.js"></script>
    <script>
        $(document).ready(function() {
            comprobarEstadoSesion();
            cargarTablaEntregasPendientesRepartidor();
            cargarTablaMisEntregasPendientesRepartidor();
            setInterval(function(){
                comprobarEstadoSesion();
                cargarTablaEntregasPendientesRepartidor();
                // cargarTablaMisEntregasPendientesRepartidor();
            }, 60000);

            $('#modal_recorrido_info_entrega_repartidor').modal({
                dismissible: true,
                onCloseEnd: function() {
                    // *Se limpia el intervalo para que se detenga la función de recargar ubicación actual
                    clearInterval(intervaloMapaRecorrido);
                    routingControl = null;
                    mapLlevarEntrega.remove();
                }
            });

            $('#modal_realizar_entrega_repartidor').modal({
                dismissible: true,
                onCloseEnd: function() {
                    // *Se limpia el intervalo para que se detenga la función de recargar ubicación actual
                    // clearInterval(intervaloMapaRecorrido);
                    routingControl = null;
                    mapInfoEntrega.remove();
                }
            });
        });
    </script>
</body>