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
    <!-- <link rel="stylesheet" href="src/css/ManCliente.css"> -->
</head>
<body>
<?php
require_once "templates/nav-admin.php";
?>
<!-- Seccion de las tablas de carga de informacion-->
<div class="container">
    <h5>Mantenedor clientes</h5>
    <div class="row">
        <div class="col s12 m12 l12">
            <div>
                <label for="">Filtro Cliente</label>
                <input type="text" name="" id="txt_filtro_cliente">
            </div>
            <div style="overflow-x:auto;">
                <table id='tabla_filtro_cliente' class="striped">
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
</div>
    <!-- Modal de actualizar cliente -->
    <div id="modal-actualiza-cliente" class="modal info-perfil-content">
        <div class="modal-content">
            <form name="ActualizaCliente" id="ActualizaCliente">
                <div id="content_mensaje_precaucion_clientes"></div>
                    <h4 class="center-align">Modificar Usuario</h4>
                    <label id="lbl_id_clientes" class="lbl-id"></label>
                    <div class="">
                            <div class="input-field">
                                <input placeholder="Placeholder" name="txt_nombre" id="txt_nombre" type="text" class="validate">
                                <label for="txt_nombre">Nombre</label>
                            </div>
                            <div class="input-field">
                                <input id="txt_apellidos" name="txt_apellidos" type="text" class="validate">
                                <label for="txt_apellidos">Apellido</label>
                            </div>
                            <div class="input-field">
                                <input id="txt_email" name="txt_email" type="text" class="validate">
                                <label for="txt_email">Correo</label>
                            </div>
                            <div class="input-field">
                                <p class="prefix" style="font-size: 16px; margin-top: 6px;">+56 9</p>
                                <input id="txt_telefono" name="txt_telefono" type="number" class="validate">
                                <label for="txt_telefono">Teléfono</label>
                            </div>
                        <div class="input-field">
                            <label class="active">Estado Cliente</label>
                            <select name="combo_EstadoClientes" id="combo_EstadoClientes" class="browser-default">
                            </select>
                        </div>
                        <div class="center-align">
                            <button class="btn black" type="submit" name="action">
                                Actualizar
                            </button>
                            <button class="btn red" id="cancelar_actualizar_cliente">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
        </div>
    </div>
    <!-- Formulario de ingreso de los mantenedores-->
<div class="container row">
    <form class="row" id="form_registro2" action="" method="POST">
        <div class="card lighten-3 col s12 m12 l12">
            <div class="card-content">
                <span class="card-title">Ingreso de Clientes</span>
                <div class="input-field">
                    <input name="txt_nombre" id="nombre" type="text" class="validate">
                    <label for="nombre">Nombre</label>
                </div>
                <div class="input-field">
                    <input id="apellidos" name="txt_apellidos" type="text" class="validate">
                    <label for="apellidos">Apellido</label>
                </div>
                <div class="input-field">
                    <input id="email" name="txt_email" type="text" class="validate">
                    <label for="email">Correo</label>
                </div>
                <div class="input-field">
                    <input id="password" name="txt_password" type="password" class="validate">
                    <label for="password">Contraseña</label>
                </div>
                <div class="input-field">
                    <p class="prefix" style="font-size: 16px; margin-top: 6px;">+56 9</p>
                    <label for="telefono">Teléfono</label>
                    <input id="telefono" name="txt_telefono" type="text">
                </div>
                <div class="center-align">
                    <button class="btn black" type="submit"
                        name="action">
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>

<script src="dist/js/script.min.js"></script>
<!-- <script src="src/js/es6/funciones-admin.js"></script> -->
<script>
    $(document).ready(function () {
        comprobarEstadoSesion();
        CargaEstadoCliente();
        CargarTablaClientes();
        cargarNotificaciones();
        
        setInterval(function(){
            // CargarTablaClientes();
            comprobarEstadoSesion();
            cargarNotificaciones();
        }, 60000);
        $('#modal-actualiza-cliente').modal({
            dismissible: false,
            onCloseEnd: function () {
                $('#lbl_id_clientes').text('');
            }
        });
    });
</script>
</body>

</html>