$(document).ready(function () {
    // Activa sidenav en el index
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.scrollspy').scrollSpy();
    $('.modal').modal();
    $('.collapsible').collapsible();
    $('.tabs').tabs();
    $(document).ready(function () {
        $('.slider').slider();

    });
});

$('.rigth-arrow-slider').click(() => {
    $('.slider').slider('next');
});

$('.left-arrow-slider').click(() => {
    $('.slider').slider('prev');
});