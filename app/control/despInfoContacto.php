<?php

require_once "../clases/infoContacto.php"; //*Clase info Contacto
require_once "../clases/inputValidate.php"; //*Clase Input para validación de campos

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') { //*Se valida que el método de solicitud sea 'POST'

    $validate = new Input();
    //*Se instancia la clase para la validación de campos
    $infoContacto = new InfoContacto();

        switch($_REQUEST['action']){
            // *Ejecuta la función para cargar los datos en la tabla
            case 'CargarMantenedorInfoContacto':
                echo $infoContacto->cargaTablaInfoContacto();
            break;
            // *--------------------------------------------------

            case 'EliminarInfoContacto':
                $infoContacto->setIdInfoContacto($_REQUEST['id']);
                echo $infoContacto->eliminarInfoContacto();
            break; 
           // *----------------------------------------------------
           case 'CargarModalActualizarInfoContacto':
                $infoContacto->setIdInfoContacto($_POST['id']);
                echo $infoContacto->cargaModalInfoContacto();
           break;
           // *----------------------------------------------------
           case 'ActualizarInfoContacto':
           if($validate->check(['medio', 'info'], $_REQUEST)){
                $id = $_POST['id'];
                $infoContacto->setIdInfoContacto($id);
                $infoContacto->setMedioContacto($_POST['medio']);
                $infoContacto->setInfoContacto($_POST['info']);
                echo $infoContacto->ActualizaInfoContacto($_SESSION['user'][1]);
           }
           break;
           case 'IngresarInfoContacto':
           if($validate->check(['medio', 'info'], $_REQUEST)){
                $infoContacto->setMedioContacto($_POST['medio']);
                $infoContacto->setInfoContacto($_POST['info']);
                echo $infoContacto->IngresaInfoContacto($_SESSION['user'][1]);
           }
           break;
        }
}