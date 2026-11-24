"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    // Helper to check if element is already in viewport
    const isInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) + 40 &&
        rect.bottom > -40
      );
    };

    // Observer for main sections & section dividers
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    const sections = document.querySelectorAll(
      "#hero, #success, #engagement, #clients, #topstack, #about, #values, #accelerators, #newsBlog, #contact, .section-divider"
    );

    sections.forEach((sec) => {
      sec.classList.add("scroll-reveal");
      if (isInViewport(sec)) {
        sec.classList.add("revealed");
      } else {
        sectionObserver.observe(sec);
      }
    });

    // Observer for staggered card reveals appearing from bottom-to-top
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            cardObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
      }
    );

    const observeCards = () => {
      const cards = document.querySelectorAll(".card-reveal:not(.revealed)");
      cards.forEach((card) => {
        if (isInViewport(card)) {
          card.classList.add("revealed");
        } else {
          cardObserver.observe(card);
        }
      });
    };

    observeCards();

    // MutationObserver to auto-observe newly mounted cards (e.g. on search or tab filter changes)
    const mutationObserver = new MutationObserver(() => {
      observeCards();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Global Smooth Scroll Handling for Anchor Links on Homepage
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href*="#"]');
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Extract hash
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      const hash = href.slice(hashIndex);
      const targetId = hash.replace("#", "").split("?")[0];
      if (!targetId) return;

      const isCurrentPage =
        href.startsWith("#") ||
        href.startsWith("/#") ||
        (typeof window !== "undefined" && href.startsWith(window.location.pathname + "#"));

      if (isCurrentPage) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          window.history.pushState(null, "", hash);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      sectionObserver.disconnect();
      cardObserver.disconnect();
      mutationObserver.disconnect();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return null;
}
