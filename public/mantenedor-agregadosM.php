<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Agregados Mikasa</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">
</head>
<body>
    <?php require 'templates/nav-admin.php' ?>

    <div class="title-mantenedor">
        <h1>Gestión agregados Mikasa</h1>
        <a class="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#modal-actualizar-agregado"><i class="material-icons">add</i></a>
    </div>
    <div class="">
        <label>Estado en carta</label>
        <select name="comboBoxEstadoElemento" id="comboBoxEstadoElementoFiltro" class="browser-default">
            <option value="">Todos</option>
        </select>
        <div class="input-field">
            <label for="txt_buscar_agregados">Buscar Agregados</label>
            <input type="text" id="txt_buscar_agregados">
        </div>
    </div>

    <div id="agregadosCarga" class="row"></div>

    <div id="modal-actualizar-agregado" class="modal">
        <div class="modal-content">
            <h5 class="center">Actualizar Agregado</h5>
            <form action="" name="form-actualizar-agregado" id="form-actualizar-agregado">
            <label id="lbl_id" class="lbl_id"></label>
                <div class="input-field">
                    <input id="txt_nombre" name="txt_nombre" type="text">
                    <label for="txt_nombre">Nombre</label>
                </div>
                <div class="input-field">
                    <textarea id="txt_descripcion" class="materialize-textarea" name="txt_descripcion"></textarea>
                    <label for="txt_descripcion">Descripción</label>
                </div>
                <div class="input-field">
                    <input id="txt_precioAgregado" name="txt_precioAgregado" type="number">
                    <label for="txt_precioAgregado">Precio</label>
                </div>
                <div class="input-field">
                    <input id="txt_descuentoAgregado" name="txt_descuentoAgregado" type="number">
                    <label for="txt_descuentoAgregado">Descuento (%)</label>
                    <p>Precio Descuento: <p id="precio_descuentoAgregado"></p></p>
                </div>
                <div class="">
                    <label>Estado en carta</label>
                    <select name="comboBoxEstadoElemento" id="comboBoxEstadoElemento" class="browser-default">
                        
                    </select>
                </div>
                <div class="center">
                    <input type="submit" class="btn black" id="btn_mant_agregados" value="Confirmar">
                    <button id="cancelar_actualizar_agregados" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
    <script src="dist/js/script.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
    <script src="src/js/es6/agregados-functions.js"></script>
    <script>
        $(document).ready(function(){
            cargarComboEstadoElemento();
            cargarMantenedorAgregados();
        });
    </script>
</body>
</html>