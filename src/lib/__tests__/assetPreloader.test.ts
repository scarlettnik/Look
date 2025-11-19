import { preloadImage, preloadImages, warmImageAssets } from '../assetPreloader';

type MockImageInstance = {
  complete: boolean;
  decoding: string;
  onerror: (() => void) | null;
  onload: (() => void) | null;
  src: string;
};

const createdImages: MockImageInstance[] = [];

class MockImage implements MockImageInstance {
  complete = false;
  decoding = '';
  onerror: (() => void) | null = null;
  onload: (() => void) | null = null;
  private currentSrc = '';

  constructor() {
    createdImages.push(this);
  }

  get src() {
    return this.currentSrc;
  }

  set src(value: string) {
    this.currentSrc = value;
  }
}

describe('assetPreloader', () => {
  const originalImage = globalThis.Image;

  beforeEach(() => {
    createdImages.length = 0;
    globalThis.Image = MockImage as unknown as typeof Image;
    jest.useFakeTimers();
  });

  afterEach(() => {
    globalThis.Image = originalImage;
    jest.useRealTimers();
    delete (window as Window & { requestIdleCallback?: unknown })
      .requestIdleCallback;
  });

  it('resolves when a single image loads or errors', async () => {
    const loadPromise = preloadImage('https://example.com/a.jpg');

    expect(createdImages[0].decoding).toBe('async');
    expect(createdImages[0].src).toBe('https://example.com/a.jpg');

    createdImages[0].onload?.();

    await expect(loadPromise).resolves.toBeUndefined();
  });

  it('deduplicates and skips empty sources before preloading', async () => {
    const loadPromise = preloadImages([
      'https://example.com/a.jpg',
      '',
      'https://example.com/a.jpg',
      'https://example.com/b.jpg',
    ]);

    expect(createdImages.map((image) => image.src)).toEqual([
      'https://example.com/a.jpg',
      'https://example.com/b.jpg',
    ]);

    createdImages.forEach((image) => image.onerror?.());

    await expect(loadPromise).resolves.toBeUndefined();
  });

  it('warms images through requestIdleCallback when available', () => {
    const requestIdleCallback = jest.fn((callback: () => void) => {
      callback();
      return 1;
    });
    (window as unknown as {
      requestIdleCallback?: typeof requestIdleCallback;
    }).requestIdleCallback = requestIdleCallback;

    warmImageAssets(['https://example.com/warm.jpg']);

    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), {
      timeout: 1200,
    });
    expect(createdImages[0].src).toBe('https://example.com/warm.jpg');
  });

  it('falls back to timeout warmup without requestIdleCallback', () => {
    warmImageAssets(['https://example.com/fallback.jpg']);

    expect(createdImages).toHaveLength(0);

    jest.advanceTimersByTime(150);

    expect(createdImages[0].src).toBe('https://example.com/fallback.jpg');
  });
});
