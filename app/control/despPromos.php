<?php
session_start();

require_once '../clases/promos.php';
require_once '../clases/inputValidate.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $promos = new Promos();

    switch($_REQUEST['action']){
        // *Carga las promos en el mantenedor
        case 'CargarMantenedorPromosCliente';
            echo $promos->CargarMantenedorPromosCliente();
        break;
        // *Carga las promos para la visualización en carta
        case 'CargarPromosCarta';
            echo $promos->CargarPromosCarta();
        break;
        case 'IngresarPromoCliente':
        if($validate->check(['nombre', 'cantidad', 'precio', 'descuento', 'estado'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $cantidad = $validate->str($_POST['cantidad'], '200', '0');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $descuento = $validate->int($_POST['descuento'], 100, 0);
            $idEstado = $_POST['estado'];
            $idTipoPromo = $_POST['tipopromo'];
            $arrayagregados = json_decode(stripslashes($_POST['agregados']));

            // *Si la imagen no existe se añade una por defecto
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
            
            
            $promos->setNombre($nombre);
            $promos->setPrecio($precio);
            $promos->setDescuento($descuento);
            $promos->setIdTipoPromo($idTipoPromo);
            $promos->setIdTipoPreparacion(2);
            $promos->setIdEstadoElemento($idEstado);
            $promos->setImgUrl($fileText);
            $promos->setCantidad($cantidad);
            $promos->setAgregados($arrayagregados);
            
            echo $promos->ingresarPromoCliente($_SESSION['user'][1]);
        }
        break;

        case 'EliminarPromo':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $promos->setIdPromo($_POST['id']);
                echo $promos->EliminarPromo($_SESSION['user'][1]);
            }
        break;
        case 'CargarModalPromoCliente':
            $promos->setIdPromo($_POST['id']);
            echo $promos->ObtenerInformacionPromoCliente();
        break;

        case 'ActualizarDatosPromoCliente';
        if($validate->check(['nombre', 'cantidad', 'precio', 'descuento', 'estado'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $cantidad = $validate->str($_POST['cantidad'], '200', '0');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $descuento = $validate->int($_POST['descuento'], 100, 0);
            $idEstado = $_POST['estado'];
            $idTipoPromo = $_POST['tipopromo'];
            $arrayagregados = json_decode(stripslashes($_POST['agregados']));

            // *Si la imagen no existe se añade una por defecto
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
            
            $promos->setIdPromo($id);
            $promos->setNombre($nombre);
            $promos->setPrecio($precio);
            $promos->setDescuento($descuento);
            $promos->setIdTipoPromo($idTipoPromo);
            $promos->setIdTipoPreparacion(1);
            $promos->setIdEstadoElemento($idEstado);
            $promos->setImgUrl($fileText);
            $promos->setCantidad($cantidad);
            $promos->setAgregados($arrayagregados);
            
            echo $promos->ActualizarDatosPromoCliente($_SESSION['user'][1]);
        }
        break;

        case 'IngresarPromoChef':
        if($validate->check(['nombre', 'cantidad', 'precio', 'descuento', 'estado'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $cantidad = $validate->str($_POST['cantidad'], '200', '0');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $descuento = $validate->int($_POST['descuento'], 100, 0);
            $idEstado = $_POST['estado'];
            $idTipoPromo = $_POST['tipopromo'];
            $arrayagregados = json_decode(stripslashes($_POST['agregados']));
            $arraytipocoberturas = json_decode(stripslashes($_POST['tipocoberturas']));

            // *Si la imagen no existe se añade una por defecto
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
            
            
            $promos->setNombre($nombre);
            $promos->setPrecio($precio);
            $promos->setDescuento($descuento);
            $promos->setIdTipoPromo($idTipoPromo);
            $promos->setIdTipoPreparacion(1);
            $promos->setIdEstadoElemento($idEstado);
            $promos->setImgUrl($fileText);
            $promos->setCantidad($cantidad);
            $promos->setAgregados($arrayagregados);
            $promos->setTipoCoberturas($arraytipocoberturas);
            
            echo $promos->ingresarPromoChef($_SESSION['user'][1]);
        }
        break;
        case 'CargarModalPromoChef':
            $promos->setIdPromo($_POST['id']);
            echo $promos->ObtenerInformacionPromoChef();
        break;
        case 'ActualizarDatosPromoChef':
        if($validate->check(['nombre', 'cantidad', 'precio', 'descuento', 'estado'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $cantidad = $validate->str($_POST['cantidad'], '200', '0');
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $descuento = $validate->int($_POST['descuento'], 100, 0);
            $idEstado = $_POST['estado'];
            $idTipoPromo = $_POST['tipopromo'];
            $arrayagregados = json_decode(stripslashes($_POST['agregados']));
            $arraytipocoberturas = json_decode(stripslashes($_POST['tipocoberturas']));

            // *Si la imagen no existe se añade una por defecto
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
            
            $promos->setIdPromo($id);
            $promos->setNombre($nombre);
            $promos->setPrecio($precio);
            $promos->setDescuento($descuento);
            $promos->setIdTipoPromo($idTipoPromo);
            $promos->setIdTipoPreparacion(1);
            $promos->setIdEstadoElemento($idEstado);
            $promos->setImgUrl($fileText);
            $promos->setCantidad($cantidad);
            $promos->setAgregados($arrayagregados);
            $promos->setTipoCoberturas($arraytipocoberturas);
            
            echo $promos->actualizarDatosPromoChef($_SESSION['user'][1]);
        }
        break;

        case 'ComprobarTipoDePromo':
            $id = $_POST['id'];
            $promos->setIdPromo($id);
            echo $promos->comprobarTipoDePromo();
        break;

        case 'ComprobarTipoCoberturasPromoChef':
            $id = $_POST['id'];
            $promos->setIdPromo($id);
            echo $promos->comprobarTipoCoberturasPromoChef();
        break;
    }
}