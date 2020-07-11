const navSlide = () => {
    const slider = document.querySelector('#slider');
    const navbar = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    slider.addEventListener('click', () => {
        navbar.classList.toggle('nav-active');

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            }else{
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
        })

        slider.classList.toggle('slider-animation')
    })
}

navSlide();