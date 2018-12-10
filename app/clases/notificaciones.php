<?php

require '../db_connection/connection.php';

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para su uso en javascript

class Notificacion extends connection{
    private $idActividad;
    private $fecha;
    private $descripcion;
    private $codigoVenta;

    public function getIdActividad(){
		return $this->idActividad;
	}

	public function setIdActividad($idActividad){
		$this->idActividad = $idActividad;
	}

	public function getFecha(){
		return $this->fecha;
	}

	public function setFecha($fecha){
		$this->fecha = $fecha;
	}

	public function getDescripcion(){
		return $this->descripcion;
	}

	public function setDescripcion($descripcion){
		$this->descripcion = $descripcion;
	}

	public function getCodigoVenta(){
		return $this->codigoVenta;
	}

	public function setCodigoVenta($codigoVenta){
		$this->codigoVenta = $codigoVenta;
    }
    
    public function cargarNotificaciones(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call cargarNotificaciones()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $fecha, $notificacion, $codigoVenta, $idActividad);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdNotificacion"=>$id,
                        "Fecha"=>$fecha,
                        "Notificacion"=>$notificacion,
                        "CodigoVenta"=>$codigoVenta,
                        "IdActividad"=>$idActividad
					);
				}
                return json_encode($datos);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
}