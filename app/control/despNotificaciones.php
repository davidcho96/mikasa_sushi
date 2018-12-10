<?php

require '../clases/notificaciones.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $notificaciones = new Notificacion();

    switch($_REQUEST['action']){
        case 'CargarNotificaciones':
            echo $notificaciones->cargarNotificaciones();
            // *Se obtienen las notificaciones almacenadas
        break;
    }
}