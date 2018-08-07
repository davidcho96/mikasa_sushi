<?php
require_once "../clases/cliente.php";
require_once "../clases/inputValidate.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $cliente = new Cliente();

    $input = new Input();

    if($input->check(['txt_nombre', 'txt_apellidoP', 'txt_apellidoM', 'txt_email', 'txt_password'], $_REQUEST)){
    
    $nombre=$_POST['txt_nombre'];

    $apellidoP=$_POST['txt_apellidoP'];

    $apellidoM=$_POST['txt_apellidoM'];

    $correo=$_POST['txt_email'];

    $password=$_POST['txt_password'];

    switch($_REQUEST['action']){
        case 'RegistroCliente':
            $cliente->setNombre($nombre);
            $cliente->setApellidoP($apellidoP);
            $cliente->setApellidoM($apellidoM);
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
}