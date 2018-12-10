<?php

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para su uso en javascript

require '../db_connection/connection.php';

class InfoEmpresa extends connection{
    private $idInfoEmpresa;
    private $horaApertura;
    private $horaCierre;
    private $diaInicio;
	private $diaFinal;
	private $precioMaximo;

    public function getIdInfoEmpresa(){
		return $this->idInfoEmpresa;
	}

	public function setIdInfoEmpresa($idInfoEmpresa){
		$this->idInfoEmpresa = $idInfoEmpresa;
	}

	public function getHoraApertura(){
		return $this->horaApertura;
	}

	public function setHoraApertura($horaApertura){
		$this->horaApertura = $horaApertura;
	}

	public function getHoraCierre(){
		return $this->horaCierre;
	}

	public function setHoraCierre($horaCierre){
		$this->horaCierre = $horaCierre;
	}

	public function getDiaInicio(){
		return $this->diaInicio;
	}

	public function setDiaInicio($diaInicio){
		$this->diaInicio = $diaInicio;
	}

	public function getDiaFinal(){
		return $this->diaFinal;
	}

	public function setDiaFinal($diaFinal){
		$this->diaFinal = $diaFinal;
	}
	
	public function getPrecioMaximo(){
		return $this->precioMaximo;
	}

	public function setPrecioMaximo($precioMaximo){
		$this->precioMaximo = $precioMaximo;
	}
    
    public function cargarDatosInfoEmpresa(){
        try{
			// *Se obtiene la hora actual en base a la zona horaria especificada
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
			$stmt->bind_result($horaApertura, $horaCierre, $diaInicio, $diaFinal, $estadoFeriado);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
						"horaApertura"=>$horaApertura,
						"horaCierre"=>$horaCierre,
                        "diaInicio"=>$diaInicio,
						"diaFinal"=>$diaFinal,
						"horaActual"=>$horaActual,
						"diaSemana"=>$diaActual,
						"estadoFeriado"=>$estadoFeriado
					);
				}
				return json_encode($datos);

			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }

    public function actualizarHorasActividadEmpresa($correo){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call actualizaHorasActividad(
				?, ?, ?, @out_value)');
			$stmt->bind_param('sss', $this->getHoraApertura(), $this->getHoraCierre(), $correo);
			$stmt->execute();
			// *Se obtiene el resultado entregado poe el procedimiento
			$stmt->bind_result($result);
			if($stmt->fetch()>=0){
				echo $result;
			}else{
				echo 2;
				// *Error de BD
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    
    public function actualizarDiasActividadEmpresa($correo){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call actualizaDiasActividad(
				?, ?, ?, @out_value)');
			$stmt->bind_param('sss', $this->getDiaInicio(), $this->getDiaFinal(), $correo);
			$stmt->execute();
			// *Se obtiene el resultado devuelto por el procedimiento
			$stmt->bind_result($result);
			if($stmt->fetch()>=0){
				echo $result;
			}else{
				echo 2;
				// *Error de BD
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}

	public function cargarPrecioMaximo(){
        try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('select precioMaximo from precioMaximoCompra LIMIT 1');
			//*Se pasan los parámetros a la consulta
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($precioMaximo);
			if($stmt->fetch() > 0){
				return $precioMaximo;
				// *Retorna el precio máximo de la BD
			}

			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
	
	public function actualizarPrecioMaximoVenta(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			$stmt=$conn->prepare('call actualizarPrecioMaximoVenta(?)');
			$stmt->bind_param('i', $this->getPrecioMaximo());
			if($stmt->execute()){
				return 1;
				// *Actualización exitosa
			}else{
				return 2;
				// *Error al actualizar
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
}