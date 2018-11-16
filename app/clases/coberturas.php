<?php

require_once '../db_connection/connection.php';

class Cobertura extends connection{
	private $idCobertura;
	private $nombre;
    private $descripcion;
	private $idIndice;
	private $idEstado;
	private $precioAdicional;
	private $imgUrl;
	private $cantidadStock;
    private $unidadStock;
    private $cantidadUso;
    private $unidadUso;
    private $cantidadMinima;

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

	public function getImgUrl(){
		return $this->imgUrl;
	}

	public function setImgUrl($imgUrl){
		$this->imgUrl = $imgUrl;
	}
	
	public function getCantidadStock(){
		return $this->cantidadStock;
	}

	public function setCantidadStock($cantidadStock){
		$this->cantidadStock = $cantidadStock;
	}

	public function getUnidadStock(){
		return $this->unidadStock;
	}

	public function setUnidadStock($unidadStock){
		$this->unidadStock = $unidadStock;
	}

	public function getCantidadUso(){
		return $this->cantidadUso;
	}

	public function setCantidadUso($cantidadUso){
		$this->cantidadUso = $cantidadUso;
	}

	public function getUnidadUso(){
		return $this->unidadUso;
	}

	public function setUnidadUso($unidadUso){
		$this->unidadUso = $unidadUso;
	}

	public function getCantidadMinima(){
		return $this->cantidadMinima;
	}

	public function setCantidadMinima($cantidadMinima){
		$this->cantidadMinima = $cantidadMinima;
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
            $stmt->bind_result($id, $nombre, $descripcion, $idIndice, $indice, $precioAdicional, $estado, $idEstado, $imgUrl, $stock, $minimo);
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
						"IdEstado"=>$idEstado,
						"ImgUrl"=>$imgUrl,
						"StockTotal"=>$stock,
						"MinimoStock"=>$minimo
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
				return 2;
			}
			$stmt->free_result();
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
            $stmt->bind_result($id, $descripcion, $indice, $precioAdicional, $estado, $nombre, $imgUrl, $stock, $stockUnidad, $uso, $usoUnidad, $minima);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdCobertura"=>$id,
						"Nombre"=>$nombre,
                        "Descripcion"=>$descripcion,
                        "Indice"=>$indice,
						"Precio"=>$precioAdicional,
						"Estado"=>$estado,
						"ImgUrl"=>$imgUrl,
						"Stock"=>$stock,
						"StockUnidad"=>$stockUnidad,
						"Uso"=>$uso,
						"UsoUnidad"=>$usoUnidad,
						"Minima"=>$minima
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
			$stmt=$conn->prepare('call actualizarDatosCoberturas(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('issisisdidids', $this->getIdCobertura(), $this->getNombre(), $this->getDescripcion(), $this->getPrecioAdicional(), $this->getIdIndice(), $this->getIdEstado(), $this->getImgUrl(), $this->getCantidadStock(), $this->getUnidadStock(), $this->getCantidadUso(), $this->getUnidadUso(), $this->getCantidadMinima(), $correo);
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

	public function ingresarCoberturas($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call ingresarCoberturas(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('ssiiisdidids', $this->getNombre(), $this->getDescripcion(), $this->getPrecioAdicional(), $this->getIdIndice(), $this->getIdEstado(), $this->getImgUrl(), $this->getCantidadStock(), $this->getUnidadStock(), $this->getCantidadUso(), $this->getUnidadUso(), $this->getCantidadMinima(), $correo);
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

	public function comprobarVinculacionCoberturas(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call comprobarVinculacionCoberturas(?)');
			// *Se pasan los parámetros
			$stmt->bind_param('i', $this->getIdCobertura());
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

	public function cargarCoberturasCarta(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('select * from `vistaCartaCoberturasCarta` ');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $nombre, $descripcion, $precioAdicional, $idIndice, $indice, $imgUrl);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdCobertura"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"Precio"=>$precioAdicional,
						"IdIndice"=>$idIndice,
                        "Indice"=>$indice,
						"ImgUrl"=>$imgUrl
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
}