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
    <title>Mis Órdenes.</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
</head>
<body>
    <?php require 'templates/nav-cliente.php' ?>
    <div class="title-mantenedor center-align">
        <h1>Mis Órdenes.</h1>
    </div>

    <div id="cargar_tracking_mis_ordenes" class="container">
        
    </div>

    <div id="modal_detalle_venta_tracking" class="modal">
        <div class="modal-content">

            <h5 class="center">Detalle Venta</h5>
                <div id="cargar_detalle_venta_tracking">
                </div>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/funciones-compra-venta.js"></script>
    <script>
    $(document).ready(function(){
        cargarTrackingMisOrdenes();
        comprobarEstadoSesion();
    //     cargarCheckboxCoberturas();
    //     comprobarEstadoSesion();
        setInterval(function(){
            comprobarEstadoSesion();
            // CargarTablaTipoCobertura();
            // cargarCheckboxCoberturas();
        }, 60000);
        // $('#modal_mantenedor_tipo_cobertura').modal({
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