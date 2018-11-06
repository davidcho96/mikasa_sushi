<?php

require '../db_connection/connection.php';

class ImagenesIndex extends connection{
    private $idImagen;
    private $imgUrl;

    public function getIdImagen(){
		return $this->idImagen;
	}

	public function setIdImagen($idImagen){
		$this->idImagen = $idImagen;
	}

	public function getImgUrl(){
		return $this->imgUrl;
	}

	public function setImgUrl($imgUrl){
		$this->imgUrl = $imgUrl;
    }
    
    public function cargarImagenesIndex(){
        try{
			$db = connection::getInstance();
			$conn = $db->getConnection();
			// *Prepara la query
			$stmt=$conn->prepare('call obtenerUrlImagenes()');
			//*Se ejecuta la consulta en BD
			$stmt->execute();
			//*Se obtiene el resultado
			$stmt->bind_result($idImagen, $imgUrl);
			$datos = array();
			// if($stmt->fetch()>0){
				while($stmt->fetch()){
					$datos[]=array(
						"ImgUrl"=>$imgUrl
					);
				}
				// }else{
					// return 'error';
					// }
			return json_encode($datos);
			$stmt->free_result();
		}catch(Exception $error){
			echo 'Ha ocurrido una excepción: ', $error->getMessage(), "\n";
		}
    }
}