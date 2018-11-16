<?php

require_once "../clases/unidadMedida.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $unidad = new UnidadMedida();

    switch($_POST['action']){
        case 'CargarComboUnidadMedida':
                echo $unidad->CargarComboUnidadMedidas();
        break;
    }
}