<?php

require_once '../clases/indiceRellenos.php';
require_once '../clases/inputValidate.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $indiceRellenos = new IndiceRellenos();

    switch($_REQUEST['action']){
        case 'CargarIndiceRellenos':
            echo $indiceRellenos->cargarIndiceRellenos();
        break;
        case 'CargarTotalIndiceRellenos':
            echo $indiceRellenos->cargarIndiceRellenosTotal();
        break;
        case 'RestarIndiceRellenos':
            echo $indiceRellenos->eliminarIndiceRelleno($_SESSION['user'][1]);
        break;
        case 'AgregarIndiceRelleno': 
            echo $indiceRellenos->agregarIndiceRelleno($_SESSION['user'][1]);
        break;
    }
}