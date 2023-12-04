export default defineNuxtPlugin(() => {
  return {
    provide: {
      intersectionFunc: (
        className: string,
        callback: () => void,
      ) => {
        const observables =
          document.querySelectorAll(className);
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                callback();
              }
            });
          },
          {},
        );
        observables.forEach((observable) => {
          observer.observe(observable);
        });
      },
    },
  };
});
