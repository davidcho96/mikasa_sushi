<?php

require_once '../db_connection/connection.php';

class TipoCoberturas extends connection {
    private $idTipoCobertura;
    private $nombre;
    private $coberturas = array();

    public function getIdTipoCobertura(){
		return $this->idTipoCobertura;
	}

	public function setIdTipoCobertura($idTipoCobertura){
		$this->idTipoCobertura = $idTipoCobertura;
	}

	public function getNombre(){
		return $this->nombre;
	}

	public function setNombre($nombre){
		$this->nombre = $nombre;
    }

    public function getCoberturas(){
		return $this->coberturas;
	}

	public function setCoberturas($coberturas){
		$this->coberturas = $coberturas;
    }
    
    public function CargarTablaTipoCoberturas(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('SELECT * FROM vistaTablaTipoCobertura');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $nombre, $coberturas);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdTipoCobertura"=>$id,
						"Nombre"=>$nombre,
                        "Coberturas"=>$coberturas,
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function IngresarTipoCoberturas($correo){
        try{
            $errorFor = 0;
            $db = connection::getInstance();
            $conn = $db->getConnection();
            mysqli_autocommit($conn, FALSE);
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL agregarTipoCobertura(?, ?, @out_value)');
            $stmt->bind_param("ss", $this->getNombre(), $correo);
            // ------------------------------------------------------------------------
            if($stmt->execute()){
                $array = $this->getCoberturas();
                foreach ($array as $key=>$valor) {
                    $stmt2 = $conn->prepare("CALL agregarDetalleTipoCobertura(?, ?, @out_value)");
                    $stmt2->bind_param("is", $valor, $correo);
                    if($stmt2->execute()){
                        $errorFor = 1;
                    }else {
                        $conn->rollback();
                    }
                }
            }

            $conn->commit();
            if($errorFor == 0){
                $conn->rollback();
                echo '2';
            }else{
                $conn->commit();
                echo '1';
            }

            $stmt->free_result();
            $stmt2->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function EliminarTipoCobertura($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call eliminarTipoCobertura(?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('is', $this->getIdTipoCobertura(), $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				return $result;
			}
			else{
				return 2;
            }
            
            $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function actualizarDatosTipoCoberturas($correo){
		try{
            // *Se ejecutan 2 querys
            // *La primera elimina los datos de la tabla detalle para luego añadir los nuevos
            // *La segunda actualiza los datos de la promo seleccionda
            
            $errorFor = 0; //*Estado de ejecución de las querys
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            mysqli_autocommit($conn, FALSE);
			$stmt=$conn->prepare('call eliminarDetalleTipoCobertura(?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('iss', $this->getIdTipoCobertura(), $this->getNombre(), $correo);
            //* Se ejecuta
            
            //* Resultados obtenidos de la consulta
            // ------------------------------------------------------------------------------
            if($stmt->execute()){
                $array = $this->getCoberturas();
                foreach ($array as $key=>$valor) {
                    $stmt2 = $conn->prepare("CALL actualizarDetalleTipoCobertura(?, ?, ?, @out_value)");
                    $stmt2->bind_param("iis", $valor, $this->getIdTipoCobertura(), $correo);
                    if($stmt2->execute()){
                        $errorFor = 1;
                    }else {
                        $conn->rollback();
                    }
                }
            }
            $conn->commit();
            if($errorFor == 0){
                $conn->rollback();
                echo '2';
            }else{
                $conn->commit();
                echo '1';
            }

            $stmt->free_result();
            $stmt2->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    public function CargarComboTipoCoberturas(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call cargarComboTipoCobertura()');
			//* Se ejecuta
			$stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($id, $nombre);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"IdTipoCobertura"=>$id,
						"Nombre"=>$nombre
					);
				}
				return json_encode($datos, JSON_UNESCAPED_UNICODE);
				$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
    
    public function comprobarVinculacionTipoCobertura(){
		try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			//*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call comprobarVinculacionTipoCobertura(?)');
			// *Se pasan los parámetros
			$stmt->bind_param('i', $this->getIdTipoCobertura());
			//* Se ejecuta
			$stmt->execute();
			//* Resultados obtenidos de la consulta
			$stmt->bind_result($result);
			if($stmt->fetch()>0){
				echo $result;
			}

			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
	}
}