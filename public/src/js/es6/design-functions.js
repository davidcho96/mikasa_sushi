$(document).ready(function() {
  // *Activa sidenav
  $('.sidenav').sidenav();
  // *Activa parallax
  $('.parallax').parallax();
  // *Activa función de scrollspy
  $('.scrollspy').scrollSpy();
  // *Activa modal
  $('.modal').modal();
  // *Activa collapsible
  $('.collapsible').collapsible();
  // *Activa dropdown en li nav
  $('.dropdown-trigger').dropdown();
  // *Activa tabs
  $('.tabs').tabs();
  //* Activa slider
  $('.slider').slider();
  $('.dropdown-trigger').dropdown();
});

// * Activa funciones de cambios de slide en slider de index
$('.rigth-arrow-slider').click(() => {
  $('.slider').slider('next');
});

$('.left-arrow-slider').click(() => {
  $('.slider').slider('prev');
});
// -----------
