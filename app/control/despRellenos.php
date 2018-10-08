<?php

require_once '../clases/rellenos.php';
require_once '../clases/inputValidate.php';

session_start();


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $rellenos = new Relleno();

    switch($_REQUEST['action']){
        case 'CargarMantenedorRellenos':
            echo $rellenos->cargarRellenos();
        break;
        case 'EliminarRelleno':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $rellenos->setIdRelleno($_POST['id']);
                echo $rellenos->EliminarRelleno($_SESSION['user'][1]);
            }
        break;
        case 'CargarModalRelleno':
            $rellenos->setIdRelleno($_POST['id']);
            echo $rellenos->ObtenerInformacionRelleno();
        break;
        case 'ActualizarDatosRelleno':
        if($validate->check(['nombre', 'descripcion', 'precio', 'estado', 'indice'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $idIndice = $_POST['indice'];
            $idEstado = $_POST['estado'];

            $rellenos->setIdRelleno($id);
            $rellenos->setNombre($nombre);
            $rellenos->setDescripcion($descripcion);
            $rellenos->setIdIndice($idIndice);
            $rellenos->setPrecioAdicional($precio);
            $rellenos->setIdEstado($idEstado);

            echo $rellenos->actualizarDatos($_SESSION['user'][1]);
        }
        break;

        case 'IngresarRelleno':
        if($validate->check(['nombre', 'descripcion', 'precio', 'indice', 'estado'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $idIndice = $_POST['indice'];
            $idEstado = $_POST['estado'];

            $rellenos->setNombre($nombre);
            $rellenos->setDescripcion($descripcion);
            $rellenos->setPrecioAdicional($precio);
            $rellenos->setIdIndice($idIndice);
            $rellenos->setIdEstado($idEstado);

            echo $rellenos->ingresarRellenos($_SESSION['user'][1]);
        }
        break;
    }
}