<?php
session_start();

require '../../public/templates/session.php';

$sesion = new Sesion();


switch($_REQUEST['action']){
    case 'comprobarSesion':
    if(isset($_SESSION['user'])){
        // $sesion->validarEstadoSesion();
        switch($sesion->validarEstadoSesion()){
                case '1':
                
                return 1;
                // unset($_SESSION['user']);
                    break;
            }
            
            // echo 1;
            // if($sesion->validarEstadoSesion() == 1){
            //     // session_start();
            //     // session_destroy();
            //     return 1;
            // }
            // switch($sesion->validarEstadoSesion()){
            //     case '1':
            //         unset($_SESSION["user"]);
            //         session_destroy();
            //         return 1;
            //     break;
            //     case '2':
            //         return 2;
            //     break;
            // }
        }
    break;
}