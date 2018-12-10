<?php

//*BD = Base de datos
//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para ser utilizado en javascript


require_once '../db_connection/connection.php'; //*Clase conexión BD

class Empleado extends connection{
    private $idEmpleado;
    private $idTipoEmpleado;
    private $password;
    private $idEstado;
    private $correo;
    private $nombre;
    private $apellidos;

    public function getIdEmpleado(){
		return $this->idEmpleado;
	}

	public function setIdEmpleado($idEmpleado){
		$this->idEmpleado = $idEmpleado;
	}

	public function getIdTipoEmpleado(){
		return $this->idTipoEmpleado;
	}

	public function setIdTipoEmpleado($idTipoEmpleado){
		$this->idTipoEmpleado = $idTipoEmpleado;
	}

	public function getPassword(){
		return $this->password;
	}

	public function setPassword($password){
		$this->password = $password;
	}

	public function getIdEstado(){
		return $this->idEstado;
	}

	public function setIdEstado($idEstado){
		$this->idEstado = $idEstado;
	}

	public function getCorreo(){
		return $this->correo;
	}

	public function setCorreo($correo){
		$this->correo = $correo;
	}

	public function getNombre(){
		return $this->nombre;
	}

	public function setNombre($nombre){
		$this->nombre = $nombre;
	}

	public function getApellidos(){
		return $this->apellidos;
	}

	public function setApellidos($apellidos){
		$this->apellidos = $apellidos;
	}
	
	// *Generará un código random que será utilizado posteriormente para recuperar la contraseña
	public function randomCode(){
		$caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789'; //* Caracteres posibles
		$code = '';
		$max = strlen($caracteres) - 1;
		for ($i = 0; $i < 7; $i++) {
			 $code .= $caracteres[mt_rand(0, $max)];
			}
		return $code;
	}
    
