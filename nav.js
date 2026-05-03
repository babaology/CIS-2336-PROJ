
document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    hamburgerBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
    });

});
