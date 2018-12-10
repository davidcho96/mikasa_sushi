<?php

require_once "../clases/empleado.php"; //*Clase empleado
require_once "../clases/inputValidate.php"; //*Clase Input para validación de campos
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

    $empleado = new Empleado();

        switch($_REQUEST['action']){//*Comprueba que campos no estén vacíos
            case 'LoginEmpleado':
                if($validate->check(['txt_email', 'txt_password'], $_REQUEST)){
                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '100', '1');
                    //*Recibe la acción a ejecutar

                    //*Setea parámetros en la clase empleado
                    $empleado->setCorreo($correo);
                    $empleado->setPassword($password);

                    switch($empleado->login()){
                        case '1':
                            echo '1'; 
                            $array_session = array('Administrador', $empleado->getCorreo());
                            //* Registro exitoso se inicia sesión como administrador
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = $array_session;
                            }
                        break;
                        case '2':
                            echo '2'; 
                            $array_session = array('Repartidor', $empleado->getCorreo());
                            //* Registro exitoso se inicia sesión como administrador
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = $array_session;
                            }
                        break;
                        case '3':
                            echo '2'; 
                            $array_session = array('Vendedor', $empleado->getCorreo());
                            //* Registro exitoso se inicia sesión como administrador
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = $array_session;
                            }
                        break;
                        case 'error':
                            echo 'error';
                            // *Un error impidió que el usuario accediera al sistema
                        break;
                        case 'errorEstado':
                            echo 'errorEstado';
                            // *El usuario no tiene permisos para ingresar al sistema
                        break;
                    }
                }
            break;
            // funcion para el registro del mantenedor empleado
            case 'RegistroEmpleado':
                if($validate->check(['txt_nombre', 'txt_apellidos', 'txt_email', 'txt_password'], $_REQUEST)){
                    
                    $nombre = $validate->str($_POST['txt_nombre'], '45', '3');
                    //*Llama al método str, y pasa parámetros (*campo, *maxLength, *minLength)

                    $apellidos=$validate->str($_POST['txt_apellidos'], '45', '3');


                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '100', '7');
                    // $combo_TipoEmpleado = $validate->int($_POST['combo_TipoEmpleado']);
                    //*Recibe la acción a ejecutar

                    //*Setea parámetros en la clase empleado
                    $empleado->setIdTipoEmpleado($_POST['combo_TipoEmpleado']);
                    $empleado->setPassword($password);
                    $empleado->setCorreo($correo);
                    $empleado->setNombre($nombre);
                    $empleado->setApellidos($apellidos);

                    switch($empleado->IngresaEmpleado()){
                        case '1':
                            echo 1;
                            // *El correo que se ingresó ya existe en los registros almacenados
                        break;
                        case '2':
                            // *El registro se realizó correctamente
                            echo 2;                        // $mail->IsSMTP();                                      // Set mailer to use SMTP
                        // $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
                        // $mail->SMTPAuth = true;                               // Enable SMTP authentication
                        // $mail->Username = 'davidchomc8@gmail.com';                 // SMTP username
                        // $mail->Password = 'dmc28ra09';                           // SMTP password
                        // $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
                        // $mail->Port = 465;                                    // TCP port to connect to

                        // $mail->setFrom('davidchomc8@gmail.com', 'Mikasa Sushi');
                        // $mail->addAddress($empleado->getCorreo(), $empleado->getNombre());     

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
                    echo '2';
                }
            break;
            // ----------------------------------------------------------------
            //* Funcion para cargar las tablas con los datos de los empleados
            case 'CargarTablaEmpleados':
                    echo $empleado->cargarTablaEmpleados($_SESSION['user'][1]);
                break;
            //* la funcion nos permite eliminar un registro de la tabla
            case 'EliminarEmpleado':
                    $empleado->setIdEmpleado($_POST['id']);
                    echo $empleado->eliminaEmpleado($_SESSION['user'][1]);
                break;
            //* Carga los datos del empleado al modal, para luego actualizar
            case 'cargaModalEmpleado':
                    $empleado->setIdEmpleado($_POST['id']);
                    echo $empleado->cargaCliente($_REQUEST['id']);
            break;
            //* funcion para actualizar los empleado a través del modal
            case 'ActualizaEmpleados':
                $id = $_POST['id'];
                $empleado->setIdEmpleado($id);
                $empleado->setNombre($_POST['nombre']);
                $empleado->setApellidos($_POST['apellidos']);
                $empleado->setCorreo($_POST['email']);
                $empleado->setIdEstado($_POST['idEstado']);
                $empleado->setIdTipoEmpleado($_POST['idTipoEmp']);
                echo $empleado->ActualizaEmpleado($_SESSION['user'][1]);
                break;
        }
}