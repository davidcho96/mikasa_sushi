<?php
class connection{
    public $dbConnection;
    public function connect(){
        if(!isset($this->bdConnection)){
            $this->dbConnection = new mysqli("localhost","root","","bd_mikasa");
            // mysql_select_db("bd_prueba_mall", $this->dbConnection) or die ("Error ".mysql_error());
            // mysql_query("SET NAMES 'UTF8'");
        }
    }
    public function dbQuery($query){
        // $r=mysqli_prepare($this->dbConnection, $query);
        $result=mysqli_execute($query);
        if(!$result){
            echo 'Error Mysql: '.mysql_error();
            exit;
        }
        return $result;
    }
    public function row_number($result){
        return mysqli_num_rows($result);
    }
    public function fetch_array($result){
        return mysqli_fetch_array($result);
    }
    // public function closeConnection(){
    //     if(isset($this->dbConnection)){
    //         mysql_close($this->dbConnection);
    //     }else{
    //         echo 'No Connection';
    //     }
    // }
}
