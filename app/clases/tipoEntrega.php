<?php

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para su uso en javascript

require '../db_connection/connection.php';

class TipoEntrega extends connection{
    private $idTipoEntrega;
    private $descripcion;

    public function getIdTipoEntrega(){
		return $this->idTipoEntrega;
	}

	public function setIdTipoEntrega($idTipoEntrega){
		$this->idTipoEntrega = $idTipoEntrega;
	}

	public function getDescripcion(){
		return $this->descripcion;
	}

	public function setDescripcion($descripcion){
		$this->descripcion = $descripcion;
    }
    
    public function cargarComboBoxTipoEntrega($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call cargarComboTipoEntrega(?)');
            $stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion);
            $datos = array();   
				while($stmt->fetch()){
					$datos[]=array(
                        "IdTipoEntrega"=>$id,
						"Descripcion"=>$descripcion
					);
				}
            return json_encode($datos, JSON_UNESCAPED_UNICODE);
            $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
}