<?php

require_once '../clases/estadoElementos.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') { //*Se valida que el método de solicitud sea 'POST'
    $estado = new EstadoElementos();
    
    switch($_REQUEST['action']){
        case 'CargarComboEstadoElemento':
            echo $estado->cargarComboEstado();
        break;
    }

}