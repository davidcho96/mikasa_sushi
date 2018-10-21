<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Tipo promos</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />

</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor">
        <h1>Gestión Tipos de pago</h1>
        <a class="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#modal_mantenedor_tipo_promo"><i class="material-icons">add</i></a>
    </div>

    <div class="contenido-mantenedor row">
        <div class="col l6 m8 s12">
            <div class="input-field">
                <label for="txt_buscar_tipo_promo">Buscar Tipo Promo</label>
                <input type="text" id="txt_buscar_tipo_promo">
            </div>
            <table id="tabla_tipo_promo">
            <thead>
                <h5>Tipo Promo</h5>
                <tr>
                    <td>Tipo de promo</td>
                    <td colspan='2'>Acciones</td>
                </tr>
            </thead>
            <tbody id="body_tabla_tipo_promo"></tbody>
            </table>
        </div>
    </div>

    <div id="modal_mantenedor_tipo_promo" class="modal">
        <div class="modal-content">

            <div id="content_mensaje_precaucion_tipo_promo"></div>

            <h5 class="center" id="accion_tipo_promo">Ingresar Tipo Promo</h5>
            <form action="" name="form_mantenedor_tipo_promo" id="form_mantenedor_tipo_promo">
            <label id="lbl_id_tipo_promo" class="lbl-id"></label>
                <div class="input-field">
                    <input id="txt_nombre" name="txt_nombre" type="text">
                    <label for="txt_nombre">Nombre</label>
                </div>
                <div class="center">
                    <input type="submit" class="btn black" id="btn_mant_tipo_promo" value="Confirmar">
                    <button id="cancelar_mantenedor_tipo_promo" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/tipo-promo-functions.js"></script>
    <script>
    $(document).ready(function(){
        CargarTablaTipoPromo();
        $('#modal_mantenedor_tipo_promo').modal({
                dismissible: true,
                onCloseEnd: function() {
                $('#form_mantenedor_tipo_promo')[0].reset();
                $('#lbl_id_tipo_promo').text('');
                $('#accion_tipo_promo').text('Ingresar Tipo Promo');
                $('#mensaje_precaucion_tipo_promo').remove();
                }
            });
    });
    </script>
</body>
</html>