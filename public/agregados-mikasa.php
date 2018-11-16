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
    <title>Mikasa Clientes</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="dist/css/style.min.css">
</head>

<body>
    <?php require_once 'templates/nav-cliente.php';?>

    <div id="carga_agregados_cliente" class="row">

    </div>

    <script src="dist/js/script.min.js"></script>
    <!-- <script src="src/js/es6/funciones-agregados-carta.js"></script> -->
    <script>
        $(document).ready(function() {
            cargarAgregadosCarta();
            comprobarEstadoSesion();
            // setInterval(function(){
            //     comprobarEstadoSesion();
            // }, 25000);

            $('.dropdown-trigger').dropdown();
            // *Activa tabs
        });
    </script>
</body>

</html>