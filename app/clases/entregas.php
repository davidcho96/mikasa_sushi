<?php

require '../db_connection/connection.php';

class Entregas extends connection{
    private $idEntrega;
    private $idCodigoVenta;
    private $lat;
    private $lng;
    private $direccion;
    private $receptor;
    private $idEstadoEntrega;
    private $fecha;
    private $hora;
	private $idEmpleado;
	private $codigoVenta;

    public function getIdEntrega(){
		return $this->idEntrega;
	}

	public function setIdEntrega($idEntrega){
		$this->idEntrega = $idEntrega;
	}

	public function getIdCodigoVenta(){
		return $this->idCodigoVenta;
	}

	public function setIdCodigoVenta($idCodigoVenta){
		$this->idCodigoVenta = $idCodigoVenta;
	}

	public function getLat(){
		return $this->lat;
	}

	public function setLat($lat){
		$this->lat = $lat;
	}

	public function getLng(){
		return $this->lng;
	}

	public function setLng($lng){
		$this->lng = $lng;
	}

	public function getDireccion(){
		return $this->direccion;
	}

	public function setDireccion($direccion){
		$this->direccion = $direccion;
	}

	public function getReceptor(){
		return $this->receptor;
	}

	public function setReceptor($receptor){
		$this->receptor = $receptor;
	}

	public function getIdEstadoEntrega(){
		return $this->idEstadoEntrega;
	}

	public function setIdEstadoEntrega($idEstadoEntrega){
		$this->idEstadoEntrega = $idEstadoEntrega;
	}

	public function getFecha(){
		return $this->fecha;
	}

	public function setFecha($fecha){
		$this->fecha = $fecha;
	}

	public function getHora(){
		return $this->hora;
	}

	public function setHora($hora){
		$this->hora = $hora;
	}

	public function getIdEmpleado(){
		return $this->idEmpleado;
	}

	public function setIdEmpleado($idEmpleado){
		$this->idEmpleado = $idEmpleado;
	}
	
	public function getCodigoVenta(){
		return $this->codigoVenta;
	}

	public function setCodigoVenta($codigoVenta){
		$this->codigoVenta = $codigoVenta;
	}
    
