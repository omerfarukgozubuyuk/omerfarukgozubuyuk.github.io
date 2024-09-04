

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function (e) {
    let section = select(this.hash)
    if (section) {
      e.preventDefault()

      let navbar = select('#navbar')
      let header = select('#header')
      let sections = select('section', true)
      let navlinks = select('#navbar .nav-link', true)

      navlinks.forEach((item) => {
        item.classList.remove('active')
      })

      this.classList.add('active')

      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }

      if (this.hash == '#header') {
        header.classList.remove('header-top')
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        return;
      }

      if (!header.classList.contains('header-top')) {
        header.classList.add('header-top')
        setTimeout(function () {
          sections.forEach((item) => {
            item.classList.remove('section-show')
          })
          section.classList.add('section-show')

        }, 350);
      } else {
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        section.classList.add('section-show')
      }

      scrollto(this.hash)
    }
  }, true)

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash)

      if (initial_nav) {
        let header = select('#header')
        let navlinks = select('#navbar .nav-link', true)

        header.classList.add('header-top')

        navlinks.forEach((item) => {
          if (item.getAttribute('href') == window.location.hash) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })

        setTimeout(function () {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function (direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  document.addEventListener('DOMContentLoaded', () => {
    const testimonialsSlider = document.querySelector('.testimonials-slider');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          swiper.autoplay.start();
        } else {
          swiper.autoplay.stop();
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(testimonialsSlider);

    // Swiper initialization
    const swiper = new Swiper('.testimonials-slider', {
      speed: 700,
      loop: true,
      autoplay: {
        delay: 20000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var portfolioContainer = document.querySelector('.portfolio-container');
    if (!portfolioContainer) {
      console.log('Portfolio container not found');
      return;
    }

    var lazyIframes = Array.from(portfolioContainer.querySelectorAll("iframe"));
    console.log('Found ' + lazyIframes.length + ' iframes');

    if ("IntersectionObserver" in window) {
      let lazyIframeObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            let lazyIframe = entry.target;
            if (lazyIframe.dataset.src) {
              lazyIframe.src = lazyIframe.dataset.src;
              console.log('Loading iframe: ' + lazyIframe.src);
              lazyIframe.removeAttribute('data-src');
            }
            observer.unobserve(lazyIframe);
          }
        });
      }, {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      });

      lazyIframes.forEach(function (lazyIframe) {
        if (lazyIframe.src) {
          lazyIframe.dataset.src = lazyIframe.src;
          lazyIframe.src = '';
          console.log('Prepared iframe for lazy loading: ' + lazyIframe.dataset.src);
        }
        lazyIframeObserver.observe(lazyIframe);
      });
    } else {
      console.log('IntersectionObserver not supported');
      // Fallback for browsers that don't support IntersectionObserver
      lazyIframes.forEach(function (lazyIframe) {
        if (lazyIframe.dataset.src) {
          lazyIframe.src = lazyIframe.dataset.src;
        }
      });
    }
  });

  // Function to manually trigger lazy loading
  function triggerLazyLoad() {
    var lazyIframes = document.querySelectorAll('.portfolio-container iframe[data-src]');
    lazyIframes.forEach(function (lazyIframe) {
      if (lazyIframe.dataset.src) {
        lazyIframe.src = lazyIframe.dataset.src;
        console.log('Manually loading iframe: ' + lazyIframe.src);
        lazyIframe.removeAttribute('data-src');
      }
    });
  }

  // Trigger lazy loading after a short delay
  setTimeout(triggerLazyLoad, 6000);

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  document.addEventListener('DOMContentLoaded', function () {
    new PureCounter();

    // Custom logic to change 1000000 to 1 Million
    var targetElement = document.getElementById('player-reach');
    var observer = new MutationObserver(function (mutationsList, observer) {
      for (var mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.target.textContent === "1000000") {
          mutation.target.textContent = "1 Million";
        }
      }
    });

    observer.observe(targetElement, { childList: true });
  });

})()

document.querySelectorAll(".open-iframe").forEach(function (element) {
  element.addEventListener("click", function (event) {
    event.preventDefault();

    var videoID = this.getAttribute("data-video-id");
    var container = this.closest('.image-container');

    var existingIframe = container.querySelector("iframe");
    if (existingIframe) {
      existingIframe.remove();
    }

    if (videoID) {
      // Create a new iframe
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + videoID + "?autoplay=1"; // Added autoplay parameter
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      iframe.style.width = "560px";
      iframe.style.height = "315px";
      iframe.style.display = "block";

      container.appendChild(iframe);

      var images = container.querySelectorAll("img");
      images.forEach(function (img) {
        img.style.display = "none";
      });
    }
  });
});
