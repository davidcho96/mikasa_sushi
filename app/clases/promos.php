<?php

require_once '../db_connection/connection.php';

class Promos extends connection{
    private $idPromo;
    private $nombre;
    private $precio;
    private $descuento;
    private $idTipoPromo;
    private $idTipoPreparacion;
    private $idEstadoElemento;
    private $imgUrl;
    private $cantidad;
    private $agregados = array();
    private $tipocoberturas = array();

	public function getIdPromo(){
		return $this->idPromo;
	}

	public function setIdPromo($idPromo){
		$this->idPromo = $idPromo;
	}

	public function getNombre(){
		return $this->nombre;
	}

	public function setNombre($nombre){
		$this->nombre = $nombre;
	}

	public function getPrecio(){
		return $this->precio;
	}

	public function setPrecio($precio){
		$this->precio = $precio;
	}

	public function getDescuento(){
		return $this->descuento;
	}

	public function setDescuento($descuento){
		$this->descuento = $descuento;
	}

	public function getIdTipoPromo(){
		return $this->idTipoPromo;
	}

	public function setIdTipoPromo($idTipoPromo){
		$this->idTipoPromo = $idTipoPromo;
	}

	public function getIdTipoPreparacion(){
		return $this->idTipoPreparacion;
	}

	public function setIdTipoPreparacion($idTipoPreparacion){
		$this->idTipoPreparacion = $idTipoPreparacion;
	}

	public function getIdEstadoElemento(){
		return $this->idEstadoElemento;
	}

	public function setIdEstadoElemento($idEstadoElemento){
		$this->idEstadoElemento = $idEstadoElemento;
	}

	public function getImgUrl(){
		return $this->imgUrl;
	}

	public function setImgUrl($imgUrl){
		$this->imgUrl = $imgUrl;
	}

	public function getCantidad(){
		return $this->cantidad;
	}

	public function setCantidad($cantidad){
		$this->cantidad = $cantidad;
	}
    
    public function getAgregados(){
		return $this->agregados;
	}

	public function setAgregados($agregados){
		$this->agregados = $agregados;
    }
    
    public function getTipoCoberturas(){
		return $this->tipocoberturas;
	}

	public function setTipoCoberturas($tipocoberturas){
		$this->tipocoberturas = $tipocoberturas;
    }

