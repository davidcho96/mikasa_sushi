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
    <title>Historial de Ventas.</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="../public/dist/css/leaflet.css" />

</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor center-align">
        <h1>Historial Ventas Mikasa</h1>
    </div>

    <div class="contenido-mantenedor row">
        <div class="col l12 m12 s12 center-align">
            <div class="col l12 m12 s12">
                <div class="input-field col l6 m6 s6">
                    <input type="text" id="txt_buscar_ventas_historial" name="txt_buscar_ventas_historial">
                    <label for="txt_buscar_ventas_historial">Buscar Venta</label>
                    <!-- //! Faltan filtros -->
                </div>
            </div>
            <h5>Historial de ventas</h5>
            <div style="overflow-x:auto;">
                <table id="tabla_historial_ventas_mikasa">
                <thead>
                    <tr>
                        <th>Código Venta</th>
                        <th>Cliente</th>
                        <th>Fecha/Hora</th>
                        <th>Tipo Entrega</th>
                        <th>Tipo Pago</th>
                        <th>Tipo Venta</th>
                        <th>Hora Entrega</th>
                        <th>Valor</th>
                        <th>Estado Venta</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody id="body_tabla_historial_ventas_mikasa"></tbody>
                </table>
            </div>
        </div>
    </div>

    <div id="modal_detalle_venta_historial" class="modal">
    <div class="modal-content">

        <h5 class="center">Detalle Venta</h5>
            <div id="cargar_detalle_venta_historial">
            </div>
        </form>
    </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/leaflet.js"></script>
    <script src="src/js/es6/funciones-compra-venta.js"></script>
    <script>
    $(document).ready(function(){
        cargarTablaHistorialVentas();
        cargarNotificaciones();
        comprobarEstadoSesion();
        setInterval(function(){
            comprobarEstadoSesion();
            cargarNotificaciones();
            // cargarTablaHistorialVentas();
        }, 60000);
    });
    </script>
</body>
</html>