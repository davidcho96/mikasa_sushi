<?php

require_once '../db_connection/connection.php';

class IndiceRellenos extends connection{
    private $idIndiceRelleno;
    private $descripcionIndice;

    public function getIdIndiceRelleno(){
		return $this->idIndiceCobertura;
	}

	public function setIdIndiceRelleno($idIndiceCobertura){
		$this->idIndiceCobertura = $idIndiceCobertura;
	}

	public function getDescripcionIndice(){
		return $this->descripcionIndice;
	}

	public function setDescripcionIndice($descripcionIndice){
		$this->descripcionIndice = $descripcionIndice;
    }
    
    public function cargarIndiceRellenos(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('select * from indicerelleno');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdIndiceRelleno"=>$id,
                        "Descripcion"=>$descripcion
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function cargarIndiceRellenosTotal(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('select count(*)-1 from indicerelleno');
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

    public function eliminarIndiceRelleno($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call eliminarIndiceRelleno(?, @out_value)');
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

    public function agregarIndiceRelleno($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call agregarIndiceRelleno(?, @out_value)');
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
}