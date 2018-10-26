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
    <title>Información de contacto</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />

</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="container">
        <div>
            <h1>Gestión Info Empresa</h1>
            <div id="content_estado_apertura_local"></div>
            <div class="row">
                <div class="col l6 m6 s12">
                    <h5>Horario de atención</h5>
                    <form id="form_horas_actividad_empresa">
                    <p class="col l2 m2 s2">Desde</p>
                    <div class="input-field col l4 m4 s4">
                        <input id="txt_hora_inicio" name="txt_hora_inicio" type="time">
                        <label for="txt_hora_inicio">Hora Apertura</label>
                    </div>
                    <p class="col l2 m2 s2">Hasta</p>
                    <div class="input-field col l4 m4 s4">
                        <input id="txt_hora_final" name="txt_hora_final" type="time">
                        <label for="txt_hora_final">Hora Cierre</label>
                    </div>
                    <div class="center">
                        <input type="submit" class="btn black" id="btn_mant_horas_actividad" value="Cambiar">
                        <button id="restaurar_mantenedor_horas_actividad" class="btn red">Reestablecer</button>
                    </div>
                    </form>
                </div>
                <div class="col l6 m6 s12">
                    <h5>Dias de actividad</h5>
                    <p class="col l2 m2 s2">Desde</p>
                    <form id="form_dias_actividad_empresa">
                    <div class="input-field col l4 m4 s4">
                        <label class="active">Día Apertura</label>
                        <select name="combo_dia_inicio" id="combo_dia_inicio" class="browser-default">
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                            <option value="7">Domingo</option>
                        </select>
                    </div>
                    <p class="col l2 m2 s2">Hasta</p>
                    <div class="input-field col l4 m4 s4">
                        <label class="active">Día Cierre</label>
                        <select name="combo_dia_final" id="combo_dia_final" class="browser-default">
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                            <option value="7">Domingo</option>
                        </select>
                    </div>
                    <div class="center">
                        <input type="submit" class="btn black" id="btn_mant_dias_actividad" value="Cambiar">
                        <button id="restaurar_mantenedor_dias_actividad" class="btn red">Reestablecer</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="title-mantenedor">
            <h1>Gestión Información de contacto</h1>
            <a class="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#modal_mantenedor_info_contacto"><i class="material-icons">add</i></a>
        </div>
        
        <div class="contenido-mantenedor row">
            <div class="col l12 m12 s12">
                <div class="input-field">
                    <label for="txt_buscar_info_contacto">Buscar Información de Contacto</label>
                    <input type="text" id="txt_buscar_info_contacto">
                </div>
                <table id="tabla_info_contacto">
                <thead>
                    <h5>Información de Contacto</h5>
                    <tr>
                        <td>Medio de Contacto</td>
                        <td>Información de Contacto</td>
                        <td colspan='2'>Acciones</td>
                    </tr>
                </thead>
                    <tbody id="body_tabla_info_contacto"></tbody>
                </table>
            </div>
        </div>
        
        <div id="modal_mantenedor_info_contacto" class="modal">
            <div class="modal-content">
        
                <div id="content_mensaje_precaucion_info_contacto"></div>
        
                <h5 class="center" id="accion_info_contacto">Ingresar Información de Contacto</h5>
                <form action="" name="form_mantenedor_info_contacto" id="form_mantenedor_info_contacto">
                <label id="lbl_id_info_contacto" class="lblid"></label>
                    <div class="input-field">
                        <input id="txt_medio_info_contacto" name="txt_medio_info_contacto" type="text">
                        <label for="txt_medio_info_contacto">Medio Contacto (ej: Facebook, Teléfono)</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_info_contacto" name="txt_info_contacto" type="text">
                        <label for="txt_info_contacto">Información de Contacto</label>
                    </div>
                    <div class="center">
                        <input type="submit" class="btn black" id="btn_mant_info_contacto" value="Confirmar">
                        <button id="cancelar_mantenedor_info_contacto" class="btn red">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div class="container">

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/funciones-infoContacto.js"></script>
    <script>
    $(document).ready(function(){
        CargarTablaInfoContacto();
        CargarDatosInfoEmpresa();
        setInterval(function (){
            CargarTablaInfoContacto();
        }, 25000);
        $('#modal_mantenedor_info_contacto').modal({
                dismissible: true,
                onCloseEnd: function() {
                $('#form_mantenedor_info_contacto')[0].reset();
                $('#lbl_id_info_contacto').text('');
                $('#accion_info_contacto').text('Ingresar Información de Contacto');
                $('#mensaje_precaucion_info_contacto').remove();
                }
            });
    });
    </script>
</body>
</html>