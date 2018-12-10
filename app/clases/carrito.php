<?php
//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL

// include '../db_connection/connection.php';

class Carrito extends connection{
    private $idCarrito;
    private $idCliente;

    public function getIdCarrito(){
		return $this->idCarrito;
	}

	public function setIdCarrito($idCarrito){
		$this->idCarrito = $idCarrito;
	}

	public function getIdCliente(){
		return $this->idCliente;
	}

	public function setIdCliente($idCliente){
		$this->idCliente = $idCliente;
    }


    // *Si el cliente no posee un carrito se generar uno en base de datos
    public function generarCarritoCliente($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL generarCarritoCliente(?, @out)');
            $stmt->bind_param("s", $correo);
            $stmt->execute();
            $stmt->bind_result($result);
            if($stmt->fetch()>0){
                return true;
            }else {
                return false;
            }
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
    
    // *Obtiene los datos de las promo commpra ingresadas en el carrito
    public function obtenerDatosCarrito($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosCarrito(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($idDetalle, $idPromoCompra, $idPromo, $nombre, $precio, $descuento, $imgUrl, $precioTotal, $idTipoPreparacion);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
                        "IdDetalle"=>$idDetalle,
                        "IdPromoCompra"=>$idPromoCompra,
                        "IdPromo"=>$idPromo,
						"Nombre"=>$nombre,
						"Precio"=>$precio,
                        "Descuento"=>$descuento,
                        "ImgUrl"=>$imgUrl,
                        "PrecioTotal"=>$precioTotal,
                        "IdTipoPreparacion"=>$idTipoPreparacion
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    // *Obtiene los datos de los agregados asociados al carrito
    public function obtenerDatosAgregadosCarrito($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
			$stmt=$conn->prepare('call obtenerDatosAgregadosCarrito(?)');
			//* Se pasa el id para obtener la información
			$stmt->bind_param('s', $correo);
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
			$stmt->bind_result($idDetalle, $idAgregado, $nombre, $unidades, $precio, $descuento, $imgUrl, $precioTotal);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
                        "IdDetalle"=>$idDetalle,
                        "IdAgregado"=>$idAgregado,
						"Nombre"=>$nombre,
						"Precio"=>$precio,
                        "Descuento"=>$descuento,
                        "PrecioTotal"=>$precioTotal,
                        "ImgUrl"=>$imgUrl,
                        "Unidades"=>$unidades
					);
				}
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    // *Se obtiene el precio total de los productos almacenados en el carrito
    public function obtenerPrecioTotalCarrito($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL obtenerPrecioCarrito(?, @out)');
            $stmt->bind_param("s", $correo);
            $stmt->execute();
            $stmt->bind_result($result);
            if($stmt->fetch()>0){
                return $result;
            }else {
                return 'error';
                // *Error de ejecución
            }
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    // *Obtiene las promo compra asociadas al carrito para luego insertarlas en la tabla de detalle venta
    // *Si esta se concreta
    public function obtenerDetallePromoCompraCarrito($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL obtenerDetallePromoCompraCarrito(?)');
            $stmt->bind_param("s", $correo);
            $stmt->execute();
            $stmt->bind_result($idPromoCompra);
            $datos = array();
				while($stmt->fetch()){
					$datos[]= array(
                        "IdPromoCompra"=>$idPromoCompra
					);
				}
                return $datos;
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    // *Se obtienen los agregados del detalle del carrito para luego ingresarlas al detalle de la venta cuando se concrete
    public function obtenerDetalleAgregadosCarrito($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL obtenerDetalleAgregadosCarrito(?)');
            $stmt->bind_param("s", $correo);
            $stmt->execute();
            $stmt->bind_result($idAgregado);
			$datos = array();
				while($stmt->fetch()){
					$datos[]=array(
                        "IdAgregado"=>$idAgregado
					);
				}
                return $datos;
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    // *Se obtiene el total del dinero de la tabla de simulación para llevar a cabo una compra en webpay
    public function obtenerDineroCartera(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL obtenerMontoCartera()');
            $stmt->execute();
            $stmt->bind_result($result);
            if($stmt->fetch()>0){
                return $result;
            }else {
                return 'error';
            }
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
}