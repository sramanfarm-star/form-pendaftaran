const ClinicMasterCarousel = function () {
  const BlogSlideshowSwiper = () => {
    const swiperEl = document.querySelector(".blog-slideshow");
    if (!swiperEl) return;

    new Swiper(".blog-slideshow", {
      loop: true,
      spaceBetween: 0,
      slidesPerView: "auto",
      speed: 1500,
      autoplay: {
        delay: 2000,
      },
      pagination: {
        el: ".swiper-pagination-two",
        clickable: true,
      },
    });
  };

  if (
    document.querySelector(".galley-thumb-swiper") &&
    document.querySelector(".galley-swiper")
  ) {
    const swiperThumbs = new Swiper(".galley-thumb-swiper", {
      loop: false,
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    new Swiper(".galley-swiper", {
      loop: true,
      spaceBetween: 10,
      thumbs: {
        swiper: swiperThumbs,
      },
    });
  }

  const handleVerticalSwiper = () => {
    const blogVerticalSwiper = document.querySelector(".blog-vertical-swiper");

    if (blogVerticalSwiper) {
      const teamSwiperThumb = new Swiper(".blog-vertical-swiper-thumb", {
        direction: "vertical",
        slidesPerView: 3,
        mousewheel: false,
        spaceBetween: 10,
        autoplay: {
          delay: 3000,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            direction: "horizontal",
          },
          767: {
            slidesPerView: 2,
            direction: "vertical",
          },
          1191: {
            slidesPerView: 3,
          },
        },
      });

      new Swiper(".blog-vertical-swiper", {
        slidesPerView: 1,
        effect: "fade",
        grabCursor: true,
        thumbs: {
          swiper: teamSwiperThumb,
        },
        navigation: {
          nextEl: ".blog-swiper-next",
          prevEl: ".blog-swiper-prev",
        },
      });
    }
  };

const handleVerticalSwiper2 = function() {
  const swiperContainer = document.querySelector('.blog-vertical-swiper2');

  if (swiperContainer) {
    const teamSwiperThumb = new Swiper(".blog-vertical-swiper-thumb2", {
      direction: "vertical",
      slidesPerView: 3,
      mousewheel: false,
      spaceBetween: 10,
      // autoplay: {
      //   delay: 3000,
      // },
      breakpoints: {
        320: {
          slidesPerView: 1,
          direction: "horizontal",
        },
        767: {
          slidesPerView: 2,
          direction: "vertical",
        },
        1191: {
          slidesPerView: 3,
        },
      },
    });

    const teamSwiper = new Swiper(".blog-vertical-swiper2", {
      slidesPerView: 1,
      effect: "fade",
      grabCursor: true,
      thumbs: {
        swiper: teamSwiperThumb,
      },
      navigation: {
        nextEl: ".blog-swiper-next",
        prevEl: ".blog-swiper-prev",
      },
    });
  }
};

const handleTestimonialSwiper7 = function() {	
  const swiperContainer = document.querySelector('.testimonial-swiper7');

  if (swiperContainer) {
    const testimonialSwiper7 = new Swiper('.testimonial-swiper7', {
      loop: true,
      spaceBetween: 0,
      slidesPerView: 1,
      autoplay: {
        delay: 3000,
      },
      pagination: {
        el: ".testimonial-pagination-swiper7",
        clickable: true,
      },
    });
  }	
};



  return {
    load() {
      BlogSlideshowSwiper();
      handleVerticalSwiper();
      handleVerticalSwiper2();
      handleTestimonialSwiper7();
    },
  };
};

window.addEventListener("load", function () {
  ClinicMasterCarousel().load();
});
