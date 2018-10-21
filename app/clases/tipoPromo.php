<?php

require_once '../db_connection/connection.php';

class TipoPromo extends connection{
    private $idTipoPromo;
    private $descripcionTipoPromo;
    private $idEstadoMantenedor;

    public function getIdTipoPromo(){
		return $this->idTipoPromo;
	}

	public function setIdTipoPromo($idTipoPromo){
		$this->idTipoPromo = $idTipoPromo;
	}

	public function getDescripcionTipoPromo(){
		return $this->descripcionTipoPromo;
	}

	public function setDescripcionTipoPromo($descripcionTipoPromo){
		$this->descripcionTipoPromo = $descripcionTipoPromo;
	}

	public function getIdEstadoMantenedor(){
		return $this->idEstadoMantenedor;
	}

	public function setIdEstadoMantenedor($idEstadoMantenedor){
		$this->idEstadoMantenedor = $idEstadoMantenedor;
    }
    
    public function CargarMantenedorTipoPromo(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaTipoPromo()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion, $idEstado, $descripcionEstado);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdTipoPromo"=>$id,
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

    public function EliminarTipoPromo($correo){
        try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call eliminarTipoPromo(?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('is', $this->getIdTipoPromo(), $correo);
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

    public function ObtenerInformacionTipoPromo(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosTipoPromo(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('i', $this->getIdTipoPromo());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion, $idEstado);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdTipoPromo"=>$id,
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
			$stmt=$conn->prepare('call actualizarTipoPromo(?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('iss', $this->getIdTipoPromo(), $this->getDescripcionTipoPromo(), $correo);
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
    
    public function ingresarTipoPromo($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call ingresarTipoPromo(?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('sis', $this->getDescripcionTipoPromo(), $this->getIdEstadoMantenedor(), $correo);
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

	public function CargarComboTipoPromo(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call cargarComboTipoPromo()');
			//* Se ejecuta
			$stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($id, $nombre);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdTipoPromo"=>$id,
						"Nombre"=>$nombre
					);
				}
				return json_encode($datos, JSON_UNESCAPED_UNICODE);
				$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function comprobarVinculacionTipoPromo(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call comprobarVinculacionTipoPromo(?)');
			// *Se pasan los parámetros
			$stmt->bind_param('i', $this->getIdTipoPromo());
			//* Se ejecuta
			$stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				echo $result;
			}

			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
}