    public function CargarMantenedorPromosCliente(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('select * from vistapromoscliente');
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($idPromo, $nombre, $precio, $descuento, $idTipoPromo, $tipoPromo, $idTipoPreparacion, $tipoElaboracion, $imgUrl, $estado, $idEstado);
            $datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
                        "IdPromo"=>$idPromo,
                        "Nombre"=>$nombre,
                        "Precio"=>$precio,
						"Descuento"=>$descuento,
						"IdTipoPromo"=>$idTipoPromo,
                        "TipoPromo"=>$tipoPromo,
						"IdTipoPreparacion"=>$idTipoPreparacion,
                        "TipoPreparacion"=>$tipoElaboracion,
                        "ImgUrl"=>$imgUrl,
                        "Estado"=>$estado,
                        "IdEstado"=>$idEstado
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function ingresarPromoCliente($correo){
        try{
            $errorFor = 0;
            $null = null;
            $db = connection::getInstance();
            $conn = $db->getConnection();
            mysqli_autocommit($conn, FALSE);
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL agregarPromo(?, ?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
            $stmt->bind_param("siiiiisis", $this->getNombre(), $this->getPrecio(), $this->getDescuento(), $this->getIdTipoPromo(), $this->getIdTipoPreparacion(), $this->getIdEstadoElemento(), $this->getImgUrl(), $this->getCantidad(), $correo);
            // ------------------------------------------------------------------------
            if($stmt->execute()){
                $array = $this->getAgregados();
                if(empty($array) || $array == '' || $array == NULL){
                    $errorFor = 1;
                }else{
                    foreach ($array as $key=>$valor) {
                        $stmt2 = $conn->prepare("CALL agregarDetallePromo(?, ?, ?, ?, @out_value)");
                        $stmt2->bind_param("iiis", $null, $valor[1], $valor[0], $correo);
                        if($stmt2->execute()){
                            $errorFor = 1;
                            $stmt2->free_result();
                        }else {
                            $conn->rollback();
                            $stmt2->free_result();
                        }
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
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function EliminarPromo($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call eliminarPromo(?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('is', $this->getIdPromo(), $correo);
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

    public function ObtenerInformacionPromoCliente(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosPromoCliente(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('i', $this->getIdPromo());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($nombre, $cantidad, $precio, $descuento, $idTipoPromo, $IdTipoElaboracion, $idEstado, $imgUrl, $agregados, $idAgregados, $cantidades);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"Nombre"=>$nombre,
						"Cantidad"=>$cantidad,
						"Precio"=>$precio,
                        "Descuento"=>$descuento,
                        "IdTipoPromo"=>$idTipoPromo,
                        "IdTipoElaboracion"=>$IdTipoElaboracion,
                        "ImgUrl"=>$imgUrl,
						"IdEstado"=>$idEstado,
                        "Agregados"=>$agregados,
                        "IdAgregados"=>$idAgregados,
                        "Cantidades"=>$cantidades
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function ActualizarDatosPromoCliente($correo){
        try{
            // *Se ejecutan 2 querys
            // *La primera elimina los datos de la tabla detalle para luego añadir los nuevos además de actualizar los datos
            // *La segunda ingresa los nuevos datos a la tabla detalle
            
            $errorFor = 0; //*Estado de ejecución de las querys
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            mysqli_autocommit($conn, FALSE);
			$stmt=$conn->prepare('call eliminarDetallePromoCliente(?, ?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('isiiiiiss', $this->getIdPromo(), $this->getNombre(), $this->getPrecio(), $this->getDescuento(), $this->getCantidad(), $this->getIdEstadoElemento(), $this->getIdTipoPromo(), $this->getImgUrl(), $correo);
            //* Se ejecuta
            
            //* Resultados obtenidos de la consulta
            // ------------------------------------------------------------------------------
            if($stmt->execute()){
                $array = $this->getAgregados();
                if(empty($array) || $array == '' || $array == NULL){
                    $errorFor = 1;
                }
                foreach ($array as $key=>
                $valor) {
                    $stmt2 = $conn->prepare("CALL actualizarDetallePromoCliente(?, ?, ?, ?, @out_value)");
                    $stmt2->bind_param("iiis", $valor[1], $valor[0], $this->getIdPromo(), $correo);
                    if($stmt2->execute()){
                        $errorFor = 1;
                        $stmt2->free_result();
                    }else {
                        $conn->rollback();
                        $stmt2->free_result();
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
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }

    // *----------------Promos Chef

    public function ingresarPromoChef($correo){
        try{
            $errorFor = 0;
            $null = null;
            $db = connection::getInstance();
            $conn = $db->getConnection();
            mysqli_autocommit($conn, FALSE);
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL agregarPromo(?, ?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
            $stmt->bind_param("siiiiisis", $this->getNombre(), $this->getPrecio(), $this->getDescuento(), $this->getIdTipoPromo(), $this->getIdTipoPreparacion(), $this->getIdEstadoElemento(), $this->getImgUrl(), $this->getCantidad(), $correo);
            // ------------------------------------------------------------------------
            if($stmt->execute()){
                $arrayAgregados = $this->getAgregados();
                $arrayTipoCoberturas = $this->getTipoCoberturas();
                if(empty($arrayAgregados) || $arrayAgregados == '' || $arrayAgregados == NULL){
                    $errorFor = 1;
                }else{
                    foreach ($arrayAgregados as $key=>$valor) {
                        $stmt2 = $conn->prepare("CALL agregarDetallePromo(?, ?, ?, ?, @out_value)");
                        $stmt2->bind_param("iiis", $null, $valor[1], $valor[0], $correo);
                        if($stmt2->execute()){
                            $errorFor = 1;
                            $stmt2->free_result();
                        }else {
                            $conn->rollback();
                            $stmt2->free_result();
                        }
                    }
                }
                if(empty($arrayTipoCoberturas) || $arrayTipoCoberturas == '' || $arrayTipoCoberturas == NULL){
                    $errorFor = 1;
                }else{
                    foreach ($arrayTipoCoberturas as $key=>$valor) {
                        $stmt3 = $conn->prepare("CALL agregarDetallePromo(?, ?, ?, ?, @out_value)");
                        $stmt3->bind_param("iiis",  $valor[0], $valor[1], $null, $correo);
                        if($stmt3->execute()){
                            $errorFor = 1;
                            $stmt3->free_result();
                        }else {
                            $conn->rollback();
                            $stmt3->free_result();
                        }
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
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function ObtenerInformacionPromoChef(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosPromoChef(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('i', $this->getIdPromo());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($nombre, $cantidad, $precio, $descuento, $idTipoPromo, $IdTipoElaboracion, $idEstado, $imgUrl, $agregados, $idAgregados, $cantidadesAgregados, $tipoCoberturas, $idTipoCoberturas, $cantidadesTipoCoberturas);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"Nombre"=>$nombre,
						"Cantidad"=>$cantidad,
						"Precio"=>$precio,
                        "Descuento"=>$descuento,
                        "IdTipoPromo"=>$idTipoPromo,
                        "IdTipoElaboracion"=>$IdTipoElaboracion,
                        "ImgUrl"=>$imgUrl,
						"IdEstado"=>$idEstado,
                        "Agregados"=>$agregados,
                        "IdAgregados"=>$idAgregados,
                        "CantidadesAgregados"=>$cantidadesAgregados,
                        "TipoCoberturas"=>$tipoCoberturas,
                        "IdTipoCoberturas"=>$idTipoCoberturas,
                        "CantidadesTipoCoberturas"=>$cantidadesTipoCoberturas
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function actualizarDatosPromoChef($correo){
        try{
            // *Se ejecutan 2 querys
            // *La primera elimina los datos de la tabla detalle para luego añadir los nuevos además de actualizar los datos
            // *La segunda ingresa los nuevos datos a la tabla detalle
            $null = null;
            $errorFor = 0; //*Estado de ejecución de las querys
			$db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            mysqli_autocommit($conn, FALSE);
			$stmt=$conn->prepare('call eliminarDetallePromoCliente(?, ?, ?, ?, ?, ?, ?, ?, ?, @out_value)');
			//*Se pasan los parámetros
			$stmt->bind_param('isiiiiiss', $this->getIdPromo(), $this->getNombre(), $this->getPrecio(), $this->getDescuento(), $this->getCantidad(), $this->getIdEstadoElemento(), $this->getIdTipoPromo(), $this->getImgUrl(), $correo);
            //* Se ejecuta
            
            //* Resultados obtenidos de la consulta
            // ------------------------------------------------------------------------------
            if($stmt->execute()){
                $arrayAgregados = $this->getAgregados();
                $arrayTipoCoberturas = $this->getTipoCoberturas();
                if(empty($arrayAgregados) || $arrayAgregados == '' || $arrayAgregados == NULL){
                    $errorFor = 1;
                }else{
                    foreach ($arrayAgregados as $key=>$valor) {
                        $stmt2 = $conn->prepare("CALL actualizarDetallePromoChef(?, ?, ?, ?, ?, @out_value)");
                        $stmt2->bind_param("iiiis", $valor[1], $null, $valor[0],  $this->getIdPromo(), $correo);
                        if($stmt2->execute()){
                            $errorFor = 1;
                            $stmt2->free_result();
                        }else {
                            $conn->rollback();
                            $stmt2->free_result();
                        }
                    }
                }

                if(empty($arrayTipoCoberturas) || $arrayTipoCoberturas == '' || $arrayTipoCoberturas == NULL){
                    $errorFor = 1;
                }else{
                    foreach ($arrayTipoCoberturas as $key=>$valor) {
                        $stmt3 = $conn->prepare("CALL actualizarDetallePromoChef(?, ?, ?, ?, ?, @out_value)");
                        $stmt3->bind_param("iiiis",  $valor[1], $valor[0], $null,  $this->getIdPromo(), $correo);
                        if($stmt3->execute()){
                            $errorFor = 1;
                            $stmt3->free_result();
                        }else {
                            $conn->rollback();
                            $stmt3->free_result();
                        }
                    }
                }
            }
            if($errorFor == 0){
                $conn->rollback();
                echo '2';
            }else{
                $conn->commit();
                echo '1';
            }

            $stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
}