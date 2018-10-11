<?php

require_once "../db_connection/connection.php";

class Agregados extends connection{
	private $idAgregados;
	private $nombre;
    private $descripcion;
    private $precio;
	private $descuento;
	private $estado;
	private $imgUrl;

    public function getIdAgregados(){
		return $this->idAgregados;
	}

	public function setIdAgregados($idAgregados){
		$this->idAgregados = $idAgregados;
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

	public function getPrecio(){
		return $this->precio;
	}

	public function setPrecio($precio){
		$this->precio = $precio;
	}

	public function getDescuento(){
		return $this->descuento;
	}

	public function setDescuento($descuento){
		$this->descuento = $descuento;
	}
	
	public function getIdEstado(){
		return $this->estado;
	}

	public function setIdEstado($estado){
		$this->estado = $estado;
	}

	public function getImgUrl(){
		return $this->imgUrl;
	}

	public function setImgUrl($imgUrl){
		$this->imgUrl = $imgUrl;
	}
    
    public function CargarMantenedorAgregados(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaAgregados()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $nombre, $descripcion, $precio, $descuento, $idEstado, $imgUrl);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdAgregado"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"Precio"=>$precio,
						"Descuento"=>$descuento,
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

	public function ObtenerInformacionAgregado(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosAgregado(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('i', $this->getIdAgregados());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($id, $nombre, $descripcion, $precio, $descuento, $idEstado, $imgUrl);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"Id"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"Precio"=>$precio,
						"Descuento"=>$descuento,
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
	public function EliminarAgregado($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call eliminarAgregado(?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('is', $this->getIdAgregados(), $correo);
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

	public function actualizarDatos($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call actualizarDatosAgregados(?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('issiiiss', $this->getIdAgregados(), $this->getNombre(), $this->getDescripcion(), $this->getPrecio(), $this->getDescuento(), $this->getIdEstado(), $this->getImgUrl(), $correo);
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

	public function ingresarAgregados($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call ingresarAgregados(?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('ssiiiss', $this->getNombre(), $this->getDescripcion(), $this->getPrecio(), $this->getDescuento(), $this->getIdEstado(), $this->getImgUrl(), $correo);
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