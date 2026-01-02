const ClinicMaster = (function () {
  "use strict";

  const handleSetCurrentYear = () => {
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let elements = document.getElementsByClassName("current-year");

    for (const element of elements) {
      element.innerHTML = currentYear;
    }
  };

  const handleBoxHover = () => {
    const wrappers = document.querySelectorAll(".box-hover-wrapper");
    if (!wrappers.length) return;

    const onHover = (e) => {
      const wrapper = e.currentTarget;
      const card = e.target.closest(".box-hover");
      if (!card || !wrapper.contains(card)) return;

      wrapper
        .querySelectorAll(".box-hover.active")
        .forEach((c) => c.classList.remove("active"));

      card.classList.add("active");
    };

    wrappers.forEach((wrapper) => {
      wrapper.removeEventListener("mouseover", onHover);
      wrapper.addEventListener("mouseover", onHover);
    });

    return () => {
      wrappers.forEach((wrapper) => {
        wrapper.removeEventListener("mouseover", onHover);
      });
    };
  };

  const handleNavScroller = () => {
    let previousScroll = 0;

    const onScroll = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 768) return;

      const body = document.body;
      const extraNav = document.querySelector(".extra-nav");
      if (!extraNav) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const innerHeight = window.innerHeight;
      const scrollHeight = body.scrollHeight;

      if (scrollTop + innerHeight >= scrollHeight) {
        extraNav.classList.add("bottom-end");
      } else {
        extraNav.classList.remove("bottom-end");
      }

      if (scrollTop > previousScroll) {
        extraNav.classList.add("active");
      } else {
        extraNav.classList.remove("active");
      }

      previousScroll = scrollTop;
    };

    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll);

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  };

  const handleAccordion = (container = document) => {
    const accordionContainers = container.querySelectorAll(".myAccordion");

    accordionContainers.forEach((accordion) => {
      if (accordion.dataset.bound === "true") return;
      accordion.dataset.bound = "true";

      accordion.addEventListener("click", function (e) {
        const header = e.target.closest(".accordion-header");
        if (!header || !accordion.contains(header)) return;

        const item = header.parentElement;
        const content = item.querySelector(".accordion-content");
        const arrow = header.querySelector(".arrow");
        const isOpen = header.classList.contains("open");

        accordion.querySelectorAll(".accordion-header").forEach((h) => {
          if (h !== header) {
            h.classList.remove("open");
            h.querySelector(".arrow")?.classList.remove("active");
            const c = h.parentElement.querySelector(".accordion-content");
            if (c) c.style.maxHeight = null;
          }
        });

        if (!isOpen) {
          header.classList.add("open");
          content.style.maxHeight = content.scrollHeight + "px";
          arrow?.classList.add("active");
        } else {
          header.classList.remove("open");
          content.style.maxHeight = null;
          arrow?.classList.remove("active");
        }
      });
    });

    container.querySelectorAll(".accordion-header.open").forEach((header) => {
      const content = header.parentElement.querySelector(".accordion-content");
      const arrow = header.querySelector(".arrow");
      if (content) {
        content.style.maxHeight = content.scrollHeight + "px";
        arrow?.classList.add("active");
      }
    });
  };

  const handleVideoPopupJS = () => {
    const dialog = document.getElementById("videoDialog");
    const container = document.getElementById("videoContainer");
    const closeBtn = document.getElementById("closeBtn");
    const videoWrapper = document.body;

    if (!dialog || !container || !closeBtn) return;

    const allowedDomains = ["youtube.com", "youtu.be", "vimeo.com"];

    const isAllowedDomain = (url) => {
      try {
        const parsed = new URL(url);
        return allowedDomains.some((domain) =>
          parsed.hostname.includes(domain)
        );
      } catch {
        return false;
      }
    };

    const onOpenVideo = (e) => {
      const button = e.target.closest("button[data-type]");
      if (!button) return;

      const type = button.getAttribute("data-type");
      const src = button.getAttribute("data-src");

      if (!type || !src) return;

      openVideo(type, src);
    };

    const openVideo = (type, src) => {
      container.innerHTML = "";

      if (type === "youtube" || type === "vimeo") {
        if (!isAllowedDomain(src)) {
          console.warn("Blocked non-whitelisted video source:", src);
          return;
        }

        const iframe = document.createElement("iframe");
        iframe.src = `${src}?autoplay=1`;
        iframe.allow = "autoplay; encrypted-media; fullscreen";
        iframe.allowFullscreen = true;

        container.appendChild(iframe);
      } else if (type === "mp4") {
        const video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;

        const source = document.createElement("source");
        source.src = src;
        source.type = "video/mp4";

        video.appendChild(source);
        container.appendChild(video);
      }

      dialog.style.display = "flex";
    };

    const closeVideo = () => {
      container.innerHTML = "";
      dialog.style.display = "none";
    };

    videoWrapper.addEventListener("click", onOpenVideo);
    closeBtn.addEventListener("click", closeVideo);

    return () => {
      videoWrapper.removeEventListener("click", onOpenVideo);
      closeBtn.removeEventListener("click", closeVideo);
    };
  };

  const handleTabs = () => {
    const tabContainers = document.querySelectorAll(".custom-tab");
    if (!tabContainers.length) return;

    const cleanupHandlers = [];

    tabContainers.forEach((container) => {
      const titles = container.querySelectorAll(".tab-title");
      const contents = container.querySelectorAll(".tab-content");

      if (!titles.length || !contents.length) return;

      titles[0].classList.add("active");
      contents[0].classList.add("active");
      handleAccordion(contents[0]);

      const onTabClick = (e) => {
        const clicked = e.target.closest(".tab-title");
        if (!clicked || !container.contains(clicked)) return;

        titles.forEach((t, i) => {
          const isActive = t === clicked;
          t.classList.toggle("active", isActive);
          contents[i].classList.toggle("active", isActive);

          if (isActive) handleAccordion(contents[i]);
        });
      };

      container.removeEventListener("click", onTabClick);
      container.addEventListener("click", onTabClick);

      cleanupHandlers.push(() => {
        container.removeEventListener("click", onTabClick);
      });
    });

    return () => cleanupHandlers.forEach((cleanup) => cleanup());
  };

  const handleCountdown = () => {
    const counter = document.querySelector("#countdown");
    if (!counter) return;

    const countDownClock = (number = 100, format = "seconds") => {
      const d = document;
      const daysElement = d.querySelector("#countdown .days");
      const hoursElement = d.querySelector("#countdown .hours");
      const minutesElement = d.querySelector("#countdown .minutes");
      const secondsElement = d.querySelector("#countdown .seconds");
      let countdown;
      convertFormat(format);

      function convertFormat(format) {
        switch (format) {
          case "seconds":
            return timer(number);
          case "minutes":
            return timer(number * 60);
          case "hours":
            return timer(number * 60 * 60);
          case "days":
            return timer(number * 60 * 60 * 24);
        }
      }

      function timer(seconds) {
        const now = Date.now();
        const then = now + seconds * 1000;

        countdown = setInterval(() => {
          const secondsLeft = Math.round((then - Date.now()) / 1000);

          if (secondsLeft <= 0) {
            clearInterval(countdown);
            return;
          }

          displayTimeLeft(secondsLeft);
        }, 1000);
      }

      function displayTimeLeft(seconds) {
        daysElement.textContent = Math.floor(seconds / 86400);
        hoursElement.textContent = Math.floor((seconds % 86400) / 3600);
        minutesElement.textContent = Math.floor(
          ((seconds % 86400) % 3600) / 60
        );
        secondsElement.textContent =
          seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
      }
    };
    countDownClock(20, "days");
  };

  return {
    init() {
      handleSetCurrentYear();
      handleBoxHover();
      handleNavScroller();
      handleAccordion();
      handleVideoPopupJS();
      handleTabs();
      handleCountdown();
    },

    load() { },

    resize() { },
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  ClinicMaster.init();
});

window.addEventListener("load", function () {
  ClinicMaster.load();
  const dzPreloader = document.getElementById("dzPreloader");
  setTimeout(function () {
    if (dzPreloader) {
      dzPreloader.remove();
    }
  }, 1000);
  document.body.addEventListener("keydown", function () {
    document.body.classList.add("show-focus-outline");
  });
  document.body.addEventListener("mousedown", function () {
    document.body.classList.remove("show-focus-outline");
  });
});

window.addEventListener("resize", function () {
  ClinicMaster.resize();
});
