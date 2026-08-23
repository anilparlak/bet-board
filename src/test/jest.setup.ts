import "@testing-library/jest-dom";

/**
 * jsdom has no layout engine and no ResizeObserver, so react-window would
 * measure the list container as 0px and render zero rows.
 * This stub reports a fixed viewport size right after `observe()`.
 */
const OBSERVED_HEIGHT = 800;
const OBSERVED_WIDTH = 1200;

class ResizeObserverMock implements ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(target: Element): void {
    const size = { blockSize: OBSERVED_HEIGHT, inlineSize: OBSERVED_WIDTH };
    this.callback(
      [
        {
          target,
          contentRect: { height: OBSERVED_HEIGHT, width: OBSERVED_WIDTH } as DOMRectReadOnly,
          borderBoxSize: [size],
          contentBoxSize: [size],
          devicePixelContentBoxSize: [size],
        } as unknown as ResizeObserverEntry,
      ],
      this
    );
  }

  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverMock;
