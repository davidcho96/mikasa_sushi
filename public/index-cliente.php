<?php
//* Validamos la existencia de la sesión y el tipo de usuario que solicita el acceso
    session_start();
    if(!isset($_SESSION['user']) || $_SESSION['user'] == '' || $_SESSION['user'] != 'cliente'){
        header('Location: login.php');
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>

</body>

</html>