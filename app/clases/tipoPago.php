<?php

require_once '../db_connection/connection.php';

class TipoPago extends connection{
    private $idTipoPago;
    private $descripcionTipoPago;
    private $idEstadoMantenedor;

    public function getIdTipoPago(){
		return $this->idTipoPago;
	}

	public function setIdTipoPago($idTipoPago){
		$this->idTipoPago = $idTipoPago;
	}

	public function getDescripcionTipoPago(){
		return $this->descripcionTipoPago;
	}

	public function setDescripcionTipoPago($descripcionTipoPago){
		$this->descripcionTipoPago = $descripcionTipoPago;
	}

	public function getIdEstadoMantenedor(){
		return $this->idEstadoMantenedor;
	}

	public function setIdEstadoMantenedor($idEstadoMantenedor){
		$this->idEstadoMantenedor = $idEstadoMantenedor;
    }
    
    public function CargarMantenedorTipoPago(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaTipoPago()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion, $idEstado, $descripcionEstado);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdTipoPago"=>$id,
						"Descripcion"=>$descripcion,
                        "Estado"=>$idEstado,
                        "DescripcionEstado"=>$descripcionEstado
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
    
    public function EliminarTipoPago($correo){
        try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call eliminarTipoPago(?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('is', $this->getIdTipoPago(), $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}
			else{
				return 3;
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    public function ObtenerInformacionTipoPago(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosTipoPago(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('i', $this->getIdTipoPago());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion, $idEstado);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdTipoPago"=>$id,
						"Descripcion"=>$descripcion,
                        "Estado"=>$idEstado,
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function actualizarDatos($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call actualizarTipoPago(?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('iss', $this->getIdTipoPago(), $this->getDescripcionTipoPago(), $correo);
            //* Se ejecuta
            $stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 3;//*error de BD
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
	
	public function ingresarTipoPago($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call ingresarTipoPago(?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('sis', $this->getDescripcionTipoPago(), $this->getIdEstadoMantenedor(), $correo);
            //* Se ejecuta
            $stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 3;//*error de BD
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
}