
<ul id="slide-out" class="sidenav">
        <li>
            <div class="user-view background red">
                <div class="col s6 m6 l6">
                    <a href="#user">
                        <img class="circle" src="http://img.stomp.com.sg/s3fs-public/avatar_ck.png">
                    </a>
                    <a href="#name" class="white-text">
                        <?php echo $_SESSION['user'][1] ?>
                    </a>
                </div>
            </div>
        </li>
        <li>
            <a href="#!">
                <i class="material-icons">compare_arrows</i>
                Generar Venta
            </a>
        </li>
        <li>
            <ul class="collapsible collapsible-accordion">
                <li>
                    <a class="collapsible-header">Ventas
                        <i class="material-icons">attach_money</i>
                        <i class="material-icons right">arrow_drop_down</i>
                    </a>
                    <div class="collapsible-body">
                        <ul>
                            <li>
                                <a href="ventas-pendientes.php">Ventas pendientes</a>
                            </li>
                            <li>
                                <a href="ventas-canceladas.php">Ventas canceladas</a>
                            </li>
                            <li>
                                <a href="historial-ventas.php">Historial de ventas</a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
            <!-- <a href="ventas-mikasa.php">
                <i class="material-icons">attach_money</i>
                Ventas
            </a> -->
        </li>
        <li>
            <ul class="collapsible collapsible-accordion">
                <li>
                    <a class="collapsible-header">Entregas
                        <i class="material-icons">motorcycle</i>
                        <i class="material-icons right">arrow_drop_down</i>
                    </a>
                    <div class="collapsible-body">
                        <ul>
                            <li>
                                <a href="entregas-pendientes.php">Entregas pendientes</a>
                            </li>
                            <li>
                                <a href="entregas-realizadas.php">Entregas realizadas</a>
                            </li>
                            <li>
                                <a href="entregas-canceladas.php">Entregas canceladas</a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </li>
        <div class="divider"></div>
        <li>
            <a href="" class="subheader">Gestión</a>
        </li>
        <li>
            <a href="mantenedor-empleado.php">
                <i class="material-icons">supervisor_account</i>
                Empleados
            </a>
        </li>
        <li>
            <a href="mantenedor-clientes.php">
                <i class="material-icons">supervised_user_circle</i>
                Clientes
            </a>
        </li>
        <li>
        <!-- <li>
            <a href="">
                <i class="material-icons">poll</i>
                Encuestas
            </a>
        </li> -->
        <li>
            <a href="mantenedor-horarios.php">
            <i class="material-icons">calendar_today</i>
                Feriados
            </a>
        </li>
        <li>
            <a href="mantenedor-infoContacto.php">
            <i class="material-icons">contact_phone</i>
                Información empresa
            </a>
        </li>
        <li>
            <ul class="collapsible collapsible-accordion">
                <li>
                    <a class="collapsible-header">Carta
                        <i class="material-icons">fastfood</i>
                        <i class="material-icons right">arrow_drop_down</i>
                    </a>
                    <div class="collapsible-body">
                        <ul>
                            <li>
                                <a href="mantenedor-ingredientes.php">Ingredientes</a>
                            </li>
                            <li>
                                <a href="mantenedor-agregadosM.php">Agregados</a>
                            </li>
                            <li>
                                <a href="mantenedor-coberturasM.php">Coberturas</a>
                            </li>
                            <li>
                                <a href="mantenedor-rellenosM.php">Rellenos</a>
                            </li>
                            <li>
                                <a href="mantenedor-promosM.php">Promos</a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </li>
        <li>
            <ul class="collapsible collapsible-accordion">
                <li>
                    <a class="collapsible-header">Opciones de venta
                        <i class="material-icons">shopping_basket</i>
                        <i class="material-icons right">arrow_drop_down</i>
                    </a>
                    <div class="collapsible-body">
                        <ul>
                            <li>
                                <a href="mantenedor-tipo-pago.php">Tipo Pago</a>
                            </li>
                            <li>
                                <a href="mantenedor-tipo-cobertura.php">Tipo Cobertura</a>
                            </li>
                            <li>
                                <a href="mantenedor-tipo-promo.php">Tipo Promo</a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </li>
        <div class="divider"></div>
        <li>
            <a href="" class="subheader">Cuenta</a>
        </li>
        <li>
            <a href="#!">
                <i class="material-icons">edit</i>
                Editar perfil
            </a>
        </li>
        <li>
            <a href="templates/killSession.php" id='cerrar_sesion'>
                <i class="material-icons">power_settings_new</i>
                Salir
            </a>
        </li>
    </ul>
    <div class="nav-menu-admin">
        <a href="#" data-target="slide-out" class="sidenav-trigger">
            <i class="material-icons black-text">menu</i>
        </a>
        <div>
            <a href="index-admin.php" class="brand-logo">
                <img src="dist/img/logo.png" alt="" class="nav-image-no-circle">
            </a>
        </div>
        <div>
            <a href="#" id="notificaciones_admin">
                <i class="material-icons black-text">notifications</i>
            </a>
        </div>
    </div>
    <div class="content-notificaciones" id="notificaciones_content">
        <span class="triangulo-content">▲</span>
        <div class="content-principal">
            <div id="carga_notificaciones" style="overflow-y:auto; height: 96%;" class="collection"></div>
        </div>
    </div>