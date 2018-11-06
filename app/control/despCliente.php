<?php

require "../clases/cliente.php"; //*Clase cliente
require "../clases/inputValidate.php"; //*Clase Input para validación de campos
require "../PHPMailer-master/src/PHPMailer.php";
require "../PHPMailer-master/src/Exception.php";
require "../PHPMailer-master/src/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
session_start();

$mail = new PHPMailer;
if ($_SERVER['REQUEST_METHOD'] === 'POST') { //*Se valida que el método de solicitud sea 'POST'

    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $cliente = new Cliente();

        switch($_REQUEST['action']){//*Comprueba que campos no estén vacíos
            case 'RegistroCliente':
            //!Falta validar campos que podrán quedar vacíos
                if($validate->check(['txt_nombre', 'txt_apellidos', 'txt_email', 'txt_password'], $_REQUEST)){
                    
                    $nombre = $validate->str($_POST['txt_nombre'], '100', '3');
                    //*Llama al método str, y pasa parámetros (*campo, *maxLength, *minLength)

                    $apellidos=$validate->str($_POST['txt_apellidos'], '100', '3');

                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '200', '7');
                    //*Recibe la acción a ejecutar

                    // if ($_POST['txt_telefono'] == '') {
                    //     $telefono = 'NULL';
                    // }else{
                    //     $telefono = $validate->int((int)$_POST['txt_telefono'], 99999999, 11111111);
                    // }

                    //*Setea parámetros en la clase Cliente
                    $cliente->setNombre($nombre);
                    $cliente->setApellidos($apellidos);
                    $cliente->setCorreo($correo);
                    $cliente->setPassword($password);

                    switch($cliente->registro()){
                        //*Ejecución y respuesta del método registro de clase Cliente
                        case '1':
                            echo '1';
                            //*El correo ya está registrado
                        break;
                        case '2':
                        // $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
                        // $mail->SMTPAuth = true;                               // Enable SMTP authentication
                        // $mail->Username = 'davidchomc8@gmail.com';                 // SMTP username
                        // $mail->Password = 'clavecorreo';                           // SMTP password
                        // $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
                        // $mail->Port = 465;                                    // TCP port to connect to

                        // $mail->setFrom('davidchomc8@gmail.com', 'Mikasa Sushi');
                        // $mail->addAddress($cliente->getCorreo(), $cliente->getNombre());     

                        // $mail->Subject = 'Gracias por unirte a Mikasa';
                        // $mail->Body    = 'Saludos';

                        // if(!$mail->send()) {
                        //     echo 1;
                        // } else {
                        //     //*Registro exitoso
                        //     $array_session = array('cliente', $cliente->getCorreo());
                        //     if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                        //         $_SESSION['user'] = $array_session;
                        //     }
                        //     echo 2;
                        // }
                        echo '2';
                        break;
                        
                    }
                }else{
                    echo 'Error';
                }
            break;

            case 'RegistroClienteMantenedor':
            //!Falta validar campos que podrán quedar vacíos
                if($validate->check(['txt_nombre', 'txt_apellidos', 'txt_email', 'txt_password'], $_REQUEST)){
                    
                    $nombre = $validate->str($_POST['txt_nombre'], '100', '3');
                    //*Llama al método str, y pasa parámetros (*campo, *maxLength, *minLength)

                    $apellidos=$validate->str($_POST['txt_apellidos'], '100', '3');

                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '200', '7');
                    //*Recibe la acción a ejecutar

                    if ($_POST['txt_telefono'] == '') {
                        $telefono = 'NULL';
                    }else{
                        $telefono = $validate->int((int)$_POST['txt_telefono'], 99999999, 11111111);
                    }

                    //*Setea parámetros en la clase Cliente
                    $cliente->setNombre($nombre);
                    $cliente->setApellidos($apellidos);
                    $cliente->setCorreo($correo);
                    $cliente->setTelefono($telefono);
                    $cliente->setPassword($password);

                    switch($cliente->registro()){
                        case '1':
                            echo 1;
                        break;
                        case '2':
                        echo 2;                        // $mail->IsSMTP();                                      // Set mailer to use SMTP
                        // $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
                        // $mail->SMTPAuth = true;                               // Enable SMTP authentication
                        // $mail->Username = 'davidchomc8@gmail.com';                 // SMTP username
                        // $mail->Password = 'dmc28ra09';                           // SMTP password
                        // $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
                        // $mail->Port = 465;                                    // TCP port to connect to

                        // $mail->setFrom('davidchomc8@gmail.com', 'Mikasa Sushi');
                        // $mail->addAddress($cliente->getCorreo(), $cliente->getNombre());     

                        // $mail->Subject = 'Gracias por unirte a Mikasa';
                        // $mail->Body    = 'Saludos';

                        // if(!$mail->send()) {
                        //     echo 1;
                        // } else {
                        //     echo 2;
                        // }
                        // !No envía con red Inacap
                        break;
                    }
                }else{
                    echo 'Error';
                }
            break;

            // ------------------------------------------------------------------------

            case 'LoginCliente':
                if($validate->check(['txt_email', 'txt_password'], $_REQUEST)){
                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '200', '1');
                    //*Recibe la acción a ejecutar

                    //*Setea parámetros en la clase Cliente
                    $cliente->setCorreo($correo);
                    $cliente->setPassword($password);

                    switch($cliente->login()){
                        case '1':
                            $array_session = array('cliente', $cliente->getCorreo());
                            //* Registro exitoso
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = $array_session;
                            }
                            echo '1'; 
                        break;
                        case '2':
                            echo '2'; 
                            //* Registro erróneo
                        break;
                        case '3':
                            echo '3';
                        break;
                        case '4':
                            echo '4';
                        break;
                    }
                }
            break;
            case 'ObtenerDatosPerfil':
                if (isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL') {
                    $correo=$validate->email($_SESSION['user'][1]);
                    $cliente->setCorreo($correo);
                    echo $cliente->cargarDatosPerfil();
                    }
            break;

            // --------------------------------------------------------------------------

            case 'EditarPerfilCliente':
                if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL') { 
                    //*Se valida la existencia de la sesión
                    if($validate->check(['txt_nombre', 'txt_apellidos'], $_REQUEST)){
                        $correo=$validate->email($_SESSION['user'][1]);
                        
                        $nombre = $validate->str($_POST['txt_nombre'], '100', '3');
                        //*Llama al método str, y pasa parámetros (*campo, *maxLength, *minLength)
                        
                        $apellidos=$validate->str($_POST['txt_apellidos'], '100', '3');

                        if ($_POST['txt_telefono'] == '') {
                            $telefono = 'NULL';
                        }else{
                            $telefono = $validate->int((int)$_POST['txt_telefono'], 99999999, 11111111);
                        }
                    }
                    $cliente->setCorreo($correo);
                    $cliente->setNombre($nombre);
                    $cliente->setApellidos($apellidos);
                    $cliente->setTelefono($telefono);

                    switch($cliente->actualizarDatosPerfil()){
                        case '1':
                            echo '1';
                            //* Actualización exitosa
                        break;
                        case '2':
                            echo '2';
                            //* Actualización fallida
                    }
                }else{
                    echo '2'; //*Error de actualización
                }
            break;

            case'ConfirmarPassCliente':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL') {
                if($validate->check(['txt_pass_actual'], $_REQUEST)){
                    $password= $validate->pass($_POST['txt_pass_actual'], '200', '7');
                    $correo=$validate->email($_SESSION['user'][1]);
                    $cliente->setCorreo($correo);
                    $cliente->setPassword($password);
                    switch($cliente->confirmarPass()){
                        case '1':
                            echo '1';
                        break;
                        case '2':
                            echo '2';
                        break;
                    } 
                }
            }
            break;

            // *-----------------------------------------------------------

            case 'CambiarPassCliente':
            if($validate->check(['txt_pass_nueva', 'txt_pass_confirmar'], $_REQUEST)){ 
                $password1= $validate->pass($_POST['txt_pass_nueva'], '200', '7');
                $password2= $validate->pass($_POST['txt_pass_confirmar'], '200', '7'); 

                $correoUser=$validate->email($_SESSION['user'][1]);

                $cliente->setPassword($password1);
                $cliente->setCorreo($correoUser);
                // echo '1';
                switch($cliente->cambiarPass()){
                    case '1':
                        echo '1';
                    break;
                    case '2':
                        echo '2';
                    break;
                } 
            }
            break;

            // *--------------------------------------------------


            case 'CargarTablaClientes':
                echo $cliente->cargarTabla();
            break;

            // *--------------------------------------------------
            case 'CargarTablaClientes':
                echo $cliente->cargarTabla();
            break;
            // *--------------------------------------------------
            case 'EliminarCliente':
            // $cliente->setIdCliente();
            echo $cliente->eliminaCliente($_REQUEST['id']);
           break; 
           // *----------------------------------------------------
           // carga los datos del cliente al modal para despues actualizar
           case 'CargaCliente':
           $cliente->setIdCliente($_POST['id']);
           echo $cliente->cargaCliente($_REQUEST['id']);
           
           break;
           // *----------------------------------------------------
           // Actualiza cliende del modal
           case 'ActualizaCliente':
           $id = $_POST['id'];
           $cliente->setIdCliente($id);
           $cliente->setNombre($_POST['nombre']);
           $cliente->setApellidos($_POST['apellidos']);
           $cliente->setCorreo($_POST['email']);
           $cliente->setTelefono($_POST['telefono']);
           $cliente->setIdEstado($_POST['idEstado']);
           echo $cliente->ActualizarCliente();
           break;
           
        }
}else{
    echo 'Solicitud denegada';
}