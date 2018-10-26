<?php 
session_start();

require_once "../clases/agregados.php"; //*Clase agregados
require_once "../clases/inputValidate.php"; //*Clase input para validación de campos


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos
    
    $agregados = new Agregados();

    switch($_REQUEST['action']){
        case 'CargarMantenedorAgregados':
                echo $agregados->CargarMantenedorAgregados();
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
                $unidades = $validate->int($_POST['unidades'], 2000, 1);
                $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
                $precio = $validate->int($_POST['precio'], 1000000, 0);
                $descuento = $validate->int($_POST['descuento'], 100, 0);
                $idEstado = $_POST['estado'];

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

            $agregados->setIdAgregados($id);
            $agregados->setNombre($nombre);
            $agregados->setDescripcion($descripcion);
            $agregados->setUnidades($unidades);
            $agregados->setPrecio($precio);
            $agregados->setDescuento($descuento);
            $agregados->setIdEstado($idEstado);
            $agregados->setImgUrl($fileText);

            echo $agregados->actualizarDatos($_SESSION['user'][1]);
        }
        break;

        case 'IngresarAgregados':
        if($validate->check(['nombre', 'descripcion', 'precio', 'descuento', 'estado'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
            $unidades = $validate->int($_POST['unidades'], 2000, 1);
            $precio = $validate->int($_POST['precio'], 1000000, 0);
            $descuento = $validate->int($_POST['descuento'], 100, 0);
            $idEstado = $_POST['estado'];

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
            
            
            $agregados->setNombre($nombre);
            $agregados->setDescripcion($descripcion);
            $agregados->setUnidades($unidades);
            $agregados->setPrecio($precio);
            $agregados->setDescuento($descuento);
            $agregados->setIdEstado($idEstado);
            $agregados->setImgUrl($fileText);
            
            echo $agregados->ingresarAgregados($_SESSION['user'][1]);
        }
        break;
        // *Ejecuta la función que obtendrá los datos para cargar el combobox
        case 'CargarComboAgregados':
            echo $agregados->CargarComboAgregados();
        break;
        case 'ComprobarVinculacionAgregados':
            $agregados->setIdAgregados($_POST['id']);
            echo $agregados->comprobarVinculacionAgregados();
        break;
    }
}
