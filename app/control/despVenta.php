<?php

session_start();

require '../db_connection/connection.php';
require '../clases/venta.php';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $venta = new Venta();

    switch($_POST['action']){
        case 'CargarTablaVentas':
            echo $venta->cargarVentasMikasa();
        break;
    }
}