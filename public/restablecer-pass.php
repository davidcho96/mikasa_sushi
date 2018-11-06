<?php
    $token = $_GET['token'];
    $idTipo = $_GET['idTipoUsuario'];
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
    <div class="full-page-login">
        <!-- Navbar index -->
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
                                <li>
                                    <a class="normal-hover-nav" href="login.php">Iniciar Sesión</a>
                                </li>
                                <li>
                                    <a class="normal-hover-nav" href="register.php">Registro</a>
                                </li>
                                <li>
                                    <a class="normal-hover-nav" href="carta.php">Carta</a>
                                </li>
                                <li>
                                    <a class="normal-hover-nav" href="about.php">Saber más</a>
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
                        <li>
                            <a class="black-text black-darken-4" href="login.php">Inicio Sesión</a>
                        </li>
                        <li>
                            <a class="black-text black-darken-4" href="register.php">Registro</a>
                        </li>
                        <li>
                            <a class="black-text black-darken-4" href="carta.php">Carta</a>
                        </li>
                        <li>
                            <a class="black-text black-darken-4" href="about.php">Saber más</a>
                        </li>
                    </ul>
                </div>
        
            <div class="content-info-login">
                <div class="form-login">
                    <form action="" id="form_cambiar_password_rec" name="form_cambiar_password_rec">
                        <h5 class="">Ingresa la nueva contraseña</h5>
                        <div class="input-div">
                            <input type="hidden" value="<?php echo $token; ?>" id="token">
                            <input type="hidden" value="<?php echo $idTipo; ?>" id="tipoUsuario">
                            <div class="input-field">
                                <input type="password" id="txt_nueva_password" name="txt_nueva_password">
                                <label for="txt_nueva_password">Ingresa la nueva contraseña</label>
                            </div>
                            <div class="input-field">
                                <input type="password" id="txt_confirmar_nueva_password" name="txt_confirmar_nueva_password">
                                <label for="txt_confirmar_nueva_password">Confirmar nueva contraseña</label>
                            </div>
                            <div class="input-field center-align">
                                <input type="submit" value="Confirmar" class="btn black">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    </div>
    <script src="dist/js/script.min.js"></script>
    <script src="src/js/es6/recuperar-pass.js"></script>
    <script>
        $(document).ready(function(){
            consultarEstadoToken();
        });
    </script>
</body>
</html>
