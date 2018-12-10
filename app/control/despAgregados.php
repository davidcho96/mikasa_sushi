<?php 
session_start();

// *Se requiere la sesión en el caso de utilizar el dato almanecenado del usuario activo
// *Se requiere la clase para acceder a los métodos (funciones)
// *Se requiere la clase inputValidar para acceder a los método de validación de campos del lado del servidor
require_once "../clases/agregados.php"; //*Clase agregados
require_once "../clases/inputValidate.php"; //*Clase input para validación de campos


// *Se valida que la solicitud sea del tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos
    
    $agregados = new Agregados();

    switch($_REQUEST['action']){
        // *Se carga la tabla de agregados
        case 'CargarMantenedorAgregados':
                echo $agregados->CargarMantenedorAgregados();
        break;
        // *Se carga la tabla de agregados en el menú disponible para el cliente
        case 'CargarCartaAgregados':
                echo $agregados->CargarCartaAgregados();
        break;
        // *Se obtienen los datos del agregado seleccionado en la tabla
        case 'EliminarAgregado':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $agregados->setIdAgregados($_POST['id']);
                echo $agregados->EliminarAgregado($_SESSION['user'][1]);
            }
        break;
        // *Se obtienen los datos del agregado seleccionado para la actualización
        case 'CargarModalAgregado':
            $agregados->setIdAgregados($_POST['id']);
            echo $agregados->ObtenerInformacionAgregado();
            break;
            
            case 'ActualizarDatosAgregados':
            // *Se validan los datos ingresados en form
            if($validate->check(['nombre', 'descripcion', 'precio', 'descuento', 'estado'], $_REQUEST)){
                $id = $_POST['id'];
                $nombre = $validate->str($_POST['nombre'], '100', '3');
                $unidades = $validate->int($_POST['unidades'], 2000, 1);
                $descripcion = $validate->str($_POST['descripcion'], '1000', '3');
                $precio = $validate->int($_POST['precio'], 1000000, 0);
                $descuento = $validate->int($_POST['descuento'], 100, 0);
                $idEstado = $_POST['estado'];

                // *Si la imagen no existe se ingresa misma por lo que en bd no se cambia la url de imagen 
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

            // *Se setean los datos en la clase agregados
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
        // *Se validan los datos ingresados en form
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
        // *Se comprueba si el agregado está vinculado a una promo para verificar si puede ser eliminada
        case 'ComprobarVinculacionAgregados':
            $agregados->setIdAgregados($_POST['id']);
            echo $agregados->comprobarVinculacionAgregados();
        break;
    }
}
