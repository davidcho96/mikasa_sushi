<?php

require_once "../db_connection/connection.php";

class Cliente extends connection{
    private $idCliente;
    private $rut;
    private $nombre;
    private $apellidoP;
    private $apellidoM;
    private $idEstado;
    private $idSexo;
    private $correo;
    private $password;
    private $telefono;

    public function __construct(){
        $this->connect();
    }

    public function getIdCliente(){
		return $this->idCliente;
	}

	public function setIdCliente($idCliente){
		$this->idCliente = $idCliente;
	}

	public function getRut(){
		return $this->rut;
	}

	public function setRut($rut){
		$this->rut = $rut;
	}

	public function getNombre(){
		return $this->nombre;
	}

	public function setNombre($nombre){
		$this->nombre = $nombre;
	}

	public function getApellidoP(){
		return $this->apellidoP;
	}

	public function setApellidoP($apellidoP){
		$this->apellidoP = $apellidoP;
	}

	public function getApellidoM(){
		return $this->apellidoM;
	}

	public function setApellidoM($apellidoM){
		$this->apellidoM = $apellidoM;
	}

	public function getIdEstado(){
		return $this->idEstado;
	}

	public function setIdEstado($idEstado){
		$this->idEstado = $idEstado;
	}

	public function getIdSexo(){
		return $this->idSexo;
	}

	public function setIdSexo($idSexo){
		$this->idSexo = $idSexo;
	}

	public function getCorreo(){
		return $this->correo;
	}

	public function setCorreo($correo){
		$this->correo = $correo;
	}

	public function getPassword(){
		return $this->password;
	}

	public function setPassword($password){
		$this->password = $password;
	}

	public function getTelefono(){
		return $this->telefono;
	}

	public function setTelefono($telefono){
		$this->telefono = $telefono;
    }
    
    public function registro(){
        $id=1;
        $rut='NULL';
        $estado=1;
        $sexo=1;
        $telefono='NULL';
        $password_hash=password_hash($this->getPassword(), PASSWORD_DEFAULT, ['cost'=>12]);
        $conn=$this->dbConnection;
        $stmt=$conn->prepare("call registroCliente (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            @out_value)");
        $stmt->bind_param('issssiisss', $id, $rut, $this->getNombre(), $this->getApellidoP(), $this->getApellidoM(), $estado, $sexo, $this->getCorreo(), $password_hash, $telefono);
        $stmt->execute();
        $stmt->bind_result($result);
        if($stmt->fetch()>0){
            return $result;
        }else{
            return 1;
        }
    }
}