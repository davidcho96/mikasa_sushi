<?php

session_start();

require '../db_connection/connection.php';
// require '../clases/cliente.php';
require '../clases/venta.php';

require "../PHPMailer-master/src/PHPMailer.php";
require "../PHPMailer-master/src/Exception.php";
require "../PHPMailer-master/src/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer;

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $venta = new Venta();

    switch($_POST['action']){
        case 'CargarTablaVentas':
            echo $venta->cargarVentasMikasa();
        break;
        case 'CargarTablaHistorialVentas':
            echo $venta->cargarTablaHistorialVentas();
        break;
        case 'CargarTablaVentasCanceladas':
            echo $venta->cargarTablaVentasCanceladas();
        break;
        case 'ValidarTipoEntrega':
            $venta->setIdVenta($_POST['idVenta']);
            echo $venta->validarTipoEntrega();
        break;
        case 'AceptarVenta':
            $venta->setIdVenta($_POST['idVenta']);
            $venta->setLat($_POST['lat']);
            $venta->setLng($_POST['lng']);
            $venta->setCodigoVenta($_POST['CodigoVenta']);
            switch($venta->aceptarVenta()){
                case '1':
                    $codigocompra = $venta->getCodigoVenta();
                    $enlace = $_SERVER["SERVER_NAME"].'/ver-estado-mi-compra.php?codigocompra='.$codigocompra;
                    $mail->Host = 'smtp.gmail.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = 'davidchomc8@gmail.com';
                    $mail->Password = 'dmc28ra09';
                    $mail->SMTPSecure = 'ssl';
                    $mail->Port = 465;
                
                    $mail->setFrom('davidchomc8@gmail.com', 'Mikasa Sushi');
                    $mail->addAddress($venta->obtenerCorreoClienteVenta());
                    
                
                    $mail->Subject = 'Gracias por unirte a Mikasa';
                    $mail->CharSet = 'UTF-8';
                    $mail->IsHTML(true);
                    $mail->Body    = '<html><a href="'.$enlace.'">Ver estado de compra</a></html>';

                    if(!$mail->send()) {
                        echo 3;
                    } else {
                        echo 1;
                    }
                break;
                case '2':
                    echo 2;
                break;
            }
        break;
        case 'CancelarVenta':
            switch($_POST['idMotivo']){
                case '1':
                    $venta->setMotivoCancelacion('Dirección no específica.');
                    break;
                case '2':
                    $venta->setMotivoCancelacion('No hay disponibilidad de envío.');
                    break;
                case '3':
                    $venta->setMotivoCancelacion('El local está cerrado.');
                    break;
                case '4':
                    $venta->setMotivoCancelacion($_POST['motivo']);
                    break;
            }
            $venta->setIdVenta($_POST['idVenta']);
            echo $venta->cancelarVenta($_SESSION['user'][1]);
        break;
        case 'VerDetalleVentaPromoCompra':
            $venta->setIdVenta($_POST['IdVenta']);
            echo $venta->verDetalleVentaPromoCompra();
            break;
        case 'CargarPrecioMaximoCompra':
            echo $venta->cargarPrecioMaximoCompra();
            break;
    }
}