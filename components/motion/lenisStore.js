// Client-only module-level holder for the Lenis instance, so other
// components (e.g. the cart drawer) can pause smooth scrolling without
// prop drilling. Imported only from Client Components.
let lenisInstance = null;

export function setLenis(instance) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}