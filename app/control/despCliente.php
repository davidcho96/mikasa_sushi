<?php
require_once "../clases/cliente.php";
require_once "../clases/inputValidate.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $validate = new Input();

    if($validate->check(['txt_nombre', 'txt_apellidos', 'txt_email', 'txt_password'], $_REQUEST)){
        
        $nombre = $validate->str($_POST['txt_nombre'], '45', '3');

        $apellidos=$validate->str($_POST['txt_apellidos'], '45', '3');

        $correo=$validate->email($_POST['txt_email']);

        $password= $validate->pass($_POST['txt_password'], '100', '10');

        $cliente = new Cliente();

        switch($_REQUEST['action']){
            case 'RegistroCliente':
                $cliente->setNombre($nombre);
                $cliente->setApellidos($apellidos);
                $cliente->setCorreo($correo);
                $cliente->setPassword($password);

                switch($cliente->registro()){
                    case '1':
                        echo '1';
                    break;
                    case '2':
                        echo '2';
                    break;
                }
            break;
        }
    
    }else{
        echo 'Error';
    }

}else{
    echo 'Solicitud denegada';
}