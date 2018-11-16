<?php


require '../db_connection/connection.php';

class UnidadMedida extends connection{
    private $id;
    private $descripcion;

    public function getId(){
		return $this->id;
	}

	public function setId($id){
		$this->id = $id;
	}

	public function getDescripcion(){
		return $this->descripcion;
	}

	public function setDescripcion($descripcion){
		$this->descripcion = $descripcion;
    }
    
    public function CargarComboUnidadMedidas(){
        try{
            $db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call cargarComboUnidadMedida()');
			//* Se ejecuta
			$stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($id, $nombre);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdUnidad"=>$id,
						"Nombre"=>$nombre
					);
				}
				return json_encode($datos, JSON_UNESCAPED_UNICODE);
				$stmt->free_result();
        }catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
}