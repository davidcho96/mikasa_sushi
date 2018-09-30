<?php

require_once "../clases/cliente.php"; //*Clase cliente
require_once "../clases/inputValidate.php"; //*Clase Input para validación de campos

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') { //*Se valida que el método de solicitud sea 'POST'

    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $cliente = new Cliente();

        switch($_REQUEST['action']){//*Comprueba que campos no estén vacíos
            case 'RegistroCliente':
            //!Falta validar campos que podrán quedar vacíos
                if($validate->check(['txt_nombre', 'txt_apellidos', 'txt_email', 'txt_password'], $_REQUEST)){
                    
                    $nombre = $validate->str($_POST['txt_nombre'], '45', '3');
                    //*Llama al método str, y pasa parámetros (*campo, *maxLength, *minLength)

                    $apellidos=$validate->str($_POST['txt_apellidos'], '45', '3');

                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '100', '10');
                    //*Recibe la acción a ejecutar

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
                            echo '2';
                            //*Registro exitoso
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = 'cliente';
                            }
                        break;
                        //!Añadir acceso denegado por baneo
                    }
                }else{
                    echo 'Error';
                }
            break;

            case 'LoginCliente':
                if($validate->check(['txt_email', 'txt_password'], $_REQUEST)){
                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '100', '1');
                    //*Recibe la acción a ejecutar

                    //*Setea parámetros en la clase Cliente
                    $cliente->setCorreo($correo);
                    $cliente->setPassword($password);

                    switch($cliente->login()){
                        case '1':
                            echo '1'; 
                            //* Registro exitoso
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = 'cliente';
                            }
                        break;
                        case '2':
                            echo '2'; 
                            //* Registro erróneo
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = 'repartidor';
                            }
                        break;
                        case 'error':
                            echo 'error';
                        break;
                    }
                }
            break;
        }
}else{
    echo 'Solicitud denegada';
}