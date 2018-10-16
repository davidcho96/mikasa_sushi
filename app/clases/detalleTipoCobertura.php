<?php

require_once '../db_connection/connection.php';

class DetalleTipoCoberturas extends connection {
    private $idDetalleCobertura;
    private $idTipoCobertura;
    private $idCobertura;

    public function getIdDetalleCobertura(){
		return $this->idDetalleCobertura;
	}

	public function setIdDetalleCobertura($idDetalleCobertura){
		$this->idDetalleCobertura = $idDetalleCobertura;
	}

	public function getIdTipoCobertura(){
		return $this->idTipoCobertura;
	}

	public function setIdTipoCobertura($idTipoCobertura){
		$this->idTipoCobertura = $idTipoCobertura;
	}

	public function getIdCobertura(){
		return $this->idCobertura;
	}

	public function setIdCobertura($idCobertura){
		$this->idCobertura = $idCobertura;
    }
    
    public function cargarDetalleTipoCobertura(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('select * from detalletipocobertura where idTipoCobertura = '.$this->getIdTipoCobertura());
			
			// $stmt=$conn->bind_param('i', $this->getIdTipoCobertura());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idDetalleCobertura, $idTipoCobertura, $idCobertura);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdDetallerCobertura"=>$idDetalleCobertura,
						"IdTipoCobertura"=>$idTipoCobertura,
						"IdCobertura"=>$idCobertura
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
}