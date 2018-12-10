<?php
session_start();

require '../../public/templates/session.php';

$sesion = new Sesion();


switch($_REQUEST['action']){
    case 'comprobarSesion':
    if(isset($_SESSION['user'])){
        if($sesion->validarEstadoSesion()){
            if(session_destroy()){
                echo 1;
                // *El usuario no posee permisos para navegar en el sistema
                // *La sesión se destruye y en javascript se redirige
            }
        }
    }else{
        if(session_destroy()){
            echo 2;
            // *Si no existe la sesión se redirige al index en javascript
        }
    }
    break;
}