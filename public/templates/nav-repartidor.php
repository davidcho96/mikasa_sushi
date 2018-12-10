<ul id="dropdown1" class="dropdown-content">
        <li><a href="#!" class="black-text"><i class="material-icons left">account_circle</i><?php echo $_SESSION['user'][1] ?></a></li>
        <li class="divider"></li>
        <li><a href="perfil-cliente.php" class="black-text"><i class="material-icons left">edit</i>Editar Perfil</a></li>
        <li class="divider"></li>
        <li><a href="templates/killSession.php" class="black-text"><i class="material-icons">power_settings_new</i>Cerrar sesión</a></li>
    </ul>
    <div class="navbar-fixed">
        <nav class="white">
            <div class="nav-wrapper">
                <div>
                    <a href="index-cliente.php" class="brand-logo">
                        <img src="dist/img/logo.png" alt="" class="nav-image-no-circle">
                    </a>
                </div>
                <a href="#" data-target="mobile-demo" class="sidenav-trigger black-text black-darken-4">
                    <i class="material-icons">menu</i>
                </a>
                <ul class="right hide-on-med-and-down nav-ul-options">
                    <li>
                        <a href="index-repartidor.php" class="black-text bottom-hover-nav">Inicio</a>
                    </li>
                    <li>
                        <a href="mis-entregas-realizadas.php" class="black-text bottom-hover-nav">Mis Entregas</a>
                    </li>
                    <li>
                        <a href="#" class="black-text bottom-hover-nav dropdown-trigger" data-target="dropdown1">Cuenta<i class="material-icons right">keyboard_arrow_down</i></a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    <!-- Sidenav para dispositivos móviles -->
    <div>
        <ul class="sidenav" id="mobile-demo">
            <li>
                <div class="user-view background-sidenav">
                    <img src="dist/img/m-logo.png" height="200px" width="100%">
                </div>
            </li>
            <li class="">
                <a href="index-repartidor.php" class="black-text">Inicio</a>
            </li>
            <li>
                <a href="mis-entregas-realizadas.php" class="black-text">Mis Entregas</a>
            </li>
            <!-- <li>
                <a href="#" class="black-text dropdown-trigger" data-target="dropdown1">Cuenta<i class="material-icons right">keyboard_arrow_down</i></a>
            </li> -->
            <li>
                <a href="perfil-cliente.php" class="black-text">Editar Perfil</a>
            </li>

            <li>
                <a href="templates/killSession.php" class="black-text">Cerrar sesión</a>
            </li>
        </ul>
    </div>