<?php 

//* La clase hereda a la clase conexión para obtener la conexión a la BD MySQL
// *Json encode convierte el array en string para su uso en javascript

require '../db_connection/connection.php';

class PromoCompra extends connection{
    private $idPromoCompra;
    private $idPromo;
    private $rollsCompra = array();
    private $idAgregados;

    public function getIdPromoCompra(){
		return $this->idPromoCompra;
	}

	public function setIdPromoCompra($idPromoCompra){
		$this->idPromoCompra = $idPromoCompra;
	}

	public function getIdPromo(){
		return $this->idPromo;
	}

	public function setIdPromo($idPromo){
		$this->idPromo = $idPromo;
	}

	public function getRollsCompra(){
		return $this->rollsCompra;
	}

	public function setRollsCompra($rollsCompra){
		$this->rollsCompra = $rollsCompra;
    }

    public function getIdAgregados(){
		return $this->idAgregados;
	}

	public function setIdAgregados($idAgregados){
		$this->idAgregados = $idAgregados;
    }
    
    public function ingresarPromoCompra($correo){
        try{
            $errorFor = 0;
            $null = null;
            $db = connection::getInstance();
            $conn = $db->getConnection();
            mysqli_autocommit($conn, FALSE);
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL agregarPromoCompra(?, ?)');
            $stmt->bind_param("is", $this->getIdPromo(), $correo);
            if($stmt->execute()){
                $arrayRolls = $this->getRollsCompra();
                foreach ($arrayRolls as $key=>$valor) {
                    // *Se crea y agrega un nuevo roll creado en la tabla detalle promo compra
                    $stmt2 = $conn->prepare('call agregarRollCompraYDetallePromoCompra(?)');
                    $stmt2->bind_param("i", $valor->arrayRoll[0]);
                    if($stmt2->execute()){
                        // foreach ($valor->arrayRoll as $key=>$i) {
                            // *Se agregan las coberturas al detalle del roll en las coberturas
                            foreach ($valor->arrayRoll[1]->Coberturas as $valor2) {
                                $stmt3 = $conn->prepare('call agregarDetalleRollsCompraCoberturas(?)');
                                $stmt3->bind_param('i', $valor2->Id);
                                $stmt3->execute();
                                $stmt3->free_result();
                            }
                            // *Se agregan los rellenos al detalle del roll compra
                            foreach ($valor->arrayRoll[2]->Rellenos as $valor3) {
                                $stmt4 = $conn->prepare('call agregarDetalleRollsCompraRellenos(?)');
                                $stmt4->bind_param('i', $valor3->Id);
                                $stmt4->execute();
                                $stmt4->free_result();
                            // }
                        }
                        $errorFor = 1;
                    }else {
                        $conn->rollback();
                    }
                    $stmt2->free_result();
                }
            }

            $conn->commit();
            // !Probar al quitar el commit
            if($errorFor == 0){
                $conn->rollback();
                echo '2';
                // *No se ejecutaron todas las tareas
            }else{
                $conn->commit();
                echo '1';
                // *Se ejecutaron las tareas correctamente
            }

            $stmt->free_result();
            // ?Se ingresa el roll y su detalle y dentro del mismo procedimiento se ingresa a la tabla detalle de la promo compra
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function ingresarAgregadoCarrito($correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL agregarAgregadoCarrito(?, ?)');
            $stmt->bind_param("is", $this->getIdAgregados(), $correo);
            if($stmt->execute()){
                return 1;
                // *El item se agregó correctamente en la BD
            }else{
                return 2;
                // *Error al ejecutar la tarea
            }
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function eliminarAgregadoCarrito($id, $correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL eliminarAgregadoCarrito(?, ?)');
            $stmt->bind_param("is", $id, $correo);
            if($stmt->execute()){
                return 1;
                // *El item se eliminó de la BD
            }else{
                return 2;
                // *Error al ejecutar la tarea
            }
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function eliminarPromoCarrito($id, $correo){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL eliminarPromoCarrito(?, ?)');
            $stmt->bind_param("is", $id, $correo);
            if($stmt->execute()){
                return 1;
                // *La promo se eliminó del carrito
            }else{
                return 2;
                // *Error de ejecución
            }
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    public function ingresarPromoCompraChef($correo){
        try{
            $errorFor = 0;
            $db = connection::getInstance();
            $conn = $db->getConnection();
            mysqli_autocommit($conn, FALSE);
            //*Se prepara el procedimiento almacenado
            $stmt = $conn->prepare('CALL agregarPromoCompra(?, ?)');
            $stmt->bind_param("is", $this->getIdPromo(), $correo);
            if($stmt->execute()){
                $arrayRolls = $this->getRollsCompra();
                foreach ($arrayRolls as $key=>$valor) {
                    // *Se crea y agrega un nuevo roll creado en la tabla detalle promo compra
                    $stmt2 = $conn->prepare('call agregarRollCompraYDetallePromoCompra(?)');
                    $stmt2->bind_param("i", $valor->Cantidad);
                    if($stmt2->execute()){
                        // *Se agregan las coberturas al detalle del roll en las coberturas
                        $stmt3 = $conn->prepare('call agregarDetalleRollsCompraCoberturas(?)');
                        $stmt3->bind_param('i', $valor->IdCobertura);
                        if($stmt3->execute()){
                            // $stmt3->free_result();
                             // *Se agregan los rellenos al detalle del roll compra
                            for ($i = 1; $i <= 2; $i++) {
                                $stmt4 = $conn->prepare('call agregarRellenosRandomDetalleRollsCompra()');
                                if($stmt4->execute()){
                                    $errorFor = 1;
                                    $stmt4->free_result();
                                }else {
                                    $errorFor = 0;
                                }
                            }
                            $stmt3->free_result();
                        }else{
                            $errorFor = 0;
                        }
                    }else {
                        $conn->rollback();
                    }
                    $stmt2->free_result();
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
            // ?Se ingresa el roll y su detalle y dentro del mismo procedimiento se ingresa a la tabla detalle de la promo compra
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }

    // *Se cargan las coberturas de los tipos de cobertura que tengan solo una opción
    // *Estas luego se añadirán al momento de crear un roll para la promo compra
    public function cargarCoberturasPromoUnaOpcion(){
        try{
            $db = connection::getInstance();
            $conn = $db->getConnection();
            //*Se prepara el procedimiento almacenado
            $stmt=$conn->prepare('call obtenerCoberturasPromoChefUnaOpcion(?)');
            $stmt->bind_param('i', $this->getIdPromo());
            //* Se ejecuta
            $stmt->execute();
            //* Resultados obtenidos de la consulta
            $stmt->bind_result($id, $cantidad, $idCobertura);
            $datos = array();
                while($stmt->fetch()){
                    $datos[]=array(
                        "IdTipoCobertura"=>$id,
                        "Cantidad"=>$cantidad,
                        "IdCobertura"=>$idCobertura
                    );
                }
                return json_encode($datos, JSON_UNESCAPED_UNICODE);
                $stmt->free_result();
        }catch(Exception $error){
            echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
        }
    }
}