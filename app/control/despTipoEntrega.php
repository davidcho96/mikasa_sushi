<?php

require_once "../clases/tipoEntrega.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tipoentrega = new TipoEntrega();

    switch($_POST['action']){
        case 'CargarComboBoxTipoEntrega':
            echo $tipoentrega->cargarComboBoxTipoEntrega($_SESSION['user'][1]);
        break;
    }
}