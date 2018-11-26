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
</head>
<body>
    <?php require_once 'templates/nav-repartidor.php';?>    

    <div class="contenido-mantenedor row">
        <div class="col l12 m12 s12 center-align">
            <div class="input-field col l4 m4 s12 right">
                <input type="text" id="txt_buscar_mis_entregas" name="txt_buscar_mis_entregas">
                <label for="txt_buscar_mis_entregas">Buscar Entrega Pendiente</label>
            </div>
            <div class="col l12 m12 s12">
                <h5>Mis entregas realizadas</h5>
            </div>
            <div style="overflow-x:auto;" class="col l12 m12 s12">
                <table id="tabla_mis_entregas_realizadas_mikasa">
                <thead>
                    <tr>
                        <th>Código Venta</th>
                        <th>Cliente</th>
                        <th>Dirección</th>
                        <th>Fecha</th>
                        <th>Hora Solicitante</th>
                        <th>Receptor</th>
                        <th>Cliente</th>
                        <th>Tipo Pago</th>
                        <th>Valor</th>
                        <th>Hora Entrega</th>
                    </tr>
                </thead>
                <tbody id="body_tabla_mis_entregas_realizadas"></tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="src/js/leaflet.js"></script>
    <script src="src/js/leaflet-routing-machine.min.js"></script>
    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/entregas-functions.js"></script>
    <script>
        $(document).ready(function() {
            comprobarEstadoSesion();
            cargarTablaMisEntregasRealizadas();
            setInterval(function(){
                comprobarEstadoSesion();
                // cargarTablaMisEntregasRealizadas();
            }, 60000);
        });
    </script>
</body>