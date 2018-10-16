<?php

require_once "../clases/tipoCoberturas.php";
require_once "../clases/inputValidate.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $tipocoberturas = new TipoCoberturas();

    function array_push_assoc(&$array, $key, $value){
        $array[$key] = $value;
        return $array;
    }

    switch($_REQUEST['action']){
        case 'CargarMantenedorTablaTipoCoberturas':
            echo $tipocoberturas->CargarTablaTipoCoberturas();
        break;

        case 'IngresarTipoCobertura':
        if($validate->check(['nombre'], $_REQUEST)){
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $arraycoberturas = json_decode(stripslashes($_POST['coberturas']));


            $tipocoberturas->setNombre($nombre);
            $tipocoberturas->setCoberturas($arraycoberturas);

            echo $tipocoberturas->IngresarTipoCoberturas($_SESSION['user'][1]);
            // echo json_encode($arraycoberturas);
            // echo json_encode($tipocoberturas->getCoberturas());
            // $tipocoberturas->setNombre();
        }
        break;
        
        case 'ActualizarTipoCobertura':
        if($validate->check(['nombre'], $_REQUEST)){
            $id = $_POST['id'];
            $nombre = $validate->str($_POST['nombre'], '100', '3');
            $arraycoberturas = json_decode(stripslashes($_POST['coberturas']));

            $tipocoberturas->setIdTipoCobertura($id);
            $tipocoberturas->setNombre($nombre);
            $tipocoberturas->setCoberturas($arraycoberturas);

            echo $tipocoberturas->actualizarDatosTipoCoberturas($_SESSION['user'][1]);
        }
        break;
        
        case 'EliminarTipoCobertura':
            if(isset($_SESSION['user'][1]) && $_SESSION['user'][1] != 'NULL'){
                $tipocoberturas->setIdTipoCobertura($_POST['id']);
                echo $tipocoberturas->EliminarTipoCobertura($_SESSION['user'][1]);
            }
        break;
        // *Ejecuta la función que obtendrá los datos para cargar el combobox
        case 'CargarComboTipoCoberturas':
                echo $tipocoberturas->CargarComboTipoCoberturas();
        break;
    }
}