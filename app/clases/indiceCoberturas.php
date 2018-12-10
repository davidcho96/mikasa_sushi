<?php

//*BD = Base de datos
//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para ser utilizado en javascript
require_once '../db_connection/connection.php';

class IndiceCoberturas extends connection{
    private $idIndiceCobertura;
    private $descripcionIndice;

    public function getIdIndiceCobertura(){
		return $this->idIndiceCobertura;
	}

	public function setIdIndiceCobertura($idIndiceCobertura){
		$this->idIndiceCobertura = $idIndiceCobertura;
	}

	public function getDescripcionIndice(){
		return $this->descripcionIndice;
	}

	public function setDescripcionIndice($descripcionIndice){
		$this->descripcionIndice = $descripcionIndice;
    }
    
    public function cargarIndiceCoberturas(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('select * from indicecobertura');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdIndiceCobertura"=>$id,
                        "Descripcion"=>$descripcion
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function cargarIndiceCoberturasTotal(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('select count(*)-1 from indicecobertura');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($total);
            $datos = array();
			if($stmt->fetch()>0){
                echo $total;
                // *Retorna la cattidad de opciones de elección de coberturas
			}else{
                echo 'error';
            }
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function eliminarIndiceCobertura($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call eliminarIndiceCobertura(?, @out_value)');
            // *Se pasan los parámetros
            $stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($result);
            $datos = array();
			if($stmt->fetch()>0){
                echo $result;
                // *Se devuelve el resultado del procedimiento almacenado
			}else{
                echo '2';
                // *No existen datos
            }
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function agregarIndiceCobertura($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call agregarIndiceCobertura(?, @out_value)');
            // *Se pasan los parámetros
            $stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($result);
            $datos = array();
			if($stmt->fetch()>0){
                echo $result;
			}else{
                echo '2';
                // *No se devolvieron datos
            }
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    // *Consulta cuantos datos están vinculados a ese indice para mostrarlos al momento de eliminar
    public function obtenerDatosVinculadosIndiceCobertura(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosVinculadosIndiceCobertura()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($result);
            $datos = array();
			if($stmt->fetch()>0){
                echo $result;
                // *Devuelve la cantidad de datos vinculados
			}else{
                echo 'algunos';
                // *No existen datos vinculados
            }
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
}