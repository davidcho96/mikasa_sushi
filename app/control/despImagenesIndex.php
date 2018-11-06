<?php

require_once "../clases/imagenesIndex.php";
require_once "../clases/inputValidate.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $img = new ImagenesIndex();

    switch($_REQUEST['action']){
        case 'CargarImagenesIndex':
            echo $img->cargarImagenesIndex();
        break;
    }

}