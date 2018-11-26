<?php
    $codigocompra = $_GET['codigocompra'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
    <link rel="stylesheet" href="dist/css/style.min.css">
    <link rel="stylesheet" href="src/css/perfil.css">
</head>
<body>
    <div class="navbar-fixed navbar-login">
        <nav class="transparent z-depth-0">
            <div class="nav-wrapper navbar-register">
                <div>
                    <a href="#" class="brand-logo">
                        <img src="src/img/logo.png" class="nav-image-no-circle">
                    </a>
                </div>
                <a href="#" data-target="mobile-demo" class="sidenav-trigger black-text black-darken-4">
                    <i class="material-icons">menu</i>
                </a>
                <ul class="right hide-on-med-and-down nav-ul-options">
                    <li>
                        <a class="normal-hover-nav" href="index.php">Inicio</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    <!-- Sidenav para dispositivos móviles -->
    <div>
        <ul class="sidenav" id="mobile-demo">
            <li>
                <div class="user-view background-sidenav">
                    <img src="src/img/m-logo.png" height="200px" width="100%">
                </div>
            </li>
            <li>
                <a class="black-text black-darken-4" href="index.php">Inicio</a>
            </li>
        </ul>
    </div>

    <div>
        <input type="hidden" value="<?php echo $codigocompra; ?>">
        <div class="container" id="cargar_detalle_compra_tracking">
            
        </div>
    </div>

<script src="dist/js/script.min.js"></script>
<script src="src/js/es6/recuperar-pass.js"></script>
<script>
    $(document).ready(function(){
        consultarEstadoCompraCliente();
    });
</script>
</body>
</html>
