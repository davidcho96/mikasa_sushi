<?php

require '../db_connection/connection.php';

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para su uso en javascript

class Feriados extends connection{
    private $idFeriado;
    private $descripcion;
    private $dia;
    private $mes;

    public function getIdFeriado(){
		return $this->idFeriado;
	}

	public function setIdFeriado($idFeriado){
		$this->idFeriado = $idFeriado;
	}

	public function getDescripcion(){
		return $this->descripcion;
	}

	public function setDescripcion($descripcion){
		$this->descripcion = $descripcion;
	}

	public function getDia(){
		return $this->dia;
	}

	public function setDia($dia){
		$this->dia = $dia;
	}

	public function getMes(){
		return $this->mes;
	}

	public function setMes($mes){
		$this->mes = $mes;
    }
    
    // *Ingresará un nuevo feriado en BD
	public function ingresarFeriado($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call ingresarFeriados(?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('siis', $this->getDescripcion(), $this->getDia(), $this->getMes(), $correo);
            //* Se ejecuta
            $stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 2;//*error de BD
			}
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    
    // *Obtendrá los datos de la BD para mostrarlos en el mantenedor correspondiente
    public function cargarMantenedorFeriados(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosTablaFeriados()');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion, $dia, $mes);
            $datos = array();
            // if($stmt->fetch()>0){
                // *Los resultados se añaden a un array para ser procesado y mostrados en pantalla
                while($stmt->fetch()){
                    $datos[]=array(
                        "IdFeriado"=>$id,
                        "Descripcion"=>$descripcion, 
                        "Dia"=>$dia,
                        "Mes"=>$mes
                    );
                }

                // *Transforma el array en string
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
    
    public function eliminarFeriado($correo){
        try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call eliminarFeriado(?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('is', $this->getIdFeriado(), $correo);
            //* Se ejecuta
            $stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 2;//*error de BD
			}
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }

    // *Obtendrá los datos de la BD para mostrarlos en el mantenedor correspondiente
    public function cargarDatosModalFeriado(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerDatosActualizarFeriado(?)');
            //*Se pasan los parámetros
			$stmt->bind_param('i', $this->getIdFeriado());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $descripcion, $dia, $mes);
            $datos = array();
            // if($stmt->fetch()>0){
                // *Los resultados se añaden a un array para ser procesado y mostrados en pantalla
                while($stmt->fetch()){
                    $datos[]=array(
                        "IdFeriado"=>$id,
                        "Descripcion"=>$descripcion, 
                        "Dia"=>$dia,
                        "Mes"=>$mes
                    );
                }

                // *Transforma el array en string
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function actualizarFeriado($correo){
		try{
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call actualizarFeriado(?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('isiis', $this->getIdFeriado(), $this->getDescripcion(), $this->getDia(), $this->getMes(), $correo);
            //* Se ejecuta
            $stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}else{
				return 2;//*error de BD
			}
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
}