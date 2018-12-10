<?php

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para su uso en javascript

require_once "../db_connection/connection.php"; // clase conexion

class InfoContacto extends connection {

    private $idInfoContacto;
    private $medioContacto;
	private $infoContacto;
	private $idEstadoMantenedor;
	
	public function getIdInfoContacto(){
		return $this->idInfoContacto;
	}

	public function setIdInfoContacto($idInfoContacto){
		$this->idInfoContacto = $idInfoContacto;
	}

	public function getMedioContacto(){
		return $this->medioContacto;
	}

	public function setMedioContacto($medioContacto){
		$this->medioContacto = $medioContacto;
	}

	public function getInfoContacto(){
		return $this->infoContacto;
	}

	public function setInfoContacto($infoContacto){
		$this->infoContacto = $infoContacto;
	}

	public function getIdEstadoMantenedor(){
		return $this->idEstadoMantenedor;
	}

	public function setIdEstadoMantenedor($idEstadoMantenedor){
		$this->idEstadoMantenedor = $idEstadoMantenedor;
	}
    
    public function  IngresaInfoContacto($correo){
		//*Método para la reaización del registro de datos de usuario en el sistema y BD
		try{
			//*Se establece la conexión con la BD
			$db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se encripta la contraseña para ser almacenada en la BD
			//*Se prepara la consulta
			$stmt=$conn->prepare("call insertaInfoContacto(
				?,
				?,
				?, @out_value)");//*Representa el valor output
				
			//*Se pasan los parámetros a la consulta
			$stmt->bind_param('sss', $this->getMedioContacto(),  $this->getInfoContacto(), $correo);
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($result);
 
			//*Se comprueba la respuesta
				if($stmt->fetch()>0){
					return $result;
				}else{
					return 2;
					// *Error en la ejecución
				}
			
			//*Se libera la respuesta en BD
			$stmt->free_result();

		}catch (Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}


	public function cargaTablaInfoContacto(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call obtenerDatosTablaInfoContacto()');
			//*Se pasan los parámetros a la consulta
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($idContacto, $medioContacto, $infoContacto);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
						"idContacto"=>$idContacto,
						"medioContacto"=>$medioContacto,
						"infoContacto"=>$infoContacto
					);
				}
				return json_encode($datos);

			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// *Obtiene los datos de la info de contacto a actualizar para cargarlos en el modal
	public function cargaModalInfoContacto(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call  cargaModalInfoContacto(?)');
			//*Se pasan los parámetros a la consulta
			 $stmt->bind_param('i', $this->getIdInfoContacto());
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($idContacto, $medioContacto, $infoContacto);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"idContacto"=>$idContacto,
						"medioContacto"=>$medioContacto,
						"infoContacto"=>$infoContacto
					);
					return json_encode($datos);
				}
			// }else{
				// return 'error';
			// }
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function eliminarInfoContacto(){
		$db = connection::getInstance();
		$conn = $db->getConnection();		
		$stmt=$conn->prepare("call eliminarInfoContacto(
			?,
			@out_value)");//*Representa el valor output
			
		//*Se pasan los parámetros a la consulta
		$stmt->bind_param('i', $this->getIdInfoContacto());
		//*Se ejecuta la consulta en BD
		$stmt->execute();
		//*Se obtiene el resultado
		$stmt->bind_result($result);
		//*Se comprueba la respuesta
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 2;
				// *Error en la ejecución
			}
		
		//*Se libera la respuesta en BD
		$stmt->free_result();
	}

	public function ActualizaInfoContacto($correo){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call actualizaInfoContacto(
				?, ?, ?, ?, @out_value)');
			$stmt->bind_param('isss', $this->getIdInfoContacto(), $this->getMedioContacto(),  $this->getInfoContacto(), $correo);
			$stmt->execute();
			$stmt->bind_result($result);
			if($stmt->fetch()>=0){
				echo $result;
			}else{
				echo 2;
				// *error en la ejecución
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}


}
