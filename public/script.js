    document.addEventListener("DOMContentLoaded", function() {
    var navbar = document.querySelector('.nav');
  
    window.onscroll = function() {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navbar.style.backgroundColor = "#1c1d1f"; /* Change the background color on scroll */
      } else {
        navbar.style.backgroundColor = "transparent"; /* Revert to the initial color when not scrolled */
      }

      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        nav.style.backgroundColor = "#1c1d1f"; /* Change the background color on scroll */
      } else {
        nav.style.backgroundColor = ""; /* Revert to the initial color when not scrolled */
      }
    };
  });



  const tasks = document.querySelectorAll('.tasks');
  let taskquantity = Object.keys(tasks).length;
  function alternateColor() {
    for(let i = 0; i<taskquantity; i++){
      if(i%2 != 0) {
        tasks[i].style.backgroundColor = "#18191a";
      }
      else {
        tasks[i].style.backgroundColor = "transparent";
      }
    }
  }
  alternateColor();