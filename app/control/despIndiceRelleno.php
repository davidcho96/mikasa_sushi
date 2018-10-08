<?php

require_once '../clases/indiceRellenos.php';
require_once '../clases/inputValidate.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $indiceRellenos = new IndiceRellenos();

    switch($_REQUEST['action']){
        case 'CargarIndiceRellenos';
            echo $indiceRellenos->cargarIndiceRellenos();
        break;
    }
}