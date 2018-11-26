<?php

session_start();
require '../clases/entregas.php';

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $entrega = new Entregas();

    switch($_POST['action']){
        case 'CargarTablaEntregasPendientes':
            echo $entrega->cargarTablaEntregasPendientes();
        break;
        case 'CargarTablaMisEntregasPendientesRepartidor':
            echo $entrega->cargarTablaMisEntregasPendientesRepartidor($_SESSION['user'][1]);
        break;
        case 'CargarTablaMisEntregasRealizadas':
            echo $entrega->cargarTablaMisEntregasRealizadas($_SESSION['user'][1]);
        break;
        case 'CorroborarTipoEntrega':
            $entrega->setIdEntrega($_POST['IdEntrega']);
            $entrega->setCodigoVenta($_POST['CodigoVenta']);
            echo $entrega->corroborarTipoEntrega();
        break;
        case 'CargarOpcionesEntregaLocal':
            echo $entrega->cargarOpcionesEntregaLocal();
        break;
        case 'CargarOpcionesEntregaDomicilio':
            echo $entrega->cargarOpcionesEntregaDomicilio();
        break;
        case 'ActualizarEstadoEntregaAdmin':
            $entrega->setIdEstadoEntrega($_POST['IdEstadoEntrega']);
            $entrega->setIdEntrega($_POST['IdEntrega']);
            echo $entrega->actualizarEstadoEntrega();
        break;
        case 'CargarTablaEntregasPendientesRepartidor':
            echo $entrega->cargarTablaEntregasPendientesRepartidor();
            break;
        case 'ObtenerDatosPedidoPendienteRepartidor':
            $entrega->setIdEntrega($_POST['IdEntrega']);
            $entrega->setCodigoVenta($_POST['CodigoVenta']);
            echo $entrega->obtenerDatosPedidoPendienteRepartidor();
            break;
        case 'CambiarEstadoEntregaEnCaminoRepartidor':
            $entrega->setIdEntrega($_POST['IdEntrega']);
            $entrega->setCodigoVenta($_POST['CodigoVenta']);
            $entrega->setIdEstadoEntrega(4);
            echo $entrega->cambiarEstadoEntregaRepartidor($_SESSION['user'][1]);
            break;
        case 'FinalizarEntregaPedido':
            $entrega->setIdEntrega($_POST['IdEntrega']);
            $entrega->setCodigoVenta($_POST['CodigoVenta']);
            $entrega->setIdEstadoEntrega(6);
            echo $entrega->finalizarEntregaPedido($_SESSION['user'][1]);
            break;
        case 'CargarTrackingMisOrdenes':
            echo $entrega->cargarTrackingMisOrdenes($_SESSION['user'][1]);
            break;
    }
}