<?php

require_once '../clases/coberturas.php';
require_once '../clases/inputValidate.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $coberturas = new Cobertura();

    switch($_REQUEST['action']){
        case 'CargarMantenedorCoberturas';
            echo $coberturas->cargarCoberturas();
        break;
        case 'EliminarCobertura':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $coberturas->setIdCobertura($_POST['id']);
                echo $coberturas->EliminarCobertura($_SESSION['user'][1]);
            }
        break;
        case 'CargarModalCobertura':
            $coberturas->setIdCobertura($_POST['id']);
            echo $coberturas->ObtenerInformacionCobertura();
        break;
        case 'ActualizarDatosCobertura':
        if($validate->check(['nombre', 'descripcion', 'precio', 'estado', 'indice'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $idIndice = $_POST['indice'];
            $idEstado = $_POST['estado'];

            $coberturas->setIdCobertura($id);
            $coberturas->setNombre($nombre);
            $coberturas->setDescripcion($descripcion);
            $coberturas->setIdIndice($idIndice);
            $coberturas->setPrecioAdicional($precio);
            $coberturas->setIdEstado($idEstado);

            echo $coberturas->actualizarDatos($_SESSION['user'][1]);
        }
        break;

        case 'IngresarCobertura':
        if($validate->check(['nombre', 'descripcion', 'precio', 'indice', 'estado'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $idIndice = $_POST['indice'];
            $idEstado = $_POST['estado'];

            $coberturas->setNombre($nombre);
            $coberturas->setDescripcion($descripcion);
            $coberturas->setPrecioAdicional($precio);
            $coberturas->setIdIndice($idIndice);
            $coberturas->setIdEstado($idEstado);

            echo $coberturas->ingresarCoberturas($_SESSION['user'][1]);
        }
        break; 
    }
}