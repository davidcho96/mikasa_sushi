<?php

require '../db_connection/connection.php';

class InfoEmpresa extends connection{
    private $idInfoEmpresa;
    private $horaApertura;
    private $horaCierre;
    private $diaInicio;
    private $diaFinal;

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
    
    public function cargarDatosInfoEmpresa(){
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
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
						"horaApertura"=>$horaApertura,
						"horaCierre"=>$horaCierre,
                        "diaInicio"=>$diaInicio,
						"diaFinal"=>$diaFinal,
						"horaActual"=>$horaActual,
						"diaSemana"=>$diaActual
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
			$stmt->bind_result($result);
			if($stmt->fetch()>=0){
				echo $result;
			}else{
				echo 2;
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
			$stmt->bind_result($result);
			if($stmt->fetch()>=0){
				echo $result;
			}else{
				echo 2;
			}
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
}