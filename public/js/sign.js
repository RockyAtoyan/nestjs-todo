const swiper = new Swiper('.sign_swiper', {
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },

  // Optional parameters
  loop: true,

  autoplay: {
    delay: 1500,
  },

  speed: 1000,

  // If we need pagination
  // pagination: {
  //   el: '.swiper-pagination',
  // },

  // Navigation arrows
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev',
  // },

  // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
});

const fileInput = document.getElementById('sign_file');

if (fileInput) {
  fileInput.addEventListener('change', (ev) => {
    const file = ev.currentTarget.files[0];
    if (!file) return;
    document.getElementById('sign_file__name').style.marginLeft = '15px';
    document.getElementById('sign_file__name').innerText = `${file.name}`;
  });
}
