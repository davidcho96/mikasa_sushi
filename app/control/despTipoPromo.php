<?php

require_once "../clases/tipoPromo.php";
require_once "../clases/inputValidate.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $tipopromo = new TipoPromo();

    switch($_REQUEST['action']){
        case 'CargarMantenedorTipoPromo':
        // *Obtiene los datos para cargar la tabla tipo promo
            echo $tipopromo->CargarMantenedorTipoPromo();
        break;
        case 'EliminarTipoPromo':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $tipopromo->setIdTipoPromo($_POST['id']);
                echo $tipopromo->EliminarTipoPromo($_SESSION['user'][1]);
            }
        break;
        case 'CargarModalTipoPromo':
        // *Se obtienen los datos del tipo de promo seleccionado para cargarlos en el modal
            $tipopromo->setIdTipoPromo($_POST['id']);
            echo $tipopromo->ObtenerInformacionTipoPromo();
        break;
        case 'ActualizarTipoPromo':
        if($validate->check(['nombre'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '1000', '3');

            $tipopromo->setIdTipoPromo($id);
            $tipopromo->setDescripcionTipoPromo($nombre);

            echo $tipopromo->actualizarDatos($_SESSION['user'][1]);
        }
        break;
        case 'IngresarTipoPromo':
        if($validate->check(['nombre'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '1000', '3');
            $idEstado = 1;

            $tipopromo->setDescripcionTipoPromo($nombre);
            $tipopromo->setIdEstadoMantenedor($idEstado);

            echo $tipopromo->ingresarTipoPromo($_SESSION['user'][1]);
        }
        break;
        case 'CargarComboTipoPromo':
                echo $tipopromo->CargarComboTipoPromo();
        break;
        case 'ComprobarVinculacionTipoPromo':
            $tipopromo->setIdTipoPromo($_POST['id']);
            echo $tipopromo->comprobarVinculacionTipoPromo();
        break;
    }

}