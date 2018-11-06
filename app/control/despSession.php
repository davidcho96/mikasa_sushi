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
            }
        }
    }else{
        if(session_destroy()){
            echo 2;
        }
    }
    break;
}