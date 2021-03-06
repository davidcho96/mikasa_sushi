<?php 
session_start();

require 'templates/session.php';

$sesionUsuario = new Sesion();

$sesionUsuario->validarSesionMantenedores();

$sesionUsuario->validacionSesionAdmin();

// $sesionUsuario->validarEstadoSesion();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Coberturas Mikasa</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="src/css/ManCliente.css">
</head>
<body>
<nav class="top-nav background red">
        <div class="container">
            <div class="nav-wrapper">
                <div class="row">
                    <div class="col s12 m10 l10 offset-l1">
                        <h1 class="center-align">Mantenedor Clientes</h1>
                    </div>
                </div>
            </div>
        </div>
    </nav>
<?php
require_once "templates/nav-admin.php";
?>
<!-- Seccion de las tablas de carga de informacion-->
<div class="container">
    <div class="row">
        <div class="col s12 m12 l12">
            <div>
                <label for="">Filtro Cliente</label>
                <input type="text" name="" id="txt_filtro_cliente">
            </div>
            <div class="">
                <table  cellpadding="1" cellspacing="1" class="table table-hover" id='tabla_filtro_cliente'>
                    <thead>
                        <tr class="">
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Telefono</th>
                            <th>Correo</th>
                            <th>Estado</th>
                            <th colspan="2">Accion</th>
                        </tr>
                    </thead>
                    <tbody id="tabla_clientes">
                    </tbody>
                </table>
                <div class="col-md-12 center text-center">
	                <span class="left" id="total_reg"></span>
                    <ul class="pagination" id="paginacion"></ul>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal de actualizar cliente -->
    <div>
        <form name="ActualizaCliente" id="ActualizaCliente">
            <div id="modal-actualiza-cliente" class="modal info-perfil-content">
                <div class="modal-content">
                <div id="content_mensaje_precaucion_clientes"></div>
                    <h4 class="center-align">Modificar Usuario</h4>
                    <label id="lbl_id_clientes" class=""></label>
                    <div class="row">
                        <div class="row">
                            <div class="input-field col s12">
                                <input placeholder="Placeholder" name="txt_nombre" id="txt_nombre" type="text" class="validate">
                                <label for="txt_nombre">Nombre</label>
                            </div>
                            <div class="input-field col s12">
                                <input id="txt_apellidos" name="txt_apellidos" type="text" class="validate">
                                <label for="txt_apellidos">Apellido</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="txt_email" name="txt_email" type="text" class="validate">
                                <label for="txt_email">Correo</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="txt_telefono" name="txt_telefono" type="number" class="validate">
                                <label for="txt_telefono">telefono</label>
                            </div>
                        </div>
                        <div class="input-field col s12">
                            <label class="active">Estado Cliente</label>
                            <select name="combo_EstadoClientes" id="combo_EstadoClientes" class="browser-default">
                            </select>
                        </div>
                        <div class="col s10 offset-s1 center-align">
                            <button class="btn waves-effect waves-light btn-large background red" type="submit" name="action">
                                Actualizar<i class="material-icons right">send</i>
                            </button>
                            <button class="btn waves-effect waves-light btn-large background red" id="cancelar_actualizar_cliente">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- Formulario de ingreso de los mantenedores-->
    <form class="row" id="form_registro2" action="" method="POST">
        <div class="container col s12 m12 l12 ">
            <div class="row">
                <div class="card grey lighten-3" style="width: 100%;">
                    <div class="card-content">
                        <span class="card-title">Ingreso de Clientes</span>
                        <div class="row">
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="txt_nombre" id="nombre" type="text" class="validate">
                                    <label for="nombre">Nombre</label>
                                </div>
                                <div class="input-field col s12">
                                    <input id="apellidos" name="txt_apellidos" type="text" class="validate">
                                    <label for="apellidos">Apellido</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input id="email" name="txt_email" type="text" class="validate">
                                    <label for="email">Correo</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input id="password" name="txt_password" type="password" class="validate">
                                    <label for="password">Contraseña</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input id="telefono" name="txt_telefono" type="text" class="validate">
                                    <label for="telefono">Telefono</label>
                                </div>
                            </div>
                            <div class="col s10 offset-s1 center-align">
                                <button class="btn waves-effect waves-light btn-large background red" type="submit"
                                    name="action">
                                    Registrar<i class="material-icons right">send</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

<script src="dist/js/script.min.js"></script>
<!-- <script src="src/js/es6/funciones-admin.js"></script> -->
<script>
    $(document).ready(function () {
        CargaEstadoCliente();
        CargarTablaClientes();
        setInterval(function(){
            CargaEstadoCliente();
            CargarTablaClientes();
        }, 25000);
        $('#modal-actualiza-cliente').modal({
            dismissible: true,
            onCloseEnd: function () {
                $('#lbl_id_clientes').text('');
            }
        });
    });
</script>
</body>

</html>