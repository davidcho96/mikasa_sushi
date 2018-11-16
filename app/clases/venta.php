<?php

// require '../clases/venta.php';

class Venta extends connection{
    private $idTipoVenta;
    private $idTipoPago;
    private $idTipoEntrega;
    private $valor;
    private $lat;
    private $lng;
    private $direccion;
    private $receptor;
    private $idEstadoEntrega;
    private $fecha;
    private $hora;
    private $idEmpleado;
	private $detallePromoCompra = [];
	private $detalleAgregados = [];

    public function getIdTipoVenta(){
		return $this->idTipoVenta;
	}

	public function setIdTipoVenta($idTipoVenta){
		$this->idTipoVenta = $idTipoVenta;
	}

	public function getIdTipoPago(){
		return $this->idTipoPago;
	}

	public function setIdTipoPago($idTipoPago){
		$this->idTipoPago = $idTipoPago;
	}

	public function getIdTipoEntrega(){
		return $this->idTipoEntrega;
	}

	public function setIdTipoEntrega($idTipoEntrega){
		$this->idTipoEntrega = $idTipoEntrega;
	}

	public function getValor(){
		return $this->valor;
	}

	public function setValor($valor){
		$this->valor = $valor;
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

	public function getDetallePromoCompra(){
		return $this->detallePromoCompra;
	}

	public function setDetallePromoCompra($detallePromoCompra){
		$this->detallePromoCompra = $detallePromoCompra;
	}

	public function getDetalleAgregados(){
		return $this->detalleAgregados;
	}

	public function setDetalleAgregados($detalleAgregados){
		$this->detalleAgregados = $detalleAgregados;
	}

	// *Generará un código random que será utilizado posteriormente para recuperar la contraseña
	private function randomCode(){
		$caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789'; //* Caracteres posibles
		$code = '';
		$max = strlen($caracteres) - 1;
		for ($i = 0; $i <15 ; $i++) {
				$code .= $caracteres[mt_rand(0, $max)];
			}
		return strtoupper($code);
	}

    public function ingresarVenta($correo){
        try{
            $errorFor = 0;
			$arrayPromoCompra = $this->getDetallePromoCompra();
			$arrayAgregados = $this->getDetalleAgregados();
			$codigoVenta = $this->randomCode();
            $db = connection::getInstance();
            $conn = $db->getConnection();
            mysqli_autocommit($conn, FALSE);
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL ingresarVentaYPedido(?, ?, ?, ?, ?, ?, ?, @out)');
            $stmt->bind_param("ssiisss", $correo, $codigoVenta, $this->getIdTipoPago(), $this->getIdTipoEntrega(), $this->getDireccion(), $this->getReceptor(), $this->getHora());
			$stmt->execute();
			$stmt->bind_result($result);
			if($stmt->fetch() > 0){
				// $stmt->free_result();
				$stmt->close();
				if($result == 1){
				    foreach ($arrayPromoCompra as $key=>$valor) {
				        $stmt2 = $conn->prepare('call agregarDetallePromoCompraVenta(?, ?)');
						$stmt2->bind_param("is", $valor['IdPromoCompra'], $correo);
				        if($stmt2->execute()){
							$errorFor = 1;
				        }else {
							$errorFor = 0;
						}
				        $stmt2->free_result();
					}
					foreach ($arrayAgregados as $key=>$value) {
						$stmt3 = $conn->prepare('call agregarDetalleAgregadoVenta(?, ?)');
						$stmt3->bind_param('is', $value['IdAgregado'], $correo);
						if($stmt3->execute()){
							$errorFor = 1;
						}else{
							$errorFor = 0;
						}
						$stmt3->free_result();
					}
					if($errorFor == 1){
						$stmt4 = $conn->prepare('CALL eliminarDetalleCarrito(?)');
						$stmt4->bind_param("s", $correo);
						if($stmt4->execute()){
							$errorFor = 1;
						}else{
							$errorFor = 0;
						}
						$stmt4->free_result();
					}
				}else{
					$errorFor = 0;
					echo $result;
					exit;
				}
			}

            if($errorFor == 0){
                $conn->rollback();
                echo '2';
            }else{
                $conn->commit();
                echo '1';
            }

        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}
	
	public function validarFechaCompra(){
        try{
			date_default_timezone_set("America/Santiago");
			$dias = array('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo');
			$diaActual = date('N');

			$horaActual = date('H:i');
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call cargarDatosInfoEmpresa()');
			//*Se pasan los parámetros a la consulta
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($horaApertura, $horaCierre, $diaInicio, $diaFinal);
			if($stmt->fetch() > 0){
				$convertedHoraCierre = date('H:i', strtotime('-10 minutes',strtotime($horaCierre)));
				$convertedHoraActual = date('H:i', strtotime('+20 minutes',strtotime($horaActual)));
				if($diaActual < $diaInicio || $diaActual > $diaFinal){
					return 'errorDiaEntrega';
					// return false;
				}elseif ($this->getHora() >= $convertedHoraCierre || $this->getHora() < $horaApertura || $this->getHora() < $convertedHoraActual) {
					return 'errorHoraEntrega';
					// return false;
				}else {
					return 'puedescomprar';
					// return true;
				}
			}
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
	
	public function cargarVentasMikasa(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaVentas()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idVenta, $codigoVenta, $nombreCliente, $idCliente, $fechaVenta, $tipoEntrega, $tipoPago, $tipoVenta, $horaEntrega, $valor, $idEstadoVenta, $idEstadoEntrega, $estadoVenta);
            $datos = array();
				while($stmt->fetch()){
					$datos[]=array(
						"IdVenta"=>$idVenta,
						"CodigoVenta"=>$codigoVenta,
						"NombreCliente"=>$nombreCliente,
						"IdCliente"=>$idCliente,
						"Fecha"=>$fechaVenta,
						"TipoEntrega"=>$tipoEntrega,
						"TipoPago"=>$tipoPago,
						"TipoVenta"=>$tipoVenta,
						"HoraEntrega"=>$horaEntrega,
						"Valor"=>$valor,
						"IdEstadoVenta"=>$idEstadoVenta,
						"IdEstadoEntrega"=>$idEstadoEntrega,
						"EstadoVenta"=>$estadoVenta
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
}