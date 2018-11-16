<?php
require "../PHPMailer-master/src/PHPMailer.php";
require "../PHPMailer-master/src/Exception.php";
require "../PHPMailer-master/src/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer;

session_start();

require '../clases/reseteoPass.php';
require '../clases/cliente.php';
require '../clases/empleado.php';

$cliente = new Cliente();

$reseteoPass = new ReseteoPass();

$empleado = new Empleado();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    switch($_REQUEST['action']){
        case 'ValidarCorreo':
            $cliente->setCorreo($_POST['txt_email']);
            $empleado->setCorreo($_POST['txt_email']);
            switch($cliente->consultarExistenciaCliente()){
                case '2':
                    // echo 2;
                    switch($empleado->consultarExistenciaEmpleado()){
                        case '2':
                            echo 2;
                        break;
                        case '3':
                            echo 3;
                        break;
                        case '4':
                            echo 4;
                        break;
                        case '1':
                        $token = sha1($empleado->randomCode());
                        $enlace = $_SERVER["SERVER_NAME"].'/restablecer-pass.php?token='.$token.'&idTipoUsuario='.password_hash('empleado', PASSWORD_DEFAULT, ['cost'=>12]);
                        $mail->Host = 'smtp.gmail.com';
                        $mail->SMTPAuth = true;
                        $mail->Username = 'davidchomc8@gmail.com';
                        $mail->Password = 'dmc28ra09';
                        $mail->SMTPSecure = 'ssl';
                        $mail->Port = 465;
                    
                        $mail->setFrom('davidchomc8@gmail.com', 'Mikasa Sushi');
                        $mail->addAddress($empleado->getCorreo());     
                    
                        $mail->Subject = 'Gracias por unirte a Mikasa';
                        $mail->CharSet = 'UTF-8';
                        $mail->IsHTML(true);
                        $mail->Body    = '<html><a href="'.$enlace.'">Recuperar pass</a></html>';

                        if(!$mail->send()) {
                            echo 2;
                        } else {
                            $reseteoPass->setToken($token);
                            $reseteoPass->setCorreo($empleado->getCorreo());
                            $reseteoPass->ingresarReseteoPass();
                            echo 1;
                        }
                        break;
                    }
                break;
                case '3':
                    echo 3;
                break;
                case '4':
                    echo 4;
                break;
                case '1':
                    $token = sha1($cliente->randomCode());
                    $enlace = $_SERVER["SERVER_NAME"].'/restablecer-pass.php?token='.$token.'&idTipoUsuario='.password_hash('cliente', PASSWORD_DEFAULT, ['cost'=>12]);
                    $mail->Host = 'smtp.gmail.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = 'davidchomc8@gmail.com';
                    $mail->Password = 'dmc28ra09';
                    $mail->SMTPSecure = 'ssl';
                    $mail->Port = 465;
                
                    $mail->setFrom('davidchomc8@gmail.com', 'Mikasa Sushi');
                    $mail->addAddress($cliente->getCorreo());     
                
                    $mail->Subject = 'Gracias por unirte a Mikasa';
                    $mail->CharSet = 'UTF-8';
                    $mail->IsHTML(true);
                    $mail->Body    = '<html><a href="'.$enlace.'">Recuperar pass</a></html>';

                    if(!$mail->send()) {
                        echo 2;
                    } else {
                        $reseteoPass->setToken($token);
                        $reseteoPass->setCorreo($cliente->getCorreo());
                        $reseteoPass->ingresarReseteoPass();
                        echo 1;
                    }
                    break;
                    echo 1;
                break;
            }

        break;
        case 'ConsultarEstadoToken':
            $token = $_POST['token'];
            $reseteoPass->setToken($token);
            echo $reseteoPass->consultarExistenciaToken();
        break;

        // !Falta enviar correo a cliente
        case 'CambiarPasswordUsuario':
            $token = $_POST['token'];
            $idTipo = $_POST['tipoUsuario'];
            if(password_verify('cliente', $idTipo)){
                $cliente->setCorreo($reseteoPass->consultarCorreoToken($token));
                $cliente->setPassword($_POST['nuevaPass']);
                if($cliente->recuperarPass($token) == 1){
                    echo $reseteoPass->eliminarToken($token);
                }
            }else{
                $empleado->setCorreo($reseteoPass->consultarCorreoToken($token));
                $empleado->setPassword($_POST['nuevaPass']);
                if($empleado->recuperarPass($token) == 1){
                    echo $reseteoPass->eliminarToken($token);
                }
            }
        break;
    }
}