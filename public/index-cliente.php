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
        .content_coberturas{
            display: flex;
            height: 45px;
        }


        .content_rellenos{
            display: flex;
            height: 45px;
        }

        .radio_coberturas{
            font-size: 12px;
            padding: 2px;
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

        /* Diseño modal compra */

        .modal-titulo-eleccion-ingredientes{
            font-size: 15px;
            margin-bottom: 0;
            margin-top: 25px;
        }

        .lista-rolls-compra{
            font-size: 13px;
        }

        .pulse-button{
            transition: all 2s;
            color: #76ff03;
            animation-duration: 4s;
            animation-iteration-count: infinite;
        }
    </style>
</head>

<body>
    <?php require_once 'templates/nav-cliente.php';?>

    <div id="carga_promos_cliente" class="row">

    </div>

    <div id="modal_add_arma_tu_promo" class="modal">
        <div class="modal-content">

            <h5 class="center" id="accion_promo_compra"></h5>
            <form action="" name="form_arma_tu_promo" id="form_arma_tu_promo">
            <input type='hidden' id="lbl_id_promo_compra">
            <div>
                <ul id="lista_rolls_compra" class="lista-rolls-compra collection">
                    <li></li>
                </ul>
            </div>
                <p class="modal-titulo-eleccion-ingredientes">Coberturas (Elige una opción)</p>
                <div id="carga_chekbox_cobertura">
                </div>
                <p class="modal-titulo-eleccion-ingredientes">Rellenos (Elige uno de cada opción)</p>
                <div id="carga_chekbox_rellenos">
                </div>
                <div class="input-field cantidad-piezas">
                    <label class="active">Cantidad de piezas</label>
                    <select name="cantidad_de_piezas_add_carro" id="cantidad_de_piezas_add_carro" class="browser-default">

                    </select>
                    <a class="btn-small waves-effect waves-light red btn_add_roll_promo" id="btn_add_roll_promo"><i class="material-icons">add</i></a>
                </div>
                        
                <div class="center">
                    <input type="submit" class="btn black" value="Confirmar">
                    <button id="cancelar_arma_tu_promo_compra" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

     <div id="modal_promo_chef_compra" class="modal">
        <div class="modal-content">

            <h5 class="center" id="accion_promo_compra_chef"></h5>
            <form action="" name="form_arma_tu_promo_chef" id="form_arma_tu_promo_chef">
            <input type='hidden' id="lbl_id_promo_compra_chef">
                
                <div id="carga_chekbox_coberturas_chef">
                </div>
                        
                <div class="input-field center">
                    <input type="submit" class="btn black" value="Confirmar">
                    <button id="cancelar_promo_chef_compra" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <!-- <script src="src/js/es6/funciones-compra.js"></script> -->
    <script>
        $(document).ready(function() {
            cargarPromosCarta();
            comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
            }, 25000);
            $('#modal_add_arma_tu_promo').modal({
                dismissible: false,
                onCloseEnd: function() {
                $('#form_arma_tu_promo')[0].reset();
                $('#lbl_id_promo_compra').text('');
                $('#accion_promo_compra').text('Ingresar Cobertura');
                cantidadPiezasArmaTuPromo = 0;
                cantidadOpcionesCoberturas = 0;
                cantidadOpcionesRellenos = 0;
                arrayRollsCreados = [];
                $('#lista_rolls_compra').empty();
                }
            });
            $('#modal_promo_chef_compra').modal({
                dismissible: false,
                onCloseEnd: function() {
                $('#form_arma_tu_promo_chef')[0].reset();
                $('#lbl_id_promo_compra_chef').text('');
                $('#accion_promo_compra_chef').text('Ingresar Cobertura');
                cantidadPiezasArmaTuPromo = 0;
                cantidadOpcionesCoberturas = 0;
                cantidadOpcionesRellenos = 0;
                arrayRollsCreados = [];
                cantidadSeleccionCoberturasChef = 0;
                }
            });
            $('.dropdown-trigger').dropdown();
            // *Activa tabs
        });
    </script>
</body>

</html>