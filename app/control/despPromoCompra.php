<?php

require '../clases/promoCompra.php';
require '../clases/carrito.php';
require '../clases/venta.php';
require "../clases/inputValidate.php"; //*Clase input para validación de campos

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $validate = new Input();

    $promocompra = new PromoCompra();

    $carrito = new Carrito();

    $venta = new Venta();

    function array_push_assoc(&$array, $key, $value){
        $array[$key] = $value;
        return $array;
    }

    switch($_REQUEST['action']){
        case 'IngresarPromoCompra':
        
        $arraypromocompra = json_decode($_POST['rollscompra']);
        // *Los rolls creados se convierten en array
        // *Se setean como array a la clase
        
        $promocompra->setRollsCompra($arraypromocompra);
        
        $promocompra->setIdPromo($_POST['id_promo']);
        
        if($carrito->generarCarritoCliente($_SESSION['user'][1])){
            // *Se comprueba la existencia de la sesión
            echo $promocompra->ingresarPromoCompra($_SESSION['user'][1]);
        }else {
            echo 2;
            // *La sesión no existe
        }
        break;

        case 'IngresarAgregadoCarrito':
            
            $promocompra->setIdAgregados($_POST['idAgregado']);
            
            if($carrito->generarCarritoCliente($_SESSION['user'][1])){
                // *Se comrpueba la existencia de la sesión
                echo $promocompra->ingresarAgregadoCarrito($_SESSION['user'][1]);
            }else {
                echo 2;
                // *La sesión no existe
            }
        break;

        case 'EliminarAgregadoCarrito':
            echo $promocompra->eliminarAgregadoCarrito($_POST['idDetalle'], $_SESSION['user'][1]);
        break;

        case 'EliminarPromoCarrito':
            echo $promocompra->eliminarPromoCarrito($_POST['idDetalle'], $_SESSION['user'][1]);
        break;

        case 'ObtenerDatosCarrito':
        echo $carrito->obtenerDatosCarrito($_SESSION['user'][1]);
        break;

        case 'ObtenerDatosAgregadosCarrito':
        echo $carrito->obtenerDatosAgregadosCarrito($_SESSION['user'][1]);
        break;

        case 'IngresarPromoCompraChef':
        
        $arraypromocompra = json_decode($_POST['rollscompra']);
            // *Los rolls compra creados se transforman en array 
            // *Se setean como array al atributo de la clase

        $promocompra->setIdPromo($_POST['id_promo']);
        
        $arrayCoberturas = json_decode($promocompra->cargarCoberturasPromoUnaOpcion());
        // *Se obtienen las coberturas de los tipo de coberturas qu solo poseen una opción
        // *Los tipo de coberturas están vinculados a la promo de tipo a gusto del chef
        
        for ($i=0; $i < sizeof($arraypromocompra); $i++) { 
            array_push($arrayCoberturas, $arraypromocompra[$i]);
            // *Se añaden esos rolls al array con los rolls creados por el cliente
        }
        
        
        if($carrito->generarCarritoCliente($_SESSION['user'][1])){
            // *Se comprueba la existencia de la sesión
            $promocompra->setRollsCompra($arrayCoberturas);
            echo $promocompra->ingresarPromoCompraChef($_SESSION['user'][1]);
        }else {
            echo 2;
            // *La sesión no existe
        }
        break;

        case 'ConsultarFactibilidadCompra':
            echo $venta->consultarFactibilidadCompra($_SESSION['user'][1]);
        break;

        case 'GenerarVenta':
            if(isset($_SESSION['user'])){
                if($validate->check(['hora_entrega', 'receptor'], $_REQUEST)){
                    $comentario = '';
                    $idTipoPago = $_POST['tipo_pago'];
                    $idTipoEntrega = $_POST['tipo_entrega'];
                    $horaEntrega = $_POST['hora_entrega'];
                    $direccion = '';
                    $receptor = $_POST['receptor'];
                    if($_POST['comentario'] != '' || $_POST['comentario'] != null){
                        // *Si existe un comentario asociado a la venta este se valida
                        $comentario = $validate->str($_POST['comentario'], '100', '3');
                    }

                    if($_POST['direccion_entrega'] != '' || $_POST['direccion_entrega'] != null){
                        // *Si existe un comentario asociado a la venta este se valida
                        $direccion = $validate->str($_POST['direccion_entrega'], '100', '3');
                    }

                    $arrPromoCompra = $carrito->obtenerDetallePromoCompraCarrito($_SESSION['user'][1]);
                    // *Se obtienen las promo compra creadas del carrito del usuario
                    // *Para luego ingresarlas al detalle de la venta

                    $arrAgregados = $carrito->obtenerDetalleAgregadosCarrito($_SESSION['user'][1]);
                    // *Se obtienen los agregados del carrito del usuario
                    // *Para luego ingresarlas al detalle de la venta

                    $venta->setComentario($comentario);
                    $venta->setDetallePromoCompra($arrPromoCompra);
                    $venta->setDetalleAgregados($arrAgregados);
                    $venta->setIdTipoPago($idTipoPago);
                    $venta->setIdTipoEntrega($idTipoEntrega);
                    $venta->setDireccion($direccion);
                    $venta->setHora($horaEntrega);
                    $venta->setReceptor($receptor);

                    echo $venta->ingresarVenta($_SESSION['user'][1]);
                }
            }
        break;

        case 'ObtenerPrecioTotalCarrito':
            echo $carrito->obtenerPrecioTotalCarrito($_SESSION['user'][1]);
        break;

        case 'ValidarFechaCompra':
            $venta->setHora($_POST['horaEntrega']);
            echo $venta->validarFechaCompra();
        break;
        case 'ObtenerDineroCartera':
            echo $carrito->obtenerDineroCartera();
        break;
    }
}