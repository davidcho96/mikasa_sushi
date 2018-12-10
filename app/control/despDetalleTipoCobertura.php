<?php

require_once '../clases/detalleTipoCobertura.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $detalletipocobertura = new DetalleTipoCoberturas();

    switch($_REQUEST['action']){
        // *Se obtienen las coberturas vinculadas al tipo de cobertura a editar
        case 'CargarModalTipoCobertura':
            $detalletipocobertura->setIdTipoCobertura($_REQUEST['id']);
            echo $detalletipocobertura->cargarDetalleTipoCobertura();
        break;
    }
}