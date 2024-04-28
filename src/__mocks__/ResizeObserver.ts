export const mockResizeObserver = () => {
  class ResizeObserver {
    observe() {
      // do nothing
    }
    unobserve() {
      // do nothing
    }
    disconnect() {
      // do nothing
    }
  }
  window.ResizeObserver = ResizeObserver;
};
