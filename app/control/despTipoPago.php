<?php

require_once "../clases/tipoPago.php";
require_once "../clases/inputValidate.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $tipopago = new TipoPago();

    switch($_REQUEST['action']){
        case 'CargarMantenedorTipoPago':
            echo $tipopago->CargarMantenedorTipoPago();
        break;
        case 'CargarComboBoxTipoPago':
            echo $tipopago->cargarComboBoxTipoPago();
        break;
        case 'EliminarTipoPago':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $tipopago->setIdTipoPago($_POST['id']);
                echo $tipopago->EliminarTipoPago($_SESSION['user'][1]);
            }
        break;
        case 'CargarModalTipoPago':
        // *Se cargan los datos del modal seleccionado para cargarlos en el modal
            $tipopago->setIdTipoPago($_POST['id']);
            echo $tipopago->ObtenerInformacionTipoPago();
        break;
        case 'ActualizarTipoPago':
        if($validate->check(['nombre'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '1000', '3');

            $tipopago->setIdTipoPago($id);
            $tipopago->setDescripcionTipoPago($nombre);

            echo $tipopago->actualizarDatos($_SESSION['user'][1]);
        }
        break;
        case 'IngresarTipoPago':
        if($validate->check(['nombre'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '1000', '3');
            $idEstado = 1;

            $tipopago->setDescripcionTipoPago($nombre);
            $tipopago->setIdEstadoMantenedor($idEstado);

            echo $tipopago->ingresarTipoPago($_SESSION['user'][1]);
        }
        break;
    }

}