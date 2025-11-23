const swiper = new Swiper('.testi-wrapper', {
    // Optional parameters
    loop: true,
    spaceBetween: 30,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints:{
        // 0:{
        //     slidePerView: 1
        // },
        // 768:{
        //     slidePerView: 2
        // },
        1024:{
            slidePerView: 3
        },
    }
});