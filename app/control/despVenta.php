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
                    // *Se envía un correo al cliente indicando que se aceptó la venta
                    $enlace = $_SERVER["SERVER_NAME"].'/mis-ordenes.php';
                    // $enlaceTemporal = $_SERVER["SERVER_NAME"].':8080/Mikasa-web-project/public/mis-ordenes.php';
                    $mail->Host = 'smtp.gmail.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = 'davidchomc8@gmail.com';
                    $mail->Password = 'dmc28ra09';
                    $mail->SMTPSecure = 'ssl';
                    $mail->Port = 465;
                
                    $mail->setFrom('davidchomc8@gmail.com', 'Mikasa Sushi');
                    $mail->addAddress($venta->obtenerCorreoClienteVenta());
                    
                
                    $mail->Subject = 'Información de su orden';
                    $mail->CharSet = 'UTF-8';
                    $mail->IsHTML(true);
                    $mail->Body    = '<html><p Su venta ha sido aceptada</p><a href="'.$enlace.'">Estado de entrega.</a></html>';

                    if(!$mail->send()) {
                        echo '3';
                    } else {
                        echo '1';
                    }
                break;
                case '2':
                    echo '2';
                break;
                case '3':
                    echo '3';
                    // *No hay 
                    break;
                case '4':
                    echo '4';
                    // *No hay ingredientes
                    break;
                case '5':
                    echo '5';
                    break;
            }
        break;
        case 'CancelarVenta':
        // *Se setea el motivo de la cancelación en base a la selección del checkbox
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
                // * Si el motivo es otro se setea lo ingresado en el campo 'motivo'
                    $venta->setMotivoCancelacion($_POST['motivo']);
                    break;
            }
            $venta->setIdVenta($_POST['idVenta']);
            $venta->setCodigoVenta($_POST['codigoVenta']);
            switch($venta->cancelarVenta($_SESSION['user'][1])){
                case '1':
                    $codigocompra = $venta->getCodigoVenta();
                    $enlace = $_SERVER["SERVER_NAME"].'/mis-ordenes.php';
                    // $enlaceTemporal = $_SERVER["SERVER_NAME"].':8080/Mikasa-web-project/public/mis-ordenes.php';
                    $mail->Host = 'smtp.gmail.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = 'davidchomc8@gmail.com';
                    $mail->Password = 'dmc28ra09';
                    $mail->SMTPSecure = 'ssl';
                    $mail->Port = 465;
                
                    $mail->setFrom('davidchomc8@gmail.com', 'Mikasa Sushi');
                    $mail->addAddress($venta->obtenerCorreoClienteVenta());
                    
                
                    $mail->Subject = 'Información de su orden';
                    $mail->CharSet = 'UTF-8';
                    $mail->IsHTML(true);
                    $mail->Body    = '<html><p Su venta no ha sido aceptada. Motivo: "'.$venta->getMotivoCancelacion().'"</p><br><a href="'.$enlace.'">Estado de entrega.</a></html>';

                    if(!$mail->send()) {
                        echo '3';
                    } else {
                        echo '1';
                    }
                    
                    break;
                case '2':
                    echo '2';
                    break;
                
            }
        break;
        case 'VerDetalleVentaPromoCompra':
            $venta->setIdVenta($_POST['IdVenta']);
            echo $venta->verDetalleVentaPromoCompra();
            // *Se obtiene el detalle de la venta
            break;
        case 'CargarPrecioMaximoCompra':
            echo $venta->cargarPrecioMaximoCompra();
            break;
    }
}