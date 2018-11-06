<?php

session_start();

if(isset($_SESSION['user'])){
    session_destroy();
    header('Location: ../mantenedor-agregadosM.php');
}else{
    header('Location: ../mantenedor-agregadosM.php');
}