    public function login(){
        try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare("call loginEmpleado(?,
			@pass, @tipo)");
			//*Se pasan los parámetros a la consulta
			$stmt->bind_param('s', $this->getCorreo());
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtienen los resultado
			$stmt->bind_result($result, $tipoUser);
			//*Se comprueba la respuesta
			if($stmt->fetch()>0){
				switch($result){
					case 'error':
						return 'error';
					break;
					case 'errorEstado':
						echo 'errorEstado';
						break;
					default:
					// *Se verifica si la contraseña encriptada almacenada coincide con la ingresada
					
					$passHash = $result;
					if(password_verify($this->getPassword(), $passHash)){
						return $tipoUser; //*Registro exitoso
					}else {
						return 'error'; //*Registro erróneo
					}
					break;
				}
			}
			//*Se libera la respuesta en BD
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
	public function IngresaEmpleado(){
		try{
			//*Se establece la conexión con la BD
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$estado = 1; //* El estado es 1 por defecto
			$email = $this->getCorreo();
			//*Se encripta la contraseña para ser almacenada en la BD
			$password_hash = password_hash($this->getPassword(), PASSWORD_DEFAULT, ['cost'=>12]);
			//*Se prepara la consulta
			$stmt=$conn->prepare("call registroEmpleado (?,
				?,
				?,
				?,
				?,
				?,
				?,
				@out_value)");//*Representa el valor output
				
			//*Se pasan los parámetros a la consulta
			$stmt->bind_param('isissss',$this->getIdTipoEmpleado(), $password_hash, $estado, $this->getCorreo(), $this->getNombre(), $this->getApellidos(), $email);
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($result);

			//*Se comprueba la respuesta
				if($stmt->fetch()>0){
					return $result;
				}else{
					return 'Ha ocurrido un error';
				}
			
			//*Se libera la respuesta en BD
			$stmt->free_result();

		}catch (Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
	
	public function cargarTablaEmpleados($correo){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			// $email = $this->getCorreo();
			$stmt=$conn->prepare('call listarEmpleado(?)');
			//*Se pasan los parámetros a la consulta
			$stmt->bind_param('s', $correo);
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($idEmpleado, $nombre, $apellidos, $correo, $idTipoEmpleado, $estado);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"idEmpleado"=>$idEmpleado,
						"Nombre"=>$nombre,
						"Apellidos"=>$apellidos,
						"Correo"=>$correo,
						"TipoEmpleado"=>$idTipoEmpleado,
						"Estado"=> $estado
					);
				}
				return json_encode($datos);
			// }else{
				// return 'error';
			// }
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// esta funcion obtiene el id de la tabla para luego actualizar el estado del  empleado
	public function eliminaEmpleado($correo){
		$db = connection::getInstance();
		$conn = $db->getConnection();		
		$stmt=$conn->prepare("call eliminarEmpleado(
			?,
			?, @out_value)");//*Representa el valor output
			
		//*Se pasan los parámetros a la consulta
		$stmt->bind_param('is', $this->getIdEmpleado(), $correo);
		//*Se ejecuta la consulta en BD
		$stmt->execute();
		//*Se obtiene el resultado
		$stmt->bind_result($result);
		//*Se comprueba la respuesta
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 'Ha ocurrido un error';
			}
		
		//*Se libera la respuesta en BD
		$stmt->free_result();
	}

	public function cargaCliente($id){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			// el procedimiento nos devuelve los datos del cliente para luego cargarlos al modal
			$stmt=$conn->prepare('call  CargaModalEmpleado(?)');
			//*Se pasan los parámetros a la consulta
			 $stmt->bind_param('i', $id);
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($idEmpleado, $nombre, $apellidos, $correo, $idEstado ,$idTipoEmpleado);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"id"=>$idEmpleado,
						"Nombre"=>$nombre,
						"Apellidos"=>$apellidos,
						"Correo"=>$correo,
						"idEstado"=>$idEstado,
						"idTipoEmpleado"=>$idTipoEmpleado
					);
				}
				return json_encode($datos);
			// }else{
				// return 'error';
			// }
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
	public function ActualizaEmpleado($correo){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call actualizaEmpleado(
				?, ?, ?, ?, ?, ?, ?, @out_value)');
			$stmt->bind_param('isssiis', $this->getIdEmpleado(), $this->getNombre(), $this->getApellidos(),  $this->getCorreo(), $this->getIdEstado(), $this->getIdTipoEmpleado(), $correo);
			$stmt->execute();
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				echo $result;
			}else{
				echo 3;
				// *Error en la ejecución
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// *Comprueba si el correo existe en los registros de la base de datos
	// *Función utilizada para recuperar la pass
	public function consultarExistenciaEmpleado(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare("call consultarExistenciaEmpleado(?,
			@result, @idTipo)");
			//*Se pasan los parámetros a la consulta
			$stmt->bind_param('s', $this->getCorreo());
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($result, $tipo);
			//*Se comprueba la respuesta
			if($stmt->fetch()>0){
				switch($result){
					case 'error':
						return 2;
					break;
					case 'errorEstado':
						return 3;
					break;
					default:
						return 1;
					break;
				}
			}
			//*Se libera la respuesta en BD
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// *Cambia la pass del usuario
	public function recuperarPass($token){
		try{
			// *Se encripta la pass para ser ingresada en la BD
			$password_ = password_hash($this->getPassword(), PASSWORD_DEFAULT, ['cost'=>12]);
			$db = connection::getInstance();
			$conn = $db->getConnection();

			// *Se prepara la query 
			$stmt=$conn->prepare('call recuperarPassEmpleado(?, ?, @out_value)');
			// *Se pasan los valores a la query
			$stmt->bind_param('ss', $password_, $this->getCorreo());
			// *Se ejecuta la query
			$stmt->execute();
			// *Se obtiene el resultado de la query
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}else{
				// *Error
				return '2';
			}
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
}