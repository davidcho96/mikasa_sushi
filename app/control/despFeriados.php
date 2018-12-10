<?php

session_start();
// *Se requiere la clase para acceder a los métodos (funciones)
require '../clases/feriados.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $feriados = new Feriados();

    switch ($_REQUEST['action']) {
        // *Se obtienen los datos del nuevo feriado y se setean en la clase feriados
        case 'IngresarFeriado':
            $descripcion = $_POST['descripcion'];
            $dia = $_POST['dia'];
            $mes = $_POST['mes'];
        // *se setean los parámetros en la clase
            $feriados->setDescripcion($descripcion);
            $feriados->setDia($dia);
            $feriados->setMes($mes);

            echo $feriados->ingresarFeriado($_SESSION['user'][1]);
            break;
        // *Se actualizan los datos del feriado en base a lo ingresado
        case 'ActualizarDatosFeriado':
            $id = $_POST['id'];
            $descripcion = $_POST['descripcion'];
            $dia = $_POST['dia'];
            $mes = $_POST['mes'];

            $feriados->setIdFeriado($id);
            $feriados->setDescripcion($descripcion);
            $feriados->setDia($dia);
            $feriados->setMes($mes);

            echo $feriados->actualizarFeriado($_SESSION['user'][1]);
            break;
        // *Se carga la tabla de feriados registrados
        case 'CargarMantenedorFeriados':
            echo $feriados->cargarMantenedorFeriados();
            break;
        // *Se setean el id del feriado a eliminar
        case 'EliminarFeriado':
            $idFeriado = $_POST['id'];

            $feriados->setIdFeriado($idFeriado);
            echo $feriados->eliminarFeriado($_SESSION['user'][1]);
            break;
        // *Se obtienen los datos del feriado seleccionado para actualizar
        case 'CargarModalActualizarFeriado':
            $idFeriado = $_POST['id'];

            $feriados->setIdFeriado($idFeriado);
            echo $feriados->cargarDatosModalFeriado();
            break;
    }
}