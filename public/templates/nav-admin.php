<?php session_start(); ?>
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
            <a href="">
                <i class="material-icons">attach_money</i>
                Ventas
            </a>
        </li>
        <li>
            <a href="">
                <i class="material-icons">motorcycle</i>
                Pedidos
            </a>
        </li>
        <div class="divider"></div>
        <li>
            <a href="" class="subheader">Gestión</a>
        </li>
        <li>
            <a href="#!">
                <i class="material-icons">supervised_user_circle</i>
                Usuarios
            </a>
        </li>
        <li>
            <a href="mantenedor-clientes.php">
                <i class="material-icons">supervised_user_circle</i>
                Clientes
            </a>
        </li>
        <li>
            <a href="#!">
                <i class="material-icons">fastfood</i>
                Carta
            </a>
        </li>
        <li>
            <a href="">
                <i class="material-icons">poll</i>
                Encuestas
            </a>
        </li>
        <li>
            <ul class="collapsible collapsible-accordion">
                <li>
                    <a class="collapsible-header">Dropdown
                        <i class="material-icons">label</i>
                        <i class="material-icons right">arrow_drop_down</i>
                    </a>
                    <div class="collapsible-body">
                        <ul>
                            <li>
                                <a href="#!">First</a>
                            </li>
                            <li>
                                <a href="#!">Second</a>
                            </li>
                            <li>
                                <a href="#!">Third</a>
                            </li>
                            <li>
                                <a href="#!">Fourth</a>
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
            <a href="!#">
                <i class="material-icons">power_settings_new</i>
                Salir
            </a>
        </li>
    </ul>
    <a href="#" data-target="slide-out" class="sidenav-trigger">
        <i class="material-icons">menu</i>
    </a>