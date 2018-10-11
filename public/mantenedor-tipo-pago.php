<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Rellenos Mikasa</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />

</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor">
        <h1>Gestión Tipos de pago</h1>
        <a class="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#modal-mantenedor-tipo-pago"><i class="material-icons">add</i></a>
    </div>

    <div class="contenido-mantenedor row">
        <div class="col l6 m8 s12">
            <div class="input-field">
                <label for="txt_buscar_tipo_pago">Buscar Tipo Pago</label>
                <input type="text" id="txt_buscar_tipo_pago">
            </div>
            <table id="tabla_tipo_pago">
            <thead>
                <h5>Tipo Pago</h5>
                <tr>
                    <td>Tipo de pago</td>
                    <td colspan='2'>Acciones</td>
                </tr>
            </thead>
            <tbody id="body_tabla_tipo_pago"></tbody>
            </table>
        </div>
    </div>

    <div id="modal-mantenedor-tipo-pago" class="modal">
        <div class="modal-content">
            <h5 class="center" id="accion_tipo_pago">Ingresar Tipo Pago</h5>
            <form action="" name="form-actualizar-tipo-pago" id="form-actualizar-tipo-pago">
            <label id="lbl_id_tipo_pago" class="lbl_id"></label>
                <div class="input-field">
                    <input id="txt_nombre" name="txt_nombre" type="text">
                    <label for="txt_nombre">Nombre</label>
                </div>
                <div class="center">
                    <input type="submit" class="btn black" id="btn_mant_tipo_pago" value="Confirmar">
                    <button id="cancelar_actualizar_tipo_pago" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/tipo-pago-functions.js"></script>
    <script>
    $(document).ready(function(){
        CargarTablaTipoPago();
        $('#modal-mantenedor-tipo-pago').modal({
                dismissible: true,
                onCloseEnd: function() {
                $('#form-actualizar-tipo-pago')[0].reset();
                $('#lbl_id_tipo_pago').text('');
                $('#accion_tipo_pago').text('Ingresar Tipo Pago');
                }
            });
    });
    </script>
</body>
</html>