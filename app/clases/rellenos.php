<?php

require_once '../db_connection/connection.php';

class Relleno extends connection{
    private $idRelleno;
	private $nombre;
    private $descripcion;
	private $idIndice;
	private $idEstado;
	private $precioAdicional;
	private $imgUrl;

    public function getIdRelleno(){
		return $this->idRelleno;
	}

	public function setIdRelleno($idRelleno){
		$this->idRelleno = $idRelleno;
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
	
	public function getImgUrl(){
		return $this->imgUrl;
	}

	public function setImgUrl($imgUrl){
		$this->imgUrl = $imgUrl;
	}
	
    public function cargarRellenos(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('select * from vistarellenos');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $nombre, $descripcion, $idIndice, $indice, $precioAdicional, $estado, $idEstado, $imgUrl);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdRelleno"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"IdIndice"=>$idIndice,
                        "Indice"=>$indice,
						"Precio"=>$precioAdicional,
						"Estado"=>$estado,
						"idEstado"=>$idEstado,
						'ImgUrl'=>$imgUrl
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function EliminarRelleno($correo){
        try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call eliminarRelleno(?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('is', $this->getIdRelleno(), $correo);
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
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }

    public function ObtenerInformacionRelleno(){
        try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosRelleno(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('i', $this->getIdRelleno());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion, $idIndice, $precioAdicional, $idEstado, $nombre, $imgUrl);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdRelleno"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"Indice"=>$idIndice,
						"Precio"=>$precioAdicional,
						"Estado"=>$idEstado,
						"ImgUrl"=>$imgUrl
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
			$stmt=$conn->prepare('call actualizarDatosRellenos(?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('issisiss', $this->getIdRelleno(), $this->getNombre(), $this->getDescripcion(), $this->getPrecioAdicional(), $this->getIdIndice(), $this->getIdEstado(), $this->getImgUrl(), $correo);
            //* Se ejecuta
            $stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 3;//*error de BD
			}

			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    
    public function ingresarRellenos($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call ingresarRellenos(?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('ssiiiss', $this->getNombre(), $this->getDescripcion(), $this->getPrecioAdicional(), $this->getIdIndice(), $this->getIdEstado(), $this->getImgUrl(), $correo);
            //* Se ejecuta
            $stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 3;//*error de BD
			}

			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
}