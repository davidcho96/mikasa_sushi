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
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">
</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor">
        <h1>Gestión Rellenos Mikasa</h1>
        <a class="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#modal-mantenedor-relleno"><i class="material-icons">add</i></a>
    </div>

    <div class="">
        <label>Estado en carta</label>
        <select name="comboBoxEstadoElemento" id="comboBoxEstadoRellenosFiltro" class="browser-default">
        </select>
        <div class="input-field">
            <label for="txt_buscar_rellenos">Buscar Rellenos</label>
            <input type="text" id="txt_buscar_rellenos">
        </div>
    </div>

    <div id="rellenosCarga" class="row"></div>

    <div id="modal-mantenedor-relleno" class="modal">
        <div class="modal-content">
            <h5 class="center">Actualizar Agregado</h5>
            <form action="" name="form-actualizar-relleno" id="form-actualizar-relleno">
            <label id="lbl_id_rellenos" class=""></label>
                <div class="input-field">
                    <input id="txt_nombre" name="txt_nombre" type="text">
                    <label for="txt_nombre">Nombre</label>
                </div>
                <div class="input-field">
                    <textarea id="txt_descripcion" class="materialize-textarea" name="txt_descripcion"></textarea>
                    <label for="txt_descripcion">Descripción</label>
                </div>
                <div class="input-field">
                    <input id="txt_precioRelleno" name="txt_precioRelleno" type="number">
                    <label for="txt_precioRelleno">Precio</label>
                </div>
                <div class="input-field">
                    <label class="active">Estado en carta</label>
                    <select name="comboBoxEstadoElemento" id="comboBoxEstadoRelleno" class="browser-default">
                        
                    </select>
                </div>
                <div class="input-field">
                    <label class="active">Índice de elección</label>
                    <select name="comboBoxIndiceRelleno" id="comboBoxIndiceRelleno" class="browser-default">
                        
                    </select>
                </div>
                <div class="center">
                    <input type="submit" class="btn black" id="btn_mant_relleno" value="Confirmar">
                    <button id="cancelar_actualizar_relleno" class="btn red">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/rellenos-functions.js"></script>
    <script>
        $(document).ready(function(){
            cargarComboEstadoElemento()
            cargarMantenedorRellenos();
            cargarIndiceRelleno();
            $('#modal-mantenedor-relleno').modal({
                dismissible: true,
                onCloseEnd: function() {
                $('#form-actualizar-relleno')[0].reset();
                $('#lbl_id_rellenos').text('');
                }
            });
        });
    </script>
</body>
</html>
