<?php
//* Comprueba si existe una sesión iniciada y redirecciona al menú principal correspondiente
require '/../../app/db_connection/connection.php';

class Sesion extends connection{

    public function validarSesion(){
        if(isset($_SESSION['user'])){
            switch ($_SESSION['user'][0]) {
                case 'cliente':
                        header('Location: index-cliente.php');
                    break;
                case 'Administrador':
                        header('Location: index-admin.php');
                    break;
                case 'Repartidor':
                        header('Location: index-repartidor.php');
                    break;
                case 'Vendedor':
                        header('Location: index-vendedor.php');
                    break;
            }
        }
    }

    public function validarSesionMantenedores(){
        if(!isset($_SESSION['user'])){
            header('Location: index.php');
        }
    }

    public function validacionSesionAdmin(){
        if($_SESSION['user'][0] != 'Administrador'){
            switch($_SESSION['user'][0]){
                case 'cliente':
                header('Location: index-cliente.php');
                break;
                case 'Vendedor':
                header('Location: index-vendedor.php');
                break;
                case 'Repartidor':
                header('Location: index-repartidor.php');
                break;
            }  
        }
    }

    public function validacionSesionCliente(){
        if($_SESSION['user'][0] != 'cliente'){
            switch($_SESSION['user'][0]){
                case 'Administrador':
                header('Location: index-admin.php');
                break;
                case 'Vendedor':
                header('Location: index-vendedor.php');
                break;
                case 'Repartidor':
                header('Location: index-repartidor.php');
                break;
            }  
        }
    }

    public function validacionSesionRepartidor(){
        if($_SESSION['user'][0] != 'repartidor'){
            switch($_SESSION['user'][0]){
                case 'cliente':
                header('Location: index-cliente.php');
                break;
                case 'Vendedor':
                header('Location: index-vendedor.php');
                break;
                case 'Administrador':
                header('Location: index-admin.php');
                break;
            }  
        }
    }

    public function validacionSesionVendedor(){
        if($_SESSION['user'][0] != 'Vendedor'){
            switch($_SESSION['user'][0]){
                case 'cliente':
                header('Location: index-cliente.php');
                break;
                case 'Administrador':
                header('Location: index-admin.php');
                break;
                case 'Repartidor':
                header('Location: index-repartidor.php');
                break;
            }  
        }
    }

    public function validarEstadoSesion(){
            try{
                // echo 'err';
                $var = '';
                if(isset($_SESSION['user'])){
                    $db = connection::getInstance();
                    $conn = $db->getConnection();
                    //*Se prepara el procedimiento almacenado
                    $stmt=$conn->prepare("call validarSesion(?, ?, @out)");
                    //* Se pasa el id para obtener la información
                    $stmt->bind_param('ss', $_SESSION['user'][0], $_SESSION['user'][1]);
                    //* Se ejecuta
                    $stmt->execute();
                    //* Resultados obtenidos de la consulta
                    $stmt->bind_result($result);
                    if($stmt->fetch()>0){
                        // return $result;
                        // if($result == 1){
                            // unset($_SESSION["user"]);
                            // if(isset($_SESSION['user'])){
                                // }
                                // return $result;
                                // }
                                if($result == 1){
                                    // session_destroy();
                                    return true;
                                    // header('Location: ../../public/index.php');
                                    // echo 1;
                                }else{
                                    return false;
                                }
                    }
                    
                    $stmt->free_result();
                }   
            }catch(Exception $error){
                echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
            }
        }
}