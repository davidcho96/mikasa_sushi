<?php 
    session_start();

    require 'templates/session.php';

    $sesionUsuario = new Sesion();

    $sesionUsuario->validarSesionMantenedores();

    $sesionUsuario->validacionSesionCliente();

    date_default_timezone_set("America/Santiago");

    $horaActual = date('H:i');    

    $convertedTime = date('H:i',strtotime('+22 minutes',strtotime($horaActual)));
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
        .precio-carrito{
            padding: 5px 10px 15px 10px !important;
        }
        
        .items-carrito{
            display: flex;
            justify-content: space-between;
        }
        .carrito-items{
            padding: 0 10px 0 0 !important;
        }
        .content-carro {
            padding: 0 15px 0 15px;
        }

        .pin-card{
            position: absolute;
            right: 30px;
        }
    </style>

</head>

<body>
    <?php require_once 'templates/nav-cliente.php';?>

   <div class="row content-carro">
        <div class="col l8 m8 s12 carrito-items">
            <div class="consideraciones-compra col l12 m12 s12" >
                <p id="info_apertura"></p>
                <p id="precio_maximo"></p>
            </div>
            <form action="" id="form_compra_cliente">
            <div class="col l12 m12 s12">
                <h5>Completa los datos de compra</h5>
            </div>
            <div class="input-field col l12 m12 s12">
                <label class="active">Tipo de Pago</label>
                <select name="combo_tipo_pago" id="combo_tipo_pago_form_cliente" class="browser-default">
                    
                </select>
            </div>
            <div class="input-field col l6 m6 s12">
                <label class="active">Tipo de Entrega</label>
                <select name="combo_tipo_entrega" id="combo_tipo_entrega_form" class="browser-default">
                    
                </select>
            </div>
            <div class="input-field col l6 m6 s12">
                <input type="time" id="txt_hora_entrega" name="txt_hora_entrega" value=<?php echo $convertedTime ?>>
                <label for="txt_hora_entrega" class="active">Hora de entrega/retiro</label>
                <span class="helper-text">La hora debe ser al menos 20 minutos después de la hora actual.</span>
            </div>
            <div class="input-field col l12 m12 s12">
                <input type="text" id="txt_direccion_entrega" name="txt_direccion_entrega">
                <label for="txt_direccion_entrega">Dirección de entrega</label>
            </div>
            <div class="input-field col l12 m12 s12">
                <div id="check_receptor"></div>
                    <p>
                        <label>
                            <input type="radio" name="radio_receptor" value="1" checked>
                            <span>Yo</span>
                        </label>
                        <label>
                            <input type="radio" name="radio_receptor" value="2">
                            <span>Otra persona</span>
                        </label>
                    </p>
            </div>
            <div class="input-field col l12 m12 s12 hide" id="input_receptor_pedido">
                <input type="text" id="txt_nombre_receptor" name="txt_nombre_receptor">
                <label for="txt_nombre_receptor">Nombre de quién recibirá el producto</label>
            </div>
            <div class="input-field col l12 m12 s12 center">
                <input type="submit" class="btn black" value="Finalizar Compra">
            </div>
            </form>
        </div>

        <div id="totales_carrito" class="card-panel precio-carrito col l4 m4 s12">
            <div class="pin-card">
                <img src="dist/img/pin.png" alt="" height="42px" width="42px">
            </div>
        <h5>Resumen de mi compra</h5>
        <div class="divider"></div>
            <ul id="lista_productos_carrito" class="lista_productos_carrito collection">

            </ul>
        <div class="divider"></div>
        <div class="items-carrito">
            <p>Total: </p><p id="total_compra"></p>
            
        </div>
        <div id="content_mensaje_precaucion_despacho">
        <div class="mensaje-precaucion">
            <p><b>Importante!:</b> Recuerda que si el total de tu pedido no supera los $9990 solo podrás retirarlo en el local.</p>
        </div>
        </div>
        </div>
   </div>

</div>

<script src="dist/js/script.min.js"></script>
<script src="src/js/es6/funciones-compra-venta.js"></script>
<script>
    $(document).ready(function() {
        cargarDatosCarritoCompraFinalizarCompra();
        ObtenerPrecioTotalCarrito();
        comprobarEstadoSesion();
        cargarComboBoxTipoPago();
        cargarComboBoxTipoEntrega();
        CargarDatosInfoEmpresaIndex();
        cargarPrecioMaximoCompra();
        setInterval(function(){
            comprobarEstadoSesion();
        }, 60000);

        $('.dropdown-trigger').dropdown();
        // *Activa tabs
    });
</script>
</body>

</html>