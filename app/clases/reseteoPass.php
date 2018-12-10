<?php

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para su uso en javascript

require '../db_connection/connection.php';

class ReseteoPass extends connection{
    private $id;
    private $token;
    private $correo;

    public function getId(){
		return $this->id;
	}

	public function setId($id){
		$this->id = $id;
	}

	public function getToken(){
		return $this->token;
	}

	public function setToken($token){
		$this->token = $token;
	}

	public function getCorreo(){
		return $this->correo;
    }
    
    public function setCorreo($correo){
		$this->correo = $correo;
	}

	// *Se ingresa una nueva fila a la tabla de reseteo pass
	// *Este dato solo dura 24 horas a menos que el usuario ya lo haya utilizado para recuperar su contraseña
    public function ingresarReseteoPass(){
		try{
			$dbc = connection::getInstance();
			$connc = $dbc->getConnection();
			$stmt2=$connc->prepare("call ingresarReseteoPass(?, ?)");
			//*Se pasan los parámetros a la consulta
			$stmt2->bind_param('ss', $this->getToken(), $this->getCorreo());
			//*Se ejecuta la consulta en BD
			if($stmt2->execute()){
				return 1;
				// *El token se registró exitosamente
			}else{
				return 2;
				// *Error en la ejecución
			}
			$stmt2->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    
	// *Verifica si el token aún existe
	// *Se utilizará para validar que la acción de recuperar pass se ejecute dentro de las 24 horas
	public function consultarExistenciaToken(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare("call consultarExistenciaToken(?)");
			//*Se pasan los parámetros a la consulta
			$stmt->bind_param('s', $this->getToken());
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($result);
			//*Se comprueba la respuesta
			if($stmt->fetch()>0){
				return true;
				// *Si existe
			}else{
				return false;
				// *No existe
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
	
	// *Consulta si existe el token asociado a ese correo
    public function consultarCorreoToken($token){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare("call consultarCorreoToken(?)");
			//*Se pasan los parámetros a la consulta
			$stmt->bind_param('s', $token);
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($result);
			//*Se comprueba la respuesta
			if($stmt->fetch()>0){
				return $result;
			}else{
				return false;
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
	
	// *Si se cambia la contraseña existosamente se elimina el token
    public function eliminarToken($token){
        try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare("call eliminarToken(?)");
			//*Se pasan los parámetros a la consulta
			$stmt->bind_param('s', $token);
			//*Se ejecuta la consulta en BD
			if($stmt->execute()){
				return 1;
				// *El token se eliminó correctamente
            }else {
				return 2;
				// *Error en la ejecución
            }

		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
}