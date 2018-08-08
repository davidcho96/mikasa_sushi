$(document).ready(function () {
    // Activa sidenav en el index
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.scrollspy').scrollSpy();
    $('.modal').modal();
    $('.collapsible').collapsible();
    $('.tabs').tabs();
    $('.carousel').carousel({
        fullWidth: true,
        indicators: true
    });
    setInterval(() => {
        $('.carousel').carousel('next');
    }, 4000);
});

// autoplay()

// function autoplay() {
//     $('.carousel').carousel('next');
//     setTimeout(autoplay, 4500);
// }

// CAROUSEL
// $(document).ready(function () {
//     $('.carousel.carousel-slider').carousel({
//         dist: 0,
//         padding: 0,
//         fullWidth: true,
//         indicators: true,
//         duration: 100,
//     });
// });
// $('.hola').click(function () {
//     $('.carousel.carousel-slider').carousel().next();
// });

// function autoplay() {
//     $('.carousel').carousel('next');
//     setTimeout(autoplay, 4500);
// }

// let autoplay = () => {
//     setTimeout(autoplay, 4000);
// }
// autoplay();