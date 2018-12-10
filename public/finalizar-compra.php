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

        .datos-webpay-pago{
            display: flex;
            justify-content: space-between;
        }

    </style>

</head>

<body>
    <?php require_once 'templates/nav-cliente.php';?>

   <div class="row content-carro">
        <div class="col l8 m8 s12 carrito-items">
            <div class="consideraciones-compra col l12 m12 s12" >
                <p id="info_apertura"></p>
                <p id="estado_apertura"></p>
                <p id="precio_maximo"></p>
            </div>
            <form action="" id="form_compra_cliente">
            <div class="col l12 m12 s12 input-field center" style="margin-bottom: 40px;">
                <h5>Completa los datos de compra</h5>
            </div>
            <!-- <div class="input-field col l12 m12 s12">
                <label class="active">Tipo de Pago</label>
                <select name="combo_tipo_pago" id="combo_tipo_pago_form_cliente" class="browser-default">
                    
                </select>
            </div> -->
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
            <div id="direccion_content" class="hide">
                <div class="input-field col l9 m9 s9">
                    <input type="text" id="txt_direccion_entrega" name="txt_direccion_entrega">
                    <label for="txt_direccion_entrega">Dirección de entrega</label>
                </div>
                <div class="input-field col l3 m3 s3">
                    <input type="text" id="txt_direccion_numero" name="txt_direccion_numero">
                    <label for="txt_direccion_numero">Número</label>
                </div>
            </div>
            <div class="input-field col l12 m12 s12">
                <input type="text" id="txt_comentario_compra" name="txt_comentario_compra">
                <label for="txt_comentario_compra">Comentario adicional</label>
                <span class="helper-text">Añade un comentario adicional a la compra, sobre los ingredientes o algún otro factor.</span>
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
            <div class=" input-field col l12 m12 s12">
                <!-- <p>Selecciona un método de pago</p> -->
                <div>
                    <p class="radio_pago">
                        <label>
                            <input name="check_metodo_pago" id="check_metodo_pago" type="radio"/>
                            <span><img src="https://entienda.cl/wp-content/uploads/2013/06/webpayplus.jpg" alt="" height="55px" width="95px"></span><br>
                            <span>Pago electrónico a través de Webpay. Puedes utilizar tarjetas de Debito y Crédito (Mastercard, Visa, Magna, etc…)</span>
                        </label>
                    </p>
                </div>
            </div>
            <div class="col l12 m12 s12 center-align div_check">
                <div>
                    <p class="check_terminos">
                        <label>
                            <input type="checkbox" id="check_terminos_condiciones" name="check_terminos_condiciones"/>
                            <span>Acepto los <a class="modal-trigger" href="#modal_terminos_condiciones">términos y condiciones del servicio</a> de Mikasa.</span>
                        </label>
                    </p>
                    <div id="error_checkbox_terminos" class="center-align"></div>'
                </div>
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

        <div id="modal_terminos_condiciones" class="modal">
            <div class="modal-content">
                <h5>Términos y condiciones de uso</h5>
                <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia aut quibusdam ipsam quos nam pariatur error. Labore quo accusantium possimus quos officiis! Voluptatibus provident id aliquid alias quas quasi corrupti?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus optio consequatur, totam fuga, illum nihil quae, laborum et ut aperiam dolore aliquam recusandae nam quidem iste. Asperiores doloribus beatae ullam.
                </p>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">De acuerdo</a>
            </div>
        </div>
        <div id="modal_pago_webpay" class="modal">
            <div class="modal-content">
                <h5>Simulación servicio webpay <img src="https://entienda.cl/wp-content/uploads/2013/06/webpayplus.jpg" alt="" height="55px" width="95px"></h5>
                    <h5>Datos de la compra</h5>
                        <ul class="collection">
                            <li class="collection-item datos-webpay-pago">
                                <p>Monto de compra: </p>
                                <p id="precio_total_carrito_webpay"></p>
                            </li>
                            <li class="collection-item datos-webpay-pago">
                                <p>Saldo disponible: </p>
                                <p id="total_cartera_webpay"></p>
                            </li>
                        </ul>
                    <div class="input-field center">
                        <button class="btn black" id="btn_pagar_webpay">Pagar</button>
                    </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
            </div>
        </div>
   </div>

</div>

<script src="dist/js/script.min.js"></script>
<script src="src/js/es6/funciones-compra-venta.js"></script>
<script>
    $(document).ready(function() {
        // $('#modal_pago_webpay').modal('open');
        cargarDatosCarritoCompraFinalizarCompra();
        ObtenerPrecioTotalCarrito();
        comprobarEstadoSesion();
        ObtenerDineroCartera();
        // cargarComboBoxTipoPago();
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