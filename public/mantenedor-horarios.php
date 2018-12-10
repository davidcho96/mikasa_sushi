<?php 
session_start();

require 'templates/session.php';

$sesionUsuario = new Sesion();

$sesionUsuario->validarSesionMantenedores();

$sesionUsuario->validacionSesionAdmin();

$sesionUsuario->validarEstadoSesion();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Gestión feriados</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />

</head>
<body>
<?php require 'templates/nav-admin.php' ?>
    <div class="container">
        <div class="title-mantenedor center">
            <h5>Gestión Feriados</h5>
            <a class="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#modal_mantenedor_feriados"><i class="material-icons">add</i></a>
        </div>
        
        <div class="contenido-mantenedor row">
            <div class="col l12 m12 s12">
                <div class="input-field col l4 m4 s12">
                    <label for="txt_buscar_feriado">Buscar Feriado</label>
                    <input type="text" id="txt_buscar_feriado">
                </div>
               <div style="overflow-x:auto;" class="col l12 m12 s12">
                    <table id="tabla_feriados">
                    <thead>
                        <h5>Feriados</h5>
                        <tr>
                            <td>Fecha(Dia/Mes)</td>
                            <td>Descripción</td>
                            <td colspan='2'>Acciones</td>
                        </tr>
                    </thead>
                        <tbody id="body_tabla_feriados"></tbody>
                    </table>
               </div>
            </div>
        </div>
        
        <div id="modal_mantenedor_feriados" class="modal">
            <div class="modal-content">
                <div id="content_mensaje_precaucion_feriados"></div>
                <h5 class="center" id="accion_info_feriado">Ingresar Feriado</h5>
                <form action="" name="form_mantenedor_feriados" id="form_mantenedor_feriados">
                <label id="lbl_id_feriado" class="lbl-id"></label>
                    <div class="input-field">
                        <input id="txt_descripcion_feriado" name="txt_descripcion_feriado" type="text">
                        <label for="txt_descripcion_feriado">Descripción</label>
                    </div>
                    <div class="input-field">
                        <label class="active">Día</label>
                        <select name="combo_dia_feriado" id="combo_dia_feriado" class="browser-default">
                            <option value="" disabled selected>Selecciona el día</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                        </select>
                    </div>
                    <div class="input-field">
                       <label class="active">Mes</label>
                       <select name="combo_mes_feriado" id="combo_mes_feriado" class="browser-default">
                            <option value="" disabled selected>Selecciona el mes</option>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                       </select>
                    </div>
                    <div class="center">
                        <input type="submit" class="btn black" id="btn_mant_info_contacto" value="Confirmar">
                        <button id="cancelar_mantenedor_feriados" class="btn red">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    <!-- </div> -->

    <script src="dist/js/script.min.js"></script>
    <!-- <script src="src/js/es6/feriados-functions.js"></script> -->
    <script>
    $(document).ready(function(){
        cargarNotificaciones();
        cargarMantenedorFeriados();
        setInterval(function (){
            comprobarEstadoSesion();
            cargarNotificaciones();
        }, 60000);
        $('#modal_mantenedor_feriados').modal({
            dismissible: false,
            onCloseEnd: function() {
            $('#form_mantenedor_feriados')[0].reset();
            $('#lbl_id_feriado').text('');
            $('#accion_info_feriado').text('Ingresar Información de Contacto');
            $('#mensaje_precaucion_info_feriado').remove();
            }
        });
    });
    </script>
</body>
</html>