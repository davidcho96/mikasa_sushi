<?php 
session_start();

require 'templates/session.php';

$sesionUsuario = new Sesion();

$sesionUsuario->validarSesion();

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mikasa Sushi</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
</head>

<body>
    <div class="full-page-login row">
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
        <!-- Login form content -->

        <!-- Contenido derecha -->
        <div class="content-info-login">
            <div class="form-login">
                <form action="" id="form_login_cliente" name="form_login_cliente">
                    <h5 class="">Ingresar a mi cuenta</h5>
                    <p>Bienvenido. Por favor ingresa con tu cuenta.</p>
                    <div class="input-div">
                        <div class="input-field">
                            <input id="txt_email" name="txt_email" type="email" class="validate">
                            <label for="txt_email">Email</label>
                        </div>
                        <div class="input-field" id="input">
                            <input id="txt_password" name="txt_password" type="password" class="validate">
                            <label for="txt_password">Password</label>
                        </div>
                        <div class="right">
                            <a href="#">Olvidé mi contraseña</a>
                        </div>
                        <div class="botones-login">
                            <div class="btn-div">
                                <input type="submit" class="btn black btn-login" value="Iniciar sesión">
                            </div>
                            <div class="linea">
                                <hr class="hr2 black">
                                <div class="header-line">ó</div>
                                <hr class="hr1 black">
                            </div>
                            <div class="btn-div">
                                <button class="btn blue btn-login">
                                    <i class="fa fa-facebook"></i>
                                    Continuar con Facebook
                                </button>
                            </div>
                        </div>
                        <div class="center-align">
                            <p>¿Aún no te registras? Haz clic
                                <a href="register.php" class="modal-trigger">Aquí</a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- ----------------------------------------------------------- -->
    <script src="dist/js/script.min.js"></script>
    <!-- <script src='src/js/es6/login.js'></script> -->
</body>

</html>