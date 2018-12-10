<?php

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para su uso en javascript
// require '../clases/venta.php';

class Venta extends connection{
	private $idVenta;
	private $codigoVenta;
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
	private $motivoCancelacion;
	private $comentario;

	public function getIdVenta(){
		return $this->idVenta;
	}

	public function setIdVenta($idVenta){
		$this->idVenta = $idVenta;
	}

	public function getCodigoVenta(){
		return $this->codigoVenta;
	}

	public function setCodigoVenta($codigoVenta){
		$this->codigoVenta = $codigoVenta;
	}

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

	public function getMotivoCancelacion(){
		return $this->motivoCancelacion;
	}

	public function setMotivoCancelacion($motivoCancelacion){
		$this->motivoCancelacion = $motivoCancelacion;
	}

	public function getComentario(){
		return $this->comentario;
	}

	public function setComentario($comentario){
		$this->comentario = $comentario;
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
			$comentario = '';
			$direccion = '';
			if($this->getComentario() == '' || $this->getComentario() == NULL){
				$comentario = NULL;
			}else{
				$comentario = $this->getComentario();
			}

			if($this->getDireccion() == '' || $this->getDireccion() == NULL){
				$direccion = NULL;
			}else{
				$direccion = $this->getDireccion();
			}

			$arrayPromoCompra = $this->getDetallePromoCompra();
			$arrayAgregados = $this->getDetalleAgregados();
			$codigoVenta = $this->randomCode();
            $db = connection::getInstance();
            $conn = $db->getConnection();
            mysqli_autocommit($conn, FALSE);
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL ingresarVentaYPedido(?, ?, ?, ?, ?, ?, ?, ?, @out)');
            $stmt->bind_param("ssiissss", $correo, $codigoVenta, $this->getIdTipoPago(), $this->getIdTipoEntrega(), $direccion, $this->getReceptor(), $this->getHora(), $comentario);
			$stmt->execute();
			$stmt->bind_result($result);
			if($stmt->fetch() > 0){
				// $stmt->free_result();
				$stmt->close();
				if($result == 1){
					// *Si se ingresa la venta y el pedido se ingresa el detalle de esta
					// *Se obtiene el array con el detalle de promo compra del carrito se recorre y por cada iteración se ingresa un nuevo dato
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
					// *Si se ingresa la venta y el pedido se ingresa el detalle de esta
					// *Se obtiene el array con el detalle de agregados del detalle carrito compra se recorre y por cada iteración se ingresa un nuevo dato
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
						// *Si todo se ejecuta se elimina el detalle del carrito
						$stmt4 = $conn->prepare('CALL eliminarDetalleCarrito(?)');
						$stmt4->bind_param("s", $correo);
						if($stmt4->execute()){
							$errorFor = 1;
							// *Se eliminaron los datos
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
                return '2';
            }else{
                $conn->commit();
                return '1';
            }

        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
	}
	
	public function validarFechaCompra(){
        try{
			date_default_timezone_set("America/Santiago");
			// *Se obtiene la hora del país en que se encuentra el servidor
			$dias = array('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo');
			$diaActual = date('N');
			// *Se obtiene el número del día de la semana actual

			$horaActual = date('H:i');
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call cargarDatosInfoEmpresa()');
			//*Se pasan los parámetros a la consulta
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($horaApertura, $horaCierre, $diaInicio, $diaFinal, $estadoDia);
			if($stmt->fetch() > 0){
				$convertedHoraCierre = date('H:i', strtotime('-10 minutes',strtotime($horaCierre)));
				// *Se comprueba que la hora de entrega
				$convertedHoraActual = date('H:i', strtotime('+20 minutes',strtotime($horaActual)));
				if($diaActual < $diaInicio || $diaActual > $diaFinal){
					return 'errorDiaEntrega';
					// *El dia de la compra no está dentro de los días de actividad de la empresa
					// return false;
				}elseif ($this->getHora() >= $convertedHoraCierre || $this->getHora() < $horaApertura || $this->getHora() < $convertedHoraActual) {
					return 'errorHoraEntrega';
					// *La hora de entrega no cumple con 'Ser 20 minutos mayor que la hora de apertura'
					// *La hora de entrega no cumple con 'Ser 10 minutos menor que la hora de cierre'
					// return false;
				}else {
					return 'puedescomprar';
					// *Se puede ejecutar la compra
					// return true;
					// !Validar hora
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
            $stmt=$conn->prepare('call obtenerDatosTablaVentasDiaActual()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idVenta, $codigoVenta, $nombreCliente, $idCliente, $fechaVenta, $tipoEntrega, $direccion, $tipoVenta, $horaEntrega, $valor, $idEstadoVenta, $idEstadoEntrega, $estadoVenta);
            $datos = array();
				while($stmt->fetch()){
					$datos[]=array(
						"IdVenta"=>$idVenta,
						"CodigoVenta"=>$codigoVenta,
						"NombreCliente"=>$nombreCliente,
						"IdCliente"=>$idCliente,
						"Fecha"=>$fechaVenta,
						"TipoEntrega"=>$tipoEntrega,
						"Direccion"=>$direccion,
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

	// *Comprueba el tipo de entrega para luego abrir el modal que define si se debe seleccionar una ubicación en el mapa
	public function validarTipoEntrega(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call validarTipoEntrega(?)');
			$stmt->bind_param('i', $this->getIdVenta());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idTipoEntrega);
            if($stmt->fetch()>0){
				if($idTipoEntrega == 1){
					return 'Domicilio';
				}else{
					return 'Local';
				}
			}

            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function consultarFactibilidadCompra($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call consultarFactibilidadCompra(?, @out)');
			$stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($result);
            if($stmt->fetch()>0){
				return $result;
			}else{
				return '2';
				// *Error en la ejecución
			}

            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function aceptarVenta(){
		try{
			$db = connection::getInstance();
			$lat = $this->getLat();
			$lng = $this->getLng();
			if($lat == ''){
				$lat = null;
			}
			if($lng == ''){
				$lng = null;
			}
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call aceptarVenta(?, ?, ?, @out)');
			$stmt->bind_param('iss', $this->getIdVenta(), $lat, $lng);
            //* Se ejecuta
			$stmt->execute();
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
				// *La venta ha sido aceptada
			}else{
				return '2';
				// *La venta no pudo ser aceptada
			}
            //* Resultados obtenidos de la consulta


            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cancelarVenta($correo){
		try{
			$motivoCancelacion = $this->getMotivoCancelacion();
			if($motivoCancelacion == ''){
				$motivoCancelacion = 'No especificado';
			}
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call cancelarVenta(?, ?, ?)');
			$stmt->bind_param('iss', $this->getIdVenta(), $motivoCancelacion, $correo);
            //* Se ejecuta
            if($stmt->execute()){
				return '1';
				// *La consulta se ejecutó correctamente
			}else {
				return '2';
				// *Error en la ejecución
			}
            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function verDetalleVentaPromoCompra(){
		try{
			$arrayDetalle = [];
			// *Este array contendrá todos los items de la venta
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDetalleVentaPromoCompra(?)');
			$stmt->bind_param('i', $this->getIdVenta());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($nombre ,$detallePromoCompra);
            $datosPromoCompra = array();
				while($stmt->fetch()){
					$a = $detallePromoCompra;
					$datosPromoCompra[]=array(
						"NombrePromo"=>$nombre,
						"Detalle"=>$a
					);
				}
				// *Se obtiene las promo compra vinculadas a la venta y se añaden al arrayDetalle
				array_push($arrayDetalle, $datosPromoCompra);
				$stmt->close();
			$stmt2=$conn->prepare('call obtenerDetalleVentaAgregados(?)');
			$stmt2->bind_param('i', $this->getIdVenta());
			$stmt2->execute();
			$stmt2->bind_result($nombreAgregado);
			$datosAgregados = array();
				while($stmt2->fetch()){
					$datosAgregados[]=array(
						"NombreAgregado"=>$nombreAgregado
					);
				}
				// *Se obtienen los agregados vinculados a la venta y se añaden al arrayDetalle
				array_push($arrayDetalle, $datosAgregados);
				$stmt2->close();
			$stmt3=$conn->prepare('call obtenerComentarioVenta(?)');
			$stmt3->bind_param('i', $this->getIdVenta());
			$stmt3->execute();
			$stmt3->bind_result($comentario);
			if($stmt3->fetch() > 0){
				array_push($arrayDetalle, $comentario);
				// *Si existe un comentario se añade al arrayDetalle
			}
				$stmt3->close();
            return json_encode($arrayDetalle, JSON_UNESCAPED_UNICODE);
                // $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cargarTablaVentasCanceladas(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaVentasCanceladas()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idVenta, $codigoVenta, $nombreCliente, $idCliente, $fechaVenta, $tipoEntrega, $tipoPago, $horaEntrega, $valor, $motivoCancelacion, $empleado);
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
						"HoraEntrega"=>$horaEntrega,
						"Valor"=>$valor,
						"Motivo"=>$motivoCancelacion,
						"Empleado"=>$empleado
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// *Se obtiene el correo del cliente que solicitó la venta para notificarle via email la decisión sobre su compra
	public function obtenerCorreoClienteVenta(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerCorreoClienteVenta(?, ?)');
			$stmt->bind_param('is', $this->getIdVenta(), $this->getCodigoVenta());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($correoCliente);
            if($stmt->fetch()>0){
				return $correoCliente;
				// *Se retorna el correo del cliente
			}

            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	// *Se obtiene el precio máximo por compra permitido para mostrarlo en pantalla
	public function cargarPrecioMaximoCompra(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerPrecioMaximoCompra()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($precioMaximo);
            if($stmt->fetch()>0){
				return $precioMaximo;
			}else{
				return null;
			}

            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cargarTablaHistorialVentas(){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaHistorialVentas()');
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