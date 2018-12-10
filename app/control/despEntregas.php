<?php

session_start();
require '../clases/entregas.php';

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $entrega = new Entregas();

    switch($_POST['action']){
        // *Carga la tabla de entregas pendientes en el menú administrador
        case 'CargarTablaEntregasPendientes':
            echo $entrega->cargarTablaEntregasPendientes();
        break;
        // *Carga la tabla privada de las entregas pendientes vinculadas al repartidor
        case 'CargarTablaMisEntregasPendientesRepartidor':
            echo $entrega->cargarTablaMisEntregasPendientesRepartidor($_SESSION['user'][1]);
        break;
        // *Carga los datos de la tabla mis entregas realizadas del repartidor
        case 'CargarTablaMisEntregasRealizadas':
            echo $entrega->cargarTablaMisEntregasRealizadas($_SESSION['user'][1]);
        break;
        // *Se corrobora el tipo de entrega de la venta para luego emplear una acción
        case 'CorroborarTipoEntrega':
            $entrega->setIdEntrega($_POST['IdEntrega']);
            $entrega->setCodigoVenta($_POST['CodigoVenta']);
            echo $entrega->corroborarTipoEntrega();
        break;
        // *Se cargan las opciones(estados) posibles para la entrega en el local
        case 'CargarOpcionesEntregaLocal':
            echo $entrega->cargarOpcionesEntregaLocal();
        break;
        // *Se cargan las opciones(estados) posibles para la entrega a domicilio
        case 'CargarOpcionesEntregaDomicilio':
            echo $entrega->cargarOpcionesEntregaDomicilio();
        break;
        case 'ActualizarEstadoEntregaAdmin':
        // *Se actualiza el estado de la entrega en base a lo seleccionado por el admin
            $entrega->setIdEstadoEntrega($_POST['IdEstadoEntrega']);
            $entrega->setIdEntrega($_POST['IdEntrega']);
            echo $entrega->actualizarEstadoEntrega($_SESSION['user'][1]);
        break;
        // *Se carga la tabla entregas pendientes en el index-repartidor
        // *Son solo las entregas pendientes que sean a domicilio
        case 'CargarTablaEntregasPendientesRepartidor':
            echo $entrega->cargarTablaEntregasPendientesRepartidor();
            break;
        // *Se obtienen los datos vinculados a la entrega
        // *(dirección, hora de entrega, etc).
        case 'ObtenerDatosPedidoPendienteRepartidor':
            $entrega->setIdEntrega($_POST['IdEntrega']);
            $entrega->setCodigoVenta($_POST['CodigoVenta']);
            echo $entrega->obtenerDatosPedidoPendienteRepartidor();
            break;
        case 'CambiarEstadoEntregaEnCaminoRepartidor':
        // *Se cambia el estado de la entrega al momento que el repartidor decide adjudicarse la entrega
            $entrega->setIdEntrega($_POST['IdEntrega']);
            $entrega->setCodigoVenta($_POST['CodigoVenta']);
            $entrega->setIdEstadoEntrega(4);
            echo $entrega->cambiarEstadoEntregaRepartidor($_SESSION['user'][1]);
            break;
        // *Se cambia el estado de la entrega a entregado
        case 'FinalizarEntregaPedido':
            $entrega->setIdEntrega($_POST['IdEntrega']);
            $entrega->setCodigoVenta($_POST['CodigoVenta']);
            $entrega->setIdEstadoEntrega(6);
            echo $entrega->finalizarEntregaPedido($_SESSION['user'][1]);
            break;
        // *Se carga el estado de las compras realizadas por el cliente en el módulo mis órdenes
        case 'CargarTrackingMisOrdenes':
            echo $entrega->cargarTrackingMisOrdenes($_SESSION['user'][1]);
            break;
        case 'CancelarEntregaPedido':
            // *Dependiendo del motivo seleccionado en el radio button se ingresa el texto asociado
            // *Si el motivo es otro se ingresa el especificado en el input text
            switch($_POST['idMotivo']){
                case '1':
                    $entrega->setMotivoCancelacion('Dirección no encontrada.');
                    break;
                case '2':
                    $entrega->setMotivoCancelacion('No se encontraba receptor.');
                    break;
                case '3':
                    $entrega->setMotivoCancelacion('El pago no pudo ser realizado.');
                    break;
                case '4':
                    $entrega->setMotivoCancelacion($_POST['motivo']);
                    break;
            }
            // *Se setea el id de la entrega a cancelar
            $entrega->setIdEntrega($_POST['idEntrega']);
            echo $entrega->cancelarEntrega($_SESSION['user'][1]);
            break;
        // *Se cargan los datos de la tabla entregas canceladas en el módulo del admin
        case 'CargarTablaEntregasCanceladas':
            echo $entrega->cargarTablaEntregasCanceladas();
            break;
        // *Se cargan los datos de la tabla entregas realizadas en el módulo del admin
        case 'CargarTablaEntregasRealizadas':
            echo $entrega->cargarTablaEntregasRealizadas();
            break;
    }
}