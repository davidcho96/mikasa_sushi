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
    <title>Gestión Promos</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
</head>
<body>

    <?php require 'templates/nav-admin.php' ?>
    <div class="row mantenedor-content">
        <div class="title-mantenedor center-align">
            <h1>Gestión Promociones</h1>
            <a class="btn-large waves-effect waves-light red modal-trigger tooltipped" data-position="bottom" data-tooltip="Añadir nueva promo" href="#modal_mantenedor_promo_chef">A gusto del chef</a>
            <a class="btn-large waves-effect waves-light red modal-trigger tooltipped" data-position="bottom" data-tooltip="Añadir nueva promo" href="#modal_mantenedor_promo_cliente">Arma tu promo</a>
        </div>
        
        <div>
        </div>
        
        <div id="mensaje_no_carta_promos"></div>
        
        <div id="mant_arma_tu_promo_carga" class="row"></div>
        
        <div id="modal_mantenedor_promo_cliente" class="modal row">
            <div class="modal-content">
                <div id="mensaje_precaucion_actualizar_promo_cliente"></div>
        
                <h5 class="center" id="accion_promo_cliente">Ingresar Arma tu Promo</h5>
                <form action="" name="form_mantenedor_promo_cliente" id="form_mantenedor_promo_cliente">
                <label id="lbl_id_promo_cliente" class="lbl-id"></label>
                    <div class="input-field">
                        <input id="txt_nombre_promo" name="txt_nombre_promo" type="text">
                        <label for="txt_nombre_promo">Nombre</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_cantidad_piezas" name="txt_cantidad_piezas" type="number">
                        <label for="txt_cantidad_piezas">Cantidad de piezas</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_precio_promo" name="txt_precio_promo" type="number">
                        <label for="txt_precio_promo">Precio</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_descuento_promo" name="txt_descuento_promo" type="number">
                        <label for="txt_descuento_promo">Descuento (%)</label>
                        <p>Precio Descuento: <p id="precio_descuento_promo"></p></p>
                    </div>
                    <div class="file-field input-field">
                        <div class="btn black">
                            <span>Imagen</span>
                            <input type="file" name="imagen_promo" id="imagen_promo" accept="image/x-png,image/jpg,image/jpeg">
                        </div>
                            <div class="file-path-wrapper">
                                <input class="file-path" type="text" id="imagen_promo_text" name="imagen_promo_text">
                            </div>
                    </div>
                    <div class="input-field">
                        <label class="active">Estado en carta</label>
                        <select name="combo_estado_elemento" id="combo_estado_elemento_form" class="browser-default">
                            
                        </select>
                    </div>
                    <div class="input-field">
                        <label class="active">Tipo promo</label>
                        <select name="combo_tipo_promo" id="combo_tipo_promo_form" class="browser-default">
                            
                        </select>
                    </div>
                    <div>
                    <ul id="lista_agregados_adicionales">
                    </ul>
                    </div>
                    <div class="row">
                        <div class="input-field col l2 m3 s3">
                            <input id="txt_cantidad_agregados" name="txt_cantidad_agregados" type="number" value="1" class="active">
                            <label for="txt_cantidad_agregados">Cantidad</label>
                        </div>
                        <div class="input-field col l9 m8 s8">
                            <label class="active">Agregados</label>
                            <select name="combo_agregados" id="combo_agregados_promo_form" class="browser-default">
                                
                            </select>
                        </div>
                        <div class="input-field col l1 m1 s1">
                        <a class="btn-floating btn-small waves-effect waves-light red" id="btn_add_agregados_promo_cliente"><i class="material-icons">add</i></a>
                        </div>
                    </div>
                    <div class="center">
                        <input type="submit" class="btn black" id="submit_mantenedor_promo" value="Confirmar">
                        <button id="cancelar_mantenedor_promo" class="btn red">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- ------------------------------------------------------------------------------------------------------------------- -->
        
        <div id="modal_mantenedor_promo_chef" class="modal row">
            <div class="modal-content">
        
                <div id="mensaje_precaucion_actualizar_promo_chef"></div>
        
                <h5 class="center" id="accion_promo_chef">Ingresar Promo A Gusto Del Chef</h5>
                <form action="" name="form_mantenedor_promo_chef" id="form_mantenedor_promo_chef">
                <label id="lbl_id_promo_chef" class="lblid"></label>
                    <div class="input-field">
                        <input id="txt_nombre_promo_chef" name="txt_nombre_promo_chef" type="text">
                        <label for="txt_nombre_promo_chef">Nombre</label>
                    </div>
                    <div class="row">
                        <div>
                            <ul id="lista_tipo_coberturas_chef" name="lista_tipo_coberturas_chef[]">
                            </ul>
                        </div>
                        <div class="input-field col l2 m3 s3">
                            <input id="txt_cantidad_tipo_coberturas_chef" name="txt_cantidad_tipo_coberturas_chef" type="number" value="10" class="active">
                            <label for="txt_cantidad_tipo_coberturas_chef">Cantidad</label>
                        </div>
                        <div class="input-field col l9 m8 s8">
                            <label class="active">Tipo Coberturas</label>
                            <select name="combo_tipo_coberturas" id="combo_tipo_coberturas_promo_form_chef" class="browser-default">
                                
                            </select>
                        </div>
                        <div class="input-field col l1 m1 s1">
                        <a class="btn-floating btn-small waves-effect waves-light red" id="btn_add_tipo_coberturas_promo_chef"><i class="material-icons">add</i></a>
                        </div>
                        <div class="input-field col l12 m12 s12">
                            <input id="txt_cantidad_piezas_chef" name="txt_cantidad_piezas_chef" value="0" type="number">
                            <label >Cantidad de piezas</label>
                        </div>
                    </div>
                    <div class="input-field">
                        <input id="txt_precio_promo_chef" name="txt_precio_promo_chef" type="number">
                        <label for="txt_precio_promo_chef">Precio</label>
                    </div>
                    <div class="input-field">
                        <input id="txt_descuento_promo_chef" name="txt_descuento_promo_chef" type="number">
                        <label for="txt_descuento_promo_chef">Descuento (%)</label>
                        <p>Precio Descuento: <p id="precio_descuento_promo_chef"></p></p>
                    </div>
                    <div class="file-field input-field">
                        <div class="btn black">
                            <span>Imagen</span>
                            <input type="file" name="imagen_promo_chef" id="imagen_promo_chef" accept="image/x-png,image/jpg,image/jpeg">
                        </div>
                            <div class="file-path-wrapper">
                                <input class="file-path" type="text" id="imagen_promo_text_chef" name="imagen_promo_text_chef">
                            </div>
                    </div>
                    <div class="input-field">
                        <label class="active">Estado en carta</label>
                        <select name="combo_estado_elemento" id="combo_estado_elemento_form_chef" class="browser-default">
                            
                        </select>
                    </div>
                    <div class="input-field">
                        <label class="active">Tipo promo</label>
                        <select name="combo_tipo_promo" id="combo_tipo_promo_form_chef" class="browser-default">
                            
                        </select>
                    </div>
                    <div>
                    <ul id="lista_agregados_adicionales_chef">
                    </ul>
                    </div>
                    <div class="row">
                        <div class="input-field col l2 m3 s3">
                            <input id="txt_cantidad_agregados_chef" name="txt_cantidad_agregados_chef" type="number" value="1" class="active">
                            <label for="txt_cantidad_agregados_chef" class="active">Cantidad</label>
                        </div>
                        <div class="input-field col l9 m8 s8">
                            <label class="active">Agregados</label>
                            <select name="combo_agregados" id="combo_agregados_promo_form_chef" class="browser-default">
                                
                            </select>
                        </div>
                        <div class="input-field col l1 m1 s1">
                        <a class="btn-floating btn-small waves-effect waves-light red" id="btn_add_agregados_promo_chef"><i class="material-icons">add</i></a>
                        </div>
                    </div>
                
                    <div class="center">
                        <input type="submit" class="btn black" id="submit_mantenedor_promo" value="Confirmar">
                        <button id="cancelar_mantenedor_promo_chef" class="btn red">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>   
    </div> 

    <script src="dist/js/script.min.js"></script>
    <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>
        <!-- <script src="src/js/es6/promo-functions.js"></script> -->
        <script>
        $(document).ready(function(){
                cargarComboAgregados();
                cargarComboEstadoElemento();
                cargarMantenedorPromosCliente();
                cargarComboTipoPromo();
                cargarComboTipoCoberturas();
                comprobarEstadoSesion();
            setInterval(function(){
                comprobarEstadoSesion();
                cargarMantenedorPromosCliente();
            }, 25000);
            $('#modal_mantenedor_promo_cliente').modal({
                dismissible: false,
                onCloseEnd: function() {
                $('#form_mantenedor_promo_cliente')[0].reset();
                $('#lbl_id_promo_cliente').text('');
                $('#precio_descuento_promo').text('');
                $('#accion_promo_cliente').text('Ingresar Agregado');
                $('#lista_agregados_adicionales').empty();
                $('#mensaje_precaucion_promo_cliente').remove();
                }
            });
            $('#modal_mantenedor_promo_chef').modal({
                dismissible: false,
                onCloseEnd: function(){
                $('#form_mantenedor_promo_chef')[0].reset();
                $('#lbl_id_promo_chef').text('');
                $('#precio_descuento_promo_chef').text('');
                $('#accion_promo_chef').text('Ingresar Promo A Gusto Del Chef');
                $('#lista_agregados_adicionales_chef').empty();
                $('#lista_tipo_coberturas_chef').empty();
                $('#mensaje_precaucion_promo_chef').remove();
                }
            });
        });
    </script>
</body>
</html>