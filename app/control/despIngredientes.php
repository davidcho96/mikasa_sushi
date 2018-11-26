<?php

require_once "../clases/ingredientes.php";
require_once "../clases/inputValidate.php"; //*Clase input para validación de campos

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $validate = new Input();
    $ingredientes = new Ingredientes();

    switch($_POST['action']){
        case 'CargarMantenedorIngredientes':
                echo $ingredientes->CargarMantenedorIngredientes();
        break;
        case 'EliminarIngrediente':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $ingredientes->setIdIngrediente($_POST['id']);
                echo $ingredientes->EliminarIngrediente($_SESSION['user'][1]);
            }
        break;
        case 'IngresarIngrediente':
        if($validate->check(['nombre', 'stock', 'unidadStock', 'uso', 'unidadUso', 'minima'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            // $stock = $validate->int($_POST['stock'], 1000, 1);
            // $uso = $validate->int($_POST['uso'], 10000, 1);
            // $minima = $validate->int($_POST['minima'], 1000, 1);
            
            $stock = $_POST['stock'];
            $uso = $_POST['uso'];
            $minima = $_POST['minima'];
            
            $ingredientes->setNombre($nombre);
            $ingredientes->setCantidadStock($stock);
            $ingredientes->setUnidadStock($_POST['unidadStock']);
            $ingredientes->setCantidadUso($uso);
            $ingredientes->setCantidadMinima($minima);
            
            echo $ingredientes->ingresarIngrediente($_SESSION['user'][1]);
        }
        break;
        case 'ActualizarDatosIngrediente':
        if($validate->check(['nombre', 'stock', 'unidadStock', 'uso', 'unidadUso', 'minima'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            // $stock = $validate->int($_POST['stock'], 1000, 1);
            // $uso = $validate->int($_POST['uso'], 10000, 1);
            // $minima = $validate->int($_POST['minima'], 1000, 1);

            $stock = $_POST['stock'];
            $uso = $_POST['uso'];
            $minima = $_POST['minima'];
            
            $ingredientes->setIdIngrediente($id);
            $ingredientes->setNombre($nombre);
            $ingredientes->setCantidadStock($stock);
            $ingredientes->setUnidadStock($_POST['unidadStock']);
            $ingredientes->setCantidadUso($uso);
            $ingredientes->setCantidadMinima($minima);
            
            echo $ingredientes->actualizarIngrediente($_SESSION['user'][1]);
            break;
        }
        case 'CargarModalIngrediente':
            $ingredientes->setIdIngrediente($_POST['id']);
            echo $ingredientes->ObtenerInformacionIngrediente();
            break;
    }
}