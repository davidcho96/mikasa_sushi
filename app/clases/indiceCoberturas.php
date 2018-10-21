<?php

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
			}else{
                echo '2';
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
            }
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    function obtenerDatosVinculadosIndiceCobertura(){
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
			}else{
                echo 'algunos';
            }
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
}