<?php

require_once "../clases/agregados.php"; //*Clase agregados
require_once "../clases/inputValidate.php"; //*Clase input para validación de campos
require_once "../clases/empleado.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $agregados = new Agregados();

    switch($_REQUEST['action']){
        case 'CargarMantenedorAgregados':
            if (isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                echo $agregados->CargarMantenedorAgregados();
            }
        break;
        case 'EliminarAgregado':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $agregados->setIdAgregados($_POST['id']);
                echo $agregados->EliminarAgregado($_SESSION['user'][1]);
            }
        break;
        case 'CargarModalAgregado':
            $agregados->setIdAgregados($_POST['id']);
            echo $agregados->ObtenerInformacionAgregado();
        break;

        case 'ActualizarDatosAgregados':
        if($validate->check(['nombre', 'descripcion', 'precio', 'descuento', 'estado'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $descuento = $validate->int($_POST['descuento'], 100, 0);
            $idEstado = $_POST['estado'];

            $agregados->setIdAgregados($id);
            $agregados->setNombre($nombre);
            $agregados->setDescripcion($descripcion);
            $agregados->setPrecio($precio);
            $agregados->setDescuento($descuento);
            $agregados->setIdEstado($idEstado);

            echo $agregados->actualizarDatos($_SESSION['user'][1]);
        }
        break;

        case 'IngresarAgregados':
        if($validate->check(['nombre', 'descripcion', 'precio', 'descuento', 'estado'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $descuento = $validate->int($_POST['descuento'], 100, 0);
            $idEstado = $_POST['estado'];

            $agregados->setNombre($nombre);
            $agregados->setDescripcion($descripcion);
            $agregados->setPrecio($precio);
            $agregados->setDescuento($descuento);
            $agregados->setIdEstado($idEstado);

            echo $agregados->ingresarAgregados($_SESSION['user'][1]);
        }
        break;
    }
}
