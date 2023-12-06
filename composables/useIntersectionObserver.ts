// useIntersectionObserver.ts
import {onMounted, onUnmounted, Ref} from "vue";

// Infinity scroll с помощью intersection observer
export function useIntersectionObserver(
  elementRef: Ref<Element | null>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: "40px",
    threshold: 1.0,
  },
) {
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver(callback, options);

    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return { observer };
}
