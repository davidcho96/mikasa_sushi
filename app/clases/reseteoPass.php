<?php

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
			}else{
				return 2;
			}
			$stmt2->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    
    
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
			}else{
				return false;
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    
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
            }else {
                return 2;
            }

		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
}