<?php

require_once '../clases/detalleTipoCobertura.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $detalletipocobertura = new DetalleTipoCoberturas();

    switch($_REQUEST['action']){
        case 'CargarModalTipoCobertura':
            $detalletipocobertura->setIdTipoCobertura($_REQUEST['id']);
            echo $detalletipocobertura->cargarDetalleTipoCobertura();
        break;
    }
}