<?php

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
//* Json encode convierte el array en string para ser utilizado en javascript 


require_once "../db_connection/connection.php";

class Agregados extends connection{
	private $idAgregados;
	private $nombre;
	private $descripcion;
	private $unidades;
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

	public function getUnidades(){
		return $this->unidades;
	}

	public function setUnidades($unidades){
		$this->unidades = $unidades;
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
	
	// *Obtendrá los datos de la BD para mostrarlos en el mantenedor correspondiente
    public function CargarMantenedorAgregados(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaAgregados()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $nombre, $descripcion, $unidades, $precio, $descuento, $estado, $imgUrl, $idEstado);
            $datos = array();
			// if($stmt->fetch()>0){
				// *Los resultados se añaden a un array para ser procesado y mostrados en pantalla
				while($stmt->fetch()){
					$datos[]=array(
                        "IdAgregado"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"Unidades"=>$unidades,
						"Precio"=>$precio,
						"Descuento"=>$descuento,
						"Estado"=>$estado,
						"ImgUrl"=>$imgUrl,
						"IdEstado"=>$idEstado
					);
				}

				// *Transforma el array en string
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}

	// *Se obtiene información del agregado seleccionado para editar
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
			$stmt->bind_result($id, $nombre, $descripcion, $unidades, $precio, $descuento, $idEstado, $imgUrl);
			$datos = array();
			// if($stmt->fetch()>0){
				// *Los datos serán añadidos a un array para ser procesados y mostrados en pantalla
				while($stmt->fetch()){
					$datos[]=array(
						"Id"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"Unidades"=>$unidades,
						"Precio"=>$precio,
						"Descuento"=>$descuento,
						"Estado"=>$idEstado,
						"ImgUrl"=>$imgUrl
					);
				}

				// *Transforma el array en string
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// *Eliminará el agregado que tenga el id obtenido por el método get
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
				// *Indica que el elemento no puede ser eliminado debido  que está relacionado a otra tabla
				return 3; 
			}
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// *Actualizará los datos del agregado que tenga el id obtenido por el método get
	public function actualizarDatos($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call actualizarDatosAgregados(?, ?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('issiiiiss', $this->getIdAgregados(), $this->getNombre(), $this->getDescripcion(), $this->getUnidades(), $this->getPrecio(), $this->getDescuento(), $this->getIdEstado(), $this->getImgUrl(), $correo);
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


	// *Ingresará un nuevo agregado en la BD
	public function ingresarAgregados($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call ingresarAgregados(?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('ssiiiiss', $this->getNombre(), $this->getDescripcion(), $this->getUnidades(), $this->getPrecio(), $this->getDescuento(), $this->getIdEstado(), $this->getImgUrl(), $correo);
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

	// *Cargará los datos de los agregados en un combobox
	public function CargarComboAgregados(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call cargarComboAgregados()');
			//* Se ejecuta
			$stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($id, $nombre);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdAgregado"=>$id,
						"Nombre"=>$nombre
					);
				}

				// *Transforma el array en string
				return json_encode($datos, JSON_UNESCAPED_UNICODE);
				$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// *Comprueba si el agregado está vinculado a una promo
	public function comprobarVinculacionAgregados(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call comprobarVinculacionAgregados(?)');
			// *Se pasan los parámetros
			$stmt->bind_param('i', $this->getIdAgregados());
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

	// *---------------------------------------------------

	// *Se cargan los agregados en la carta para que sean adquiridos
	public function CargarCartaAgregados(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosCartaAgregados()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $nombre, $descripcion, $unidades, $precio, $descuento, $estado, $imgUrl, $idEstado);
            $datos = array();
			// if($stmt->fetch()>0){
				// *Los resultados se añaden a un array para ser procesado y mostrados en pantalla
				while($stmt->fetch()){
					$datos[]=array(
                        "IdAgregado"=>$id,
						"Nombre"=>$nombre,
						"Descripcion"=>$descripcion,
						"Unidades"=>$unidades,
						"Precio"=>$precio,
						"Descuento"=>$descuento,
						"Estado"=>$estado,
						"ImgUrl"=>$imgUrl,
						"IdEstado"=>$idEstado
					);
				}

				// *Transforma el array en string
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}
}