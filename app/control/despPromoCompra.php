<?php

require '../clases/promoCompra.php';
require '../clases/carrito.php';
require '../clases/venta.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

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
        
        $promocompra->setRollsCompra($arraypromocompra);
        
        $promocompra->setIdPromo($_POST['id_promo']);
        
        if($carrito->generarCarritoCliente($_SESSION['user'][1])){
            echo $promocompra->ingresarPromoCompra($_SESSION['user'][1]);
        }else {
            echo 2;
        }
        break;

        case 'IngresarAgregadoCarrito':
            
            $promocompra->setIdAgregados($_POST['idAgregado']);
            
            if($carrito->generarCarritoCliente($_SESSION['user'][1])){
                echo $promocompra->ingresarAgregadoCarrito($_SESSION['user'][1]);
            }else {
                echo 2;
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
        
        
        $promocompra->setIdPromo($_POST['id_promo']);
        
        $arrayCoberturas = json_decode($promocompra->cargarCoberturasPromoUnaOpcion());
        
        
        for ($i=0; $i < sizeof($arraypromocompra); $i++) { 
            array_push($arrayCoberturas, $arraypromocompra[$i]);
        }
        
        
        if($carrito->generarCarritoCliente($_SESSION['user'][1])){
            $promocompra->setRollsCompra($arrayCoberturas);
            echo $promocompra->ingresarPromoCompraChef($_SESSION['user'][1]);
        }else {
            echo 2;
        }
        break;

        case 'GenerarVenta':
            if(isset($_SESSION['user'])){
                $idTipoPago = $_POST['tipo_pago'];
                $idTipoEntrega = $_POST['tipo_entrega'];
                $horaEntrega = $_POST['hora_entrega'];
                $direccion = $_POST['direccion_entrega'];
                $receptor = $_POST['receptor'];

                $arrPromoCompra = $carrito->obtenerDetallePromoCompraCarrito($_SESSION['user'][1]);

                $arrAgregados = $carrito->obtenerDetalleAgregadosCarrito($_SESSION['user'][1]);

                $venta->setDetallePromoCompra($arrPromoCompra);
                $venta->setDetalleAgregados($arrAgregados);
                $venta->setIdTipoPago($idTipoPago);
                $venta->setIdTipoEntrega($idTipoEntrega);
                $venta->setDireccion($direccion);
                $venta->setHora($horaEntrega);
                $venta->setReceptor($receptor);

                echo $venta->ingresarVenta($_SESSION['user'][1]);
            }
        break;

        case 'ObtenerPrecioTotalCarrito':
            echo $carrito->obtenerPrecioTotalCarrito($_SESSION['user'][1]);
        break;

        case 'ValidarFechaCompra':
            $venta->setHora($_POST['horaEntrega']);
            echo $venta->validarFechaCompra();
        break;
    }
}