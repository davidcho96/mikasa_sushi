<?php
//* Comprueba si existe una sesión iniciada y redirecciona al menú principal correspondiente
// require_once '../db_connection/connection.php';

class Sesion extends connection{

    public function validarSesion(){
        // *Si la sesción existe se redirige a la página principal del usuario
        if(isset($_SESSION['user'])){
            switch ($_SESSION['user'][0]) {
                case 'cliente':
                        header('Location: index-cliente.php');
                    break;
                case 'admin':
                        header('Location: index-admin.php');
                    break;
                case 'repartidor':
                        header('Location: index-repartidor.php');
                    break;
            }
        }
    }

    public function validarSesionMantenedores(){
        if(!isset($_SESSION['user'])){
            header('Location: index.php');
        }
        // *Si no existe la sesión de usuario se redirige al index prinicipal
    }

    public function validacionSesionAdmin(){
        if($_SESSION['user'][0] != 'admin'){
            switch($_SESSION['user'][0]){
                case 'cliente':
                header('Location: index-cliente.php');
                break;
                case 'vendedor':
                header('Location: index-vendedor.php');
                break;
                case 'repartidor':
                header('Location: index-repartidor.php');
                break;
            }  
        }
    }

    public function validacionSesionCliente(){
        if($_SESSION['user'][0] != 'cliente'){
            switch($_SESSION['user'][0]){
                case 'admin':
                header('Location: index-admin.php');
                break;
                case 'vendedor':
                header('Location: index-vendedor.php');
                break;
                case 'repartidor':
                header('Location: index-repartidor.php');
                break;
            }  
        }
        // *Si la sesión no es de tipo cliente se redirige al empleado a su menú correspondiente
    }

    public function validacionSesionRepartidor(){
        if($_SESSION['user'][0] != 'repartidor'){
            switch($_SESSION['user'][0]){
                case 'cliente':
                header('Location: index-cliente.php');
                break;
                case 'vendedor':
                header('Location: index-vendedor.php');
                break;
                case 'admin':
                header('Location: index-admin.php');
                break;
            }  
        }
        // *Si la sesión no es de tipo repartidor se redirige al usuario a su menú correspondiente
    }

    public function validacionSesionVendedor(){
        if($_SESSION['user'][0] != 'vendedor'){
            switch($_SESSION['user'][0]){
                case 'cliente':
                header('Location: index-cliente.php');
                break;
                case 'admin':
                header('Location: index-admin.php');
                break;
                case 'repartidor':
                header('Location: index-repartidor.php');
                break;
            }  
        }
        // *Si la sesión no es de tipo vendedor se redirige al usuario a su menú correspondiente
    }

    public function validarEstadoSesion(){
        try{
            if(isset($_SESSION['user'][1])){
                $db = connection::getInstance();
                $conn = $db->getConnection();
                //*Se prepara el procedimiento almacenado
                $stmt=$conn->prepare('call validarSesion(?, ?, @out_value)');
                //* Se pasa el id para obtener la información
                $stmt->bind_param('ss', $_SESSION['user'][0], $_SESSION['user'][1]);
                //* Se ejecuta
                $stmt->execute();
                //* Resultados obtenidos de la consulta
                $stmt->bind_result($result);
                $datos = array();
                if($stmt->fetch()>0){
                    switch ($result) {
                        case '1':
                        unset($_SESSION["user"]);
                        session_destroy();
                            header('Location: index.php');
                        break;
                    }
                }
                
                $stmt->free_result();
            }   
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
}