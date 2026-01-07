import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const initParticles = () => {
      if (window.particlesJS && particlesRef.current) {
        window.particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#3B82F6" },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#3B82F6",
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" }
          }
        }
        });
      }
    };

    // Wait for particles.js to load
    if (window.particlesJS) {
      initParticles();
    } else {
      const checkParticles = setInterval(() => {
        if (window.particlesJS) {
          initParticles();
          clearInterval(checkParticles);
        }
      }, 100);

      return () => clearInterval(checkParticles);
    }
  }, []);

  return <div id="particles-js" ref={particlesRef}></div>;
};

export default ParticlesBackground;

