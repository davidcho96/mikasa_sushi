<?php 
session_start();

require 'templates/session.php';

$sesionUsuario = new Sesion();

$sesionUsuario->validarSesionMantenedores();

$sesionUsuario->validacionSesionCliente();
// $sesionUsuario->validarEstadoSesion();
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
        .content_coberturas{
            display: flex;
            height: 45px;
        }

        .radio_coberturas{
            padding: 2px;
        }

        .content_rellenos{
            display: flex;
            height: 45px;
        }

        .radio_rellenos{
            padding: 2px;
        }

        .cantidad-piezas{
            margin-top: 40px;
            display: flex;
        }

        .btn_add_roll_promo{
            margin-left: 10px;
        }
    </style>
</head>

<body>
    <?php require_once 'templates/nav-cliente.php';?>

    <div id="carga_promos_cliente" class="row">

    </div>

    <div id="modal_add_arma_tu_promo" class="modal">
        <div class="modal-content">

            <h5 class="center" id="accion_tipo_coberturas">Arma tu promo</h5>
            <form action="" name="form_arma_tu_promo" id="form_arma_tu_promo">
            <label id="lbl_id_promo" class="lbl-id"></label>
            <div>
                <ul id="lista_rolls_compra">
                    <li></li>
                </ul>
            </div>
                <p>Coberturas (Elige uno de cada opción)</p>
                <div id="carga_chekbox_cobertura">
                </div>
                <p>Rellenos (Elige uno de cada opción)</p>
                <div id="carga_chekbox_rellenos">
                </div>
                <div class="input-field cantidad-piezas">
                    <label class="active">Cantidad de piezas</label>
                    <select name="cantidad_de_piezas_add_carro" id="cantidad_de_piezas_add_carro" class="browser-default">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                    <a class="btn-small waves-effect waves-light red btn_add_roll_promo" id="btn_add_roll_promo"><i class="material-icons">add</i></a>
                </div>
                        
                <div class="center">
                    <input type="submit" class="btn black" value="Confirmar">
                    <button id="cancelar_mantenedor_coberturas" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/funciones-compra.js"></script>
    <script>
        $(document).ready(function() {
            cargarPromosCarta();
            comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
            }, 25000);
            $('.dropdown-trigger').dropdown();
            // *Activa tabs
        });
    </script>
</body>

</html>