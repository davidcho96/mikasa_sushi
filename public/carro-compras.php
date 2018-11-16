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

    <style>
        .eliminar-carro{
            position: absolute;
            right: 0px;
            top: 10px;
            z-index: 1000;
        }
        .content-carrito {
            padding: 0 15px 0 15px;
        }
        .precio-carrito{
            padding: 5px 10px 15px 10px !important;
        }
        .carrito-items{
            padding: 0 10px 0 0 !important;
        }

        .collapsible-text{
            padding: 15px;
            align-self: center;
            width: 100%;
        }

        .collapsible-price{
            display: flex;
            align-self: flex-end;
        }
        .collapsible-price p{
            margin-bottom: 0;
            padding: 5px;
            font-size: 14px;
        }
        .precio-total-carrito{
            display: flex;
            justify-content: space-between;
        }

        .collapsible-header{
            position: relative;
        }
    </style>
</head>

<body>
    <?php require_once 'templates/nav-cliente.php';?>

    <div class="content-carrito  row">
        <div  class="carrito-items col l8 m8 s12">
            <ul class="collection" id="carga_items_carrito">
            </ul>
        </div>
        <div id="totales_carrito" class="card-panel precio-carrito col l4 m4 s12">
        <h5>Resumen de mi compra</h5>
        <div class="divider"></div>
        <div class="precio-total-carrito">
            <p>Total: </p><p id="total_compra_carro"></p>
        </div>
        <div class="divider"></div>
        <div class="input-field center">
            <a class="btn black" href="finalizar-compra.php">Ir a compra</a>
        </div>
        <div id="content_mensaje_precaucion_despacho">
        <div class="mensaje-precaucion">
            <p><b>Importante!:</b> Recuerda que si el total de tu pedido no supera los $9990 solo podrás retirarlo en el local.</p>
        </div>
        </div>
    </div>


    <script src="dist/js/script.min.js"></script>
    <!-- <script src="src/js/es6/carrito-function.js"></script> -->
    <script>
        $(document).ready(function() {
            $('.collapsible').collapsible();
            ObtenerPrecioTotalCarrito();
            cargarDatosCarrito();
            cargarAgregadosCarrito();
            comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
            }, 25000);
        });
    </script>
</body>

</html>