<?php 
    session_start();

    require 'templates/session.php';

    $sesionUsuario = new Sesion();

    $sesionUsuario->validarSesionMantenedores();

    $sesionUsuario->validacionSesionCliente();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mis Compras.</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor center-align">
        <h1>Mis historial de compras.</h1>
    </div>

    <div class="contenido-mantenedor row">
        <div class="col l12 m12 s12 center-align">
            <table id="tabla_compras_pendientes_mikasa">
            <thead>
                <h5 class="left">Compras pendientes.</h5>
                <tr>
                    <td>Código Venta</td>
                    <td>Cliente</td>
                    <td>Fecha/Hora</td>
                    <td>Tipo Entrega</td>
                    <td>Tipo Pago</td>
                    <td>Tipo Venta</td>
                    <td>Hora Entrega</td>
                    <td>Valor</td>
                    <td colspan='3'>Acciones</td>
                </tr>
            </thead>
            <!-- <tbody id="body_tabla_ventas_mikasa"></tbody> -->
            </table>
        </div>
        <div class="divider"></div>
        <div class="col l12 m12 s12 center-align">
            <h5 class="left">Mi historial de compras.</h5>
            <div class="input-field col l12">
                <label for="txt_buscar_compras">Buscar Compra</label>
                <input type="text" id="txt_buscar_compras">
            </div>
            <table id="tabla_compras_mikasa">
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
                    <td colspan='3'>Acciones</td>
                </tr>
            </thead>
            <tbody id="body_tabla_mis_compras_mikasa"></tbody>
            </table>
        </div>
    </div>

    <div id="modal_mantenedor_cancelar_compra" class="modal">
        <div class="modal-content">

            <h5 class="center" id="accion_tipo_coberturas">Selecciona el motivo del rechazo de la compra.</h5>
            <form action="" name="form_mantenedor_tipo_coberturas" id="form_mantenedor_tipo_coberturas">
            <input type="hidden" id="txt_id_compra">
                <div>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivo" type="radio" checked value="1"/>
                        <span>Dirección no específica.</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivo" type="radio" value="2"/>
                        <span>No hay disponibilidad de envío.</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="radioMotivo" type="radio" value="3"/>
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

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/funciones-compra-venta.js"></script>
    <script>
    $(document).ready(function(){
        CargarTablaIngredientes();
    //     cargarCheckboxCoberturas();
    //     comprobarEstadoSesion();
    //     setInterval(function(){
    //         comprobarEstadoSesion();
    //         CargarTablaTipoCobertura();
    //         // cargarCheckboxCoberturas();
    //     }, 25000);
    //     $('#modal_mantenedor_tipo_cobertura').modal({
    //         dismissible: false,
    //         onCloseEnd: function() {
    //         // $('input[name="coberturas_check"]').removeAttr('checked');
    //         $('#form_mantenedor_tipo_coberturas')[0].reset();
    //         $('#lbl_id_tipo_cobertura').text('');
    //         $('#accion_tipo_coberturas').text('Ingresar Tipo de cobertura');
    //         $('#mensaje_precaucion_tipo_cobertura').remove();
    //         }
    //     });
    });
    </script>
</body>
</html>