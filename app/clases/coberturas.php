<?php

require_once '../db_connection/connection.php';

class Cobertura extends connection{
	private $idCobertura;
	private $nombre;
    private $descripcion;
	private $idIndice;
	private $idEstado;
    private $precioAdicional;

	public function getIdCobertura(){
		return $this->idCobertura;
	}

	public function setIdCobertura($idCobertura){
		$this->idCobertura = $idCobertura;
	}

	public function getNombre(){
		return $this->nombre;
	}

	public function setNombre($nombre){
		$this->nombre = $nombre;
	}

	public function getDescripcion(){
		return $this->descripcion;
	}

	public function setDescripcion($descripcion){
		$this->descripcion = $descripcion;
	}

	public function getIdIndice(){
		return $this->idIndice;
	}

	public function setIdIndice($idIndice){
		$this->idIndice = $idIndice;
	}

	public function getIdEstado(){
		return $this->idEstado;
	}

	public function setIdEstado($idEstado){
		$this->idEstado = $idEstado;
	}

	public function getPrecioAdicional(){
		return $this->precioAdicional;
	}

	public function setPrecioAdicional($precioAdicional){
		$this->precioAdicional = $precioAdicional;
	}
    
    public function cargarCoberturas(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('select * from vistacoberturas');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $nombre, $descripcion, $idIndice, $indice, $precioAdicional, $estado, $idEstado);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdCobertura"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"IdIndice"=>$idIndice,
                        "Indice"=>$indice,
						"Precio"=>$precioAdicional,
						"Estado"=>$estado,
						"idEstado"=>$idEstado
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function EliminarCobertura($correo){
        try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call eliminarCobertura(?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('is', $this->getIdCobertura(), $correo);
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

    public function ObtenerInformacionCobertura(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosCobertura(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('i', $this->getIdCobertura());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion, $indice, $precioAdicional, $estado, $nombre);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdCobertura"=>$id,
						"Nombre"=>utf8_encode($nombre),
                        "Descripcion"=>utf8_encode($descripcion),
                        "Indice"=>$indice,
						"Precio"=>$precioAdicional,
						"Estado"=>$estado
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
			$n = 'null';
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call actualizarDatosCoberturas(?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('issisis', $this->getIdCobertura(), $this->getNombre(), $this->getDescripcion(), $this->getPrecioAdicional(), $this->getIdIndice(), $this->getIdEstado(), $correo);
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

	public function ingresarCoberturas($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call ingresarCoberturas(?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('ssiiis', $this->getNombre(), $this->getDescripcion(), $this->getPrecioAdicional(), $this->getIdIndice(), $this->getIdEstado(), $correo);
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