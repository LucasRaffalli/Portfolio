import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import gsap from 'gsap';

const animateLoader = () => {
  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        const loader = document.getElementById('loader');
        if (loader) {
          gsap.to(loader, {
            duration: 0.2,
            opacity: 0,
            ease: 'power3.out',
            onComplete: () => {
              loader.remove();
              resolve();
            }
          });
        } else {
          resolve();
        }
      }
    });


    tl.from('.name', {
      duration: 1,
      opacity: 1,
      ease: 'power4.out',
    })
      .from('.title', {
        duration: 1,
        opacity: 1,
        ease: 'power4.out',
      }, "-=0.7")
      .to('.name', {
        duration: 0.8,
        opacity: 0,
        ease: 'power2.inOut',
      }, "+=0.3") // name disparaît d'abord
      .to('.title', {
        duration: 0.8,
        opacity: 0,
        ease: 'power2.inOut',
      }, "-=0.47"); // title disparaît peu de temps après
  });
};

animateLoader().then(() => {
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
});