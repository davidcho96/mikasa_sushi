<?php

require_once "../clases/infoEmpresa.php"; //*Clase info empresa
require_once "../clases/inputValidate.php"; //*Clase Input para validación de campos

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') { //*Se valida que el método de solicitud sea 'POST'

    $infoempresa = new InfoEmpresa();

    switch($_REQUEST['action']){
        // *Ejecuta la función para cargar los datos en la tabla
        case 'cargarDatosInfoEmpresa':
            echo $infoempresa->cargarDatosInfoEmpresa();
        break;
        case 'ActualizarHorasActividadEmpresa':
            $infoempresa->setHoraApertura($_POST['horaInicio']);
            $infoempresa->setHoraCierre($_POST['horaCierre']);
            echo $infoempresa->actualizarHorasActividadEmpresa($_SESSION['user'][1]);
        break;
        case 'ActualizarDiasActividadEmpresa':
            $infoempresa->setDiaInicio($_POST['diaInicio']);
            $infoempresa->setDiaFinal($_POST['diaCierre']);
            echo $infoempresa->actualizarDiasActividadEmpresa($_SESSION['user'][1]);
        break;
        case 'CargarPrecioMaximo':
            echo $infoempresa->cargarPrecioMaximo();
        break;
        case 'ActualizarPrecioMaximoVenta':
            $infoempresa->setPrecioMaximo($_POST['precioMaximo']);
            echo $infoempresa->actualizarPrecioMaximoVenta();
        break;
    }
}