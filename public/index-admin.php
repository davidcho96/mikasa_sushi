<?php 
session_start();

require 'templates/session.php';

$sesionUsuario = new Sesion();

$sesionUsuario->validarSesionMantenedores();

$sesionUsuario->validacionSesionAdmin();

?>


<!DOCTYPE html5>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Menú administrador.</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="dist/css/style.min.css">
    <style>
        .chart-img{
            border-radius: 8px;
        }
    </style>
</head>

<body>
    <?php require 'templates/nav-admin.php' ?>

    <div class="row">
        <div class="col l12 m12 s12 chart">
            <!-- <img src="https://thumbs.gfycat.com/IllegalWarmDowitcher-size_restricted.gif" class="chart-img" alt="" height="400px" width="100%"> -->
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script>
        $(document).ready(function(){
            cargarNotificaciones();
            comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
                cargarNotificaciones();
            },60000);
        });
    </script>
</body>

</html>