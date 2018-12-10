<?php
// *Se requiere la sesión en el caso de utilizar el dato almanecenado del usuario activo
// *Se requiere la clase para acceder a los métodos (funciones)
// *Se requiere la clase inputValidar para acceder a los método de validación de campos del lado del servidor
require_once '../clases/IndiceEstadoCliente.php';
require_once '../clases/inputValidate.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $indiceEstadoCliente = new indiceEstadoCliente();

    switch($_REQUEST['action']){
        // *Se cargan las opciones de estado para los empleados
        case 'CargaEstadoCliente';
            echo $indiceEstadoCliente->cargaEstadoCliente();
        break;
        // *Se cargan las opciones de estado para los empleados
        case 'CargaEstadoEmpleado';
            echo $indiceEstadoCliente->cargaEstadoCliente();
        break;
    }
}