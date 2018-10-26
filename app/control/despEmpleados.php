<?php

require_once "../clases/empleado.php"; //*Clase empleado
require_once "../clases/inputValidate.php"; //*Clase Input para validación de campos

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') { //*Se valida que el método de solicitud sea 'POST'
    $validate = new Input();
    //*Se instancia la clase para la validación de campos

    $empleado = new Empleado();

        switch($_REQUEST['action']){//*Comprueba que campos no estén vacíos
            case 'LoginEmpleado':
                if($validate->check(['txt_email', 'txt_password'], $_REQUEST)){
                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '100', '1');
                    //*Recibe la acción a ejecutar

                    //*Setea parámetros en la clase empleado
                    $empleado->setCorreo($correo);
                    $empleado->setPassword($password);

                    switch($empleado->login()){
                        case '1':
                            echo '1'; 
                            $array_session = array('admin', $empleado->getCorreo());
                            //* Registro exitoso
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = $array_session;
                            }
                        break;
                        case '2':
                            echo '2'; 
                            $array_session = array('repartidor', $empleado->getCorreo());
                            if(!isset($_SESSION['user']) || $_SESSION['user'] == ''){
                                $_SESSION['user'] = $array_session;
                            }
                        break;
                        case 'error':
                            echo 'error';
                        break;
                        case 'errorEstado':
                            echo 'errorEstado';
                        break;
                    }
                }
            break;
            // funcion para el registro del mantenedor empleado
            case 'RegistroEmpleado':
                if($validate->check(['txt_nombre', 'txt_apellidos', 'txt_email', 'txt_password','combo_TipoEmpleado'], $_REQUEST)){
                    
                    $nombre = $validate->str($_POST['txt_nombre'], '45', '3');
                    //*Llama al método str, y pasa parámetros (*campo, *maxLength, *minLength)

                    $apellidos=$validate->str($_POST['txt_apellidos'], '45', '3');


                    $correo=$validate->email($_POST['txt_email']);
                    //*El método email solo valida que el formato del campo sea email

                    $password= $validate->pass($_POST['txt_password'], '100', '10');
                    $combo_TipoEmpleado = $validate->int($_POST['combo_TipoEmpleado']);
                    //*Recibe la acción a ejecutar

                    //*Setea parámetros en la clase Cliente
                    $empleado->setIdTipoEmpleado($combo_TipoEmpleado);
                    $empleado->setPassword($password);
                    $empleado->setCorreo($correo);
                    $empleado->setNombre($nombre);
                    $empleado->setApellidos($apellidos);

                    $empleado->IngresaEmpleado();
                }else{
                    echo '2';
                }
            break;
            // ----------------------------------------------------------------
            // Funcion para cargar las tablas con los datos de los empleados
            case 'CargarTablaEmpleados':
                    echo $empleado->cargarTablaEmpleados();
                break;
            // la funcion nos permite eliminar un registro de la tabla
            case 'EliminarEmpleado':
                    $empleado->setIdEmpleado($_POST['id']);
                    echo $empleado->eliminaEmpleado($_SESSION['user'][1]);
                break;
            // Carga los datos del empleado al modal, para luego actualizar
            case 'cargaModalEmpleado':
                    $empleado->setIdEmpleado($_POST['id']);
                    echo $empleado->cargaCliente($_REQUEST['id']);
            break;
            // funcion para actualizar los empleado a través del modal
            case 'ActualizaEmpleados':
                $id = $_POST['id'];
                $empleado->setIdEmpleado($id);
                $empleado->setNombre($_POST['nombre']);
                $empleado->setApellidos($_POST['apellidos']);
                $empleado->setCorreo($_POST['email']);
                $empleado->setIdEstado($_POST['idEstado']);
                $empleado->setIdTipoEmpleado($_POST['idTipoEmp']);
                echo $empleado->ActualizaEmpleado($_SESSION['user'][1]);
                break;
        }
}