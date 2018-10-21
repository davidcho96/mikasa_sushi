<?php

require_once '../clases/indiceCoberturas.php';
require_once '../clases/inputValidate.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $indiceCoberturas = new IndiceCoberturas();

    switch($_REQUEST['action']){
        case 'CargarIndiceCoberturas';
            echo $indiceCoberturas->cargarIndiceCoberturas();
        break;
        case 'CargarTotalIndiceCoberturas':
            echo $indiceCoberturas->cargarIndiceCoberturasTotal();
        break;
        case 'RestarIndiceCoberturas':
            echo $indiceCoberturas->eliminarIndiceCobertura($_SESSION['user'][1]);
        break;
        case 'AgregarIndiceCoberturas': 
            echo $indiceCoberturas->agregarIndiceCobertura($_SESSION['user'][1]);
        break;
        case 'ObtenerDatosVinculadosIndiceCobertura':
            echo $indiceCoberturas->obtenerDatosVinculadosIndiceCobertura();
        break;
    }
}