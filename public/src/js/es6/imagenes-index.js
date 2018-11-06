function cargarImagenesIndex() {
  var action = 'CargarImagenesIndex';
  //   var cargaHtml = '';
  $.ajax({
    data: `action=${action}`,
    url: '../app/control/despImagenesIndex.php',
    type: 'POST',
    success: function(respuesta) {
      var arr = JSON.parse(respuesta);
      console.log(arr);
      switch (respuesta) {
        case 'error':
          break;
        default:
          var cargaHtmlUno = `
              <img src="dist/img/${arr[0].ImgUrl}" class="img-slider">
              <!-- random image -->
              <div class="caption center-align">
              <h2>This is our big Tagline!</h2>
              <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
              </div>`;
          var cargaHtmlDos = `
              <img src="dist/img/${arr[1].ImgUrl}" class="img-slider">
              <!-- random image -->
              <div class="caption left-align">
                <h3>Left Aligned Caption</h3>
                <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
            </div>`;
          var cargaHtmlTres = `
              <img src="dist/img/${arr[2].ImgUrl}" class="img-slider">
              <!-- random image -->
              <div class="caption right-align">
              <h3>Right Aligned Caption</h3>
              <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
                </div>`;
          //   console.log(cargaHtml);
          $('#img_uno_index').html(cargaHtmlUno);
          $('#img_dos_index').html(cargaHtmlDos);
          $('#img_tres_index').html(cargaHtmlTres);
          break;
      }
    }
  });
}
