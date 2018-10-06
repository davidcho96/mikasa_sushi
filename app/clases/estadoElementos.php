<?php

require_once '../db_connection/connection.php';

class EstadoElementos extends connection{
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
    
    public function cargarComboEstado(){
        try{
            $db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call cargarComboEstadoElementos()');
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($id, $descripcion);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"Id"=>$id,
						"Descripcion"=>$descripcion
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
}