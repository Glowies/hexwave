
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="author" content="Oktay Comu">
    <meta name="description" content="Wave simulation on a hexagonal grid.">
    <link rel="shortcut icon" href="../assets/boo_icon.png">

    <title>Glowies - Hexwave</title>

    <!-- IMPORTS -->
    <link href="node_modules/bootswatch/dist/minty/bootstrap.min.css" rel="stylesheet">


    <!-- TODO: REPLACE
    <?php include_once('../headImport.php'); ?>
    -->
</head>

<body role="document" style="background-color: black; height:100%; -moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none; -o-user-select:none;">
    <!-- TODO: REPLACE
    <?php include_once('../navbar.php'); ?>
    -->
    <nav id="navbar" class="navbar navbar-expand-lg navbar-dark bg-dark" role="navigation" style="z-index:10; -moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none; -o-user-select:none;">
        <a class="navbar-brand" href="../main">glowies</a>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <!-- NAVBAR ITEMS START -->
            <ul class="navbar-nav">

                <li class="nav-item">
                    <a class="nav-link" href="../main">main</a>
                </li>

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="gameDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      games
                    </a>
                    <div class="dropdown-menu" aria-labelledby="gameDropdown">
                        <a class="dropdown-item" href="../pongsingle">singleplayer pong</a>
                        <a class="dropdown-item" href="../boo">boo chase</a>
                        <a class="dropdown-item" href="../tron">tron</a>
                        <a class="dropdown-item" href="../swiftSnake">swift snake</a>
                        <a class="dropdown-item" href="../quoridor">quoridor</a>
                    </div>
                </li>

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="simDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      simulations
                    </a>
                    <div class="dropdown-menu" aria-labelledby="simDropdown">
                        <a class="dropdown-item" href="../ant">Langton's Ant</a>
                        <a class="dropdown-item" href="../leaptest">leap bones</a>
                        <a class="dropdown-item" href="../fractal">fractal creator</a>
                    </div>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="../about">author</a>
                </li>

            </ul>
            <!-- NAVBAR ITEMS END -->

            <ul class="navbar-nav ml-auto">
                <a type="button" class="btn btn-primary navbar-btn ml-auto" href="https://chrome.google.com/webstore/detail/swift-snake-3d-popup/lencaglpgihlglecbdkfhelldkbdholc" onclick="this.blur();" id="install-button">try swift snake &nbsp; <img src='../assets/chromestore.png' style="height:22px"></a>
            </ul>
        </div>
    </nav>
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-81824321-1', 'auto');
        ga('send', 'pageview');
    </script>


    <br/>


    <canvas id="renderCanvas" touch-action="none" style="position:fixed;top:0px;width: 100%; height: 100%;"></canvas>


    <!-- MAIN -->
    <script src="./dist/main.js"></script>
</body>
</html>