    public function cargarTablaEntregasPendientes(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaEntregasPendientes()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idVenta, $idEntrega, $codigoVenta, $lat, $lng, $direccion, $receptor, $idEstadoEntrega, $estadoEntrega, $fecha, $hora, $cliente, $tipoEntrega, $tipoPago, $valor);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdVenta"=>$idVenta,
                        "IdEntrega"=>$idEntrega,
                        "CodigoVenta"=>$codigoVenta,
                        "Lat"=>$lat,
                        "Lng"=>$lng,
                        "Direccion"=>$direccion,
                        "Receptor"=>$receptor,
                        "IdEstadoEntrega"=>$idEstadoEntrega,
                        "EstadoEntrega"=>$estadoEntrega,
                        "Fecha"=>$fecha,
						"Hora"=>$hora,
						"Cliente"=>$cliente,
						"TipoEntrega"=>$tipoEntrega,
						"TipoPago"=>$tipoPago,
						"Valor"=>$valor
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}
	
	public function corroborarTipoEntrega(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call corroborarTipoEntrega(?, ?)');
			//* Se ejecuta
			$stmt->bind_param('is', $this->getIdEntrega(), $this->getCodigoVenta());
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($idTipoEntrega, $idEstadoEntrega);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
                        "IdTipoEntrega"=>$idTipoEntrega,
                        "IdEstadoEntrega"=>$idEstadoEntrega
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cargarOpcionesEntregaLocal(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call cargarOpcionesEntregaLocal()');
			//* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($idEstadoEntrega, $estadoEntrega);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
                        "IdEstadoEntrega"=>$idEstadoEntrega,
                        "EstadoEntrega"=>$estadoEntrega
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cargarOpcionesEntregaDomicilio(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call cargarOpcionesEntregaDomicilio()');
			//* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($idEstadoEntrega, $estadoEntrega);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
                        "IdEstadoEntrega"=>$idEstadoEntrega,
                        "EstadoEntrega"=>$estadoEntrega
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function actualizarEstadoEntrega(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call actualizarEstadoEntrega(?, ?)');
			$stmt->bind_param('ii', $this->getIdEntrega(), $this->getIdEstadoEntrega());
            //* Se ejecuta
            if($stmt->execute()){
				return '1';
			}else {
				return '2';
			}
            //* Resultados obtenidos de la consulta


            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cargarTablaEntregasPendientesRepartidor(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaEntregasPendientesRepartidor()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idVenta, $idEntrega, $codigoVenta, $lat, $lng, $direccion, $receptor, $idEstadoEntrega, $estadoEntrega, $fecha, $hora, $cliente, $tipoEntrega, $tipoPago, $valor, $diferencia);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdVenta"=>$idVenta,
                        "IdEntrega"=>$idEntrega,
                        "CodigoVenta"=>$codigoVenta,
                        "Lat"=>$lat,
                        "Lng"=>$lng,
                        "Direccion"=>$direccion,
                        "Receptor"=>$receptor,
                        "IdEstadoEntrega"=>$idEstadoEntrega,
                        "EstadoEntrega"=>$estadoEntrega,
                        "Fecha"=>$fecha,
						"Hora"=>$hora,
						"Cliente"=>$cliente,
						"TipoEntrega"=>$tipoEntrega,
						"TipoPago"=>$tipoPago,
						"Valor"=>$valor,
						"HorasDiferencia"=>$diferencia
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}

	public function obtenerDatosPedidoPendienteRepartidor(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosEntregaPendienteRepartidor(?, ?)');
			//* Se ejecuta
			$stmt->bind_param('is', $this->getIdEntrega(), $this->getCodigoVenta());
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($idTipoEntrega, $idEstadoEntrega, $direccion, $hora, $lat, $lng, $receptor);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
                        "IdTipoEntrega"=>$idTipoEntrega,
						"IdEstadoEntrega"=>$idEstadoEntrega,
						"Direccion"=>$direccion,
						"Hora"=>$hora,
						"Lat"=>$lat,
						"Lng"=>$lng,
						"Receptor"=>$receptor
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cambiarEstadoEntregaRepartidor($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call actualizarEstadoEntregaRepartidor(?, ?, ?, ?, @out_value)');
			$stmt->bind_param('isis', $this->getIdEntrega(), $this->getCodigoVenta(), $this->getIdEstadoEntrega(), $correo);
			//* Se ejecuta
			$stmt->execute();
			$stmt->bind_result($result);
            if($stmt->fetch() > 0){
				return $result;
			}else {
				return '2';
			}
            //* Resultados obtenidos de la consulta


            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cargarTablaMisEntregasPendientesRepartidor($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosTablaMisEntregasPendientesRepartidor(?)');
			$stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idVenta, $idEntrega, $codigoVenta, $lat, $lng, $direccion, $receptor, $idEstadoEntrega, $estadoEntrega, $fecha, $hora, $cliente, $tipoEntrega, $tipoPago, $valor);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdVenta"=>$idVenta,
                        "IdEntrega"=>$idEntrega,
                        "CodigoVenta"=>$codigoVenta,
                        "Lat"=>$lat,
                        "Lng"=>$lng,
                        "Direccion"=>$direccion,
                        "Receptor"=>$receptor,
                        "IdEstadoEntrega"=>$idEstadoEntrega,
                        "EstadoEntrega"=>$estadoEntrega,
                        "Fecha"=>$fecha,
						"Hora"=>$hora,
						"Cliente"=>$cliente,
						"TipoEntrega"=>$tipoEntrega,
						"TipoPago"=>$tipoPago,
						"Valor"=>$valor
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}

	public function finalizarEntregaPedido(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call finalizarEntregaRepartidor(?, ?, ?, @out_value)');
			$stmt->bind_param('isi', $this->getIdEntrega(), $this->getCodigoVenta(), $this->getIdEstadoEntrega());
			//* Se ejecuta
			$stmt->execute();
			$stmt->bind_result($result);
            if($stmt->fetch() > 0){
				return $result;
			}else {
				return '2';
			}
            //* Resultados obtenidos de la consulta


            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cargarTablaMisEntregasRealizadas($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosTablaMisEntregasRealizadas(?)');
			$stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idVenta, $idEntrega, $codigoVenta, $direccion, $receptor, $fecha, $hora, $cliente, $tipoPago, $valor, $horaEntrega);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdVenta"=>$idVenta,
                        "IdEntrega"=>$idEntrega,
                        "CodigoVenta"=>$codigoVenta,
                        "Direccion"=>$direccion,
                        "Receptor"=>$receptor,
                        "Fecha"=>$fecha,
						"Hora"=>$hora,
						"Cliente"=>$cliente,
						"TipoPago"=>$tipoPago,
						"Valor"=>$valor,
						"HoraEntrega"=>$horaEntrega
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}

	public function cargarTrackingMisOrdenes($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosTrackingMisOrdenes(?)');
			$stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idVenta, $codigoVenta, $fecha, $tipoEntrega, $tipoPago, $hora, $valor, $estadoEntrega, $receptor, $icono);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdVenta"=>$idVenta,
                        "CodigoVenta"=>$codigoVenta,
                        "Fecha"=>$fecha,
                        "TipoEntrega"=>$tipoEntrega,
						"TipoPago"=>$tipoPago,
						"Hora"=>$hora,
						"Valor"=>$valor,
						"EstadoEntrega"=>$estadoEntrega,
						"Receptor"=>$receptor,
						"Icono"=>$icono
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}
}