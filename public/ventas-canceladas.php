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
    <title>Ventas Canceladas.</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="../public/dist/css/leaflet.css" />

</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor center-align">
        <h1>Ventas Mikasa</h1>
    </div>

    <div class="contenido-mantenedor row">
        <div class="col l12 m12 s12 center-align">
            <div class="col l12 m12 s12">
                <div class="input-field col l6 m6 s6">
                    <input type="text" id="txt_buscar_ventas_canceladas" name="txt_buscar_ventas_canceladas">
                    <label for="txt_buscar_ventas_canceladas">Buscar Venta</label>
                    <!-- //! Faltan filtros -->
                </div>
            </div>
            <h5>Ventas canceladas</h5>
            <div style="overflow-x:auto;">
                <table id="tabla_ventas_mikasa">
                <thead>
                    <tr>
                        <td>Código Venta</td>
                        <td>Cliente</td>
                        <td>Fecha/Hora</td>
                        <td>Tipo Entrega</td>
                        <td>Tipo Pago</td>
                        <td>Valor</td>
                        <td>Motivo</td>
                        <td>Empleado</td>
                        <td>Detalle</td>
                    </tr>
                </thead>
                <tbody id="body_tabla_ventas_canceladas_mikasa"></tbody>
                </table>
            </div>
        </div>
    </div>

    <div id="modal_detalle_venta_cancelada" class="modal">
    <div class="modal-content">

        <h5 class="center">Detalle Venta</h5>
            <div id="cargar_detalle_venta_cancelada">
            </div>
    </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/leaflet.js"></script>
    <script src="src/js/es6/funciones-compra-venta.js"></script>
    <script>
    $(document).ready(function(){
        cargarNotificaciones();
        cargarTablaVentasCanceladas();
        comprobarEstadoSesion();
        setInterval(function(){
            comprobarEstadoSesion();
            cargarNotificaciones();
            // cargarTablaVentasCanceladas();
        }, 60000);
        // $('#modal_mantenedor_aceptar_compra').modal({
        //     dismissible: false,
        //     onCloseEnd: function() {
        //     $('#txt_id_compra_mapa').val(0);
        //     markerMap = '';
        //     }
        // });
    });
    </script>
</body>
</html>