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
        case 'CargarRellenosCarta':
            echo $rellenos->cargarRellenosCarta();
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
            // $stock = $validate->int($_POST['stock'], 1000, 1);
            // $uso = $validate->int($_POST['uso'], 10000, 1);
            // $minima = $validate->int($_POST['minima'], 1000, 1);
            
            $stock = $_POST['stock'];
            $uso = $_POST['uso'];
            $minima = $_POST['minima'];

            if(empty($_FILES["imagenUrl"]["name"])){
                $fileText = 'Misma';
            }else{
                $target_dir = "../../public/uploads/";
                $target_file = $target_dir . basename($_FILES["imagenUrl"]["name"]);
                $uploadOk = 1;
                $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

                //*Comprueba si la imagen es real
                $check = getimagesize($_FILES["imagenUrl"]["tmp_name"]);
                if($check !== false) {
                    $uploadOk = 1;
                } else {
                    $uploadOk = 0;
                }
                //*Comprueba el formato de la imagen
                if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
                    $uploadOk = 0;
                }
                if ($uploadOk == 0) {
                    return '2';
                } else {
                    move_uploaded_file($_FILES["imagenUrl"]["tmp_name"], $target_file);
                    $fileText = basename($_FILES['imagenUrl']['name']);
                }
            }

            $rellenos->setIdRelleno($id);
            $rellenos->setNombre($nombre);
            $rellenos->setDescripcion($descripcion);
            $rellenos->setIdIndice($idIndice);
            $rellenos->setPrecioAdicional($precio);
            $rellenos->setIdEstado($idEstado);
            $rellenos->setImgUrl($fileText);
            $rellenos->setCantidadStock($stock);
            $rellenos->setUnidadStock($_POST['unidadStock']);
            $rellenos->setCantidadUso($uso);
            $rellenos->setCantidadMinima($minima);

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
            // $stock = $validate->int($_POST['stock'], 1000, 1);
            // $uso = $validate->int($_POST['uso'], 10000, 1);
            // $minima = $validate->int($_POST['minima'], 1000, 1);

            $stock = $_POST['stock'];
            $uso = $_POST['uso'];
            $minima = $_POST['minima'];

            if(empty($_FILES["imagenUrl"]["name"])){
                $fileText = 'default_food.jpg';
            }else{
                $target_dir = "../../public/uploads/";
                $target_file = $target_dir . basename($_FILES["imagenUrl"]["name"]);
                $uploadOk = 1;
                $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

                //*Comprueba si la imagen es real
                $check = getimagesize($_FILES["imagenUrl"]["tmp_name"]);
                if($check !== false) {
                    $uploadOk = 1;
                } else {
                    $uploadOk = 0;
                }
                //*Comprueba el formato de la imagen
                if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
                    $uploadOk = 0;
                }
                if ($uploadOk == 0) {
                    return '2';
                } else {
                    move_uploaded_file($_FILES["imagenUrl"]["tmp_name"], $target_file);
                    $fileText = basename($_FILES['imagenUrl']['name']);
                }
            }

            $rellenos->setNombre($nombre);
            $rellenos->setDescripcion($descripcion);
            $rellenos->setPrecioAdicional($precio);
            $rellenos->setIdIndice($idIndice);
            $rellenos->setIdEstado($idEstado);
            $rellenos->setImgUrl($fileText);
            $rellenos->setCantidadStock($stock);
            $rellenos->setUnidadStock($_POST['unidadStock']);
            $rellenos->setCantidadUso($uso);
            $rellenos->setCantidadMinima($minima);

            echo $rellenos->ingresarRellenos($_SESSION['user'][1]);

        }
        break;
    }
}