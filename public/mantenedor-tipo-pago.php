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

    <div class="contenido-mantenedor">
        <table id="tabla_tipo_pago">
        <thead></thead>
        <tbody id="body_tabla_tipo_pago"></tbody>
        </table>
    </div>
    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/tipo-pago-functions.js"></script>
    <script>
        CargarTablaTipoPago();
    </script>
</body>
</html>