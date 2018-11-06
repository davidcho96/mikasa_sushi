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
    <title>Gestión imágenes index</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="dist/css/style.min.css">
    <link rel="shortcut icon" type="image/png" href="dist/img/m-logo.ico" />
</head>
<body>
    <?php require 'templates/nav-admin.php' ?>
    <div class="title-mantenedor">
        <h1>Gestión Imágenes Index</h1>
    </div>

    <div class="row">
        <form action="">
            <div class="file-field input-field col s12 m4 l4">
                <div>
                    <img src="" alt="" id="prev_imagen_uno" heigth="300px" width="100%">
                </div>
                <div class="btn black">
                    <span>Imagen</span>
                    <input type="file" name="imagen_uno_index" id="imagen_uno_index" accept="image/x-png,image/jpg,image/jpeg">
                </div>
                    <div class="file-path-wrapper">
                        <input class="file-path" type="text" id="imagen_uno_index_text" name="imagen_uno_index_text">
                    </div>
            </div>
            <div class="file-field input-field col s12 m4 l4">
                <div>
                    <img src="" alt="" id="prev_imagen_dos" heigth="300px" width="100%">
                </div>
                <div class="btn black">
                    <span>Imagen</span>
                    <input type="file" name="imagen_dos_index" id="imagen_dos_index" accept="image/x-png,image/jpg,image/jpeg">
                </div>
                    <div class="file-path-wrapper">
                        <input class="file-path" type="text" id="imagen_dos_index_text" name="imagen_dos_index_text">
                    </div>
            </div>
            <div class="file-field input-field col s12 m4 l4">
                <div>
                    <img src="" alt="" id="prev_imagen_tres" heigth="300px" width="100%">
                </div>
                <div class="btn black">
                    <span>Imagen</span>
                    <input type="file" name="imagen_tres_index" id="imagen_tres_index" accept="image/x-png,image/jpg,image/jpeg">
                </div>
                    <div class="file-path-wrapper">
                        <input class="file-path" type="text" id="imagen_tres_index_text" name="imagen_tres_index_text">
                    </div>
            </div>
        </form>
    </div>

    <script src="dist/js/script.min.js"></script>
    <script>
    $(document).ready(function(){
        comprobarEstadoSesion();
        setInterval(function(){
            comprobarEstadoSesion();
        }, 25000);
    });

    // *Funciones para previsualizar la imagen seleccionada
    function readURLImagenUno(input) {

        if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#prev_imagen_uno').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
        }
    }

    function readURLImagenDos(input) {

        if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#prev_imagen_dos').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
        }
    }

    function readURLImagenTres(input) {

        if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#prev_imagen_tres').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imagen_uno_index").change(function() {
        readURLImagenUno(this);
    });
    $("#imagen_dos_index").change(function() {
        readURLImagenDos(this);
    });
    $("#imagen_tres_index").change(function() {
        readURLImagenTres(this);
    });
    </script>
</body>
</html>