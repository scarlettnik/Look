import '@testing-library/jest-dom';

class TestHeaders {
  private readonly values = new Map<string, string>();

  constructor(init?: HeadersInit) {
    if (!init) {
      return;
    }

    if (init instanceof TestHeaders) {
      init.forEach((value, key) => this.set(key, value));
      return;
    }

    if (Array.isArray(init)) {
      init.forEach(([key, value]) => this.set(key, value));
      return;
    }

    Object.entries(init).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  get(key: string) {
    return this.values.get(key.toLowerCase()) ?? null;
  }

  set(key: string, value: string) {
    this.values.set(key.toLowerCase(), value);
  }

  forEach(callback: (value: string, key: string) => void) {
    this.values.forEach((value, key) => callback(value, key));
  }
}

class TestResponse {
  readonly headers: Headers;
  readonly ok: boolean;
  readonly status: number;
  private readonly body: string;

  constructor(body: BodyInit | null = null, init: ResponseInit = {}) {
    this.status = init.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new Headers(init.headers);
    this.body = body == null ? '' : String(body);
  }

  async text() {
    return this.body;
  }
}

Object.defineProperty(globalThis, 'Headers', {
  configurable: true,
  value: globalThis.Headers || TestHeaders,
});

Object.defineProperty(globalThis, 'Response', {
  configurable: true,
  value: globalThis.Response || TestResponse,
});

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'visualViewport', {
  configurable: true,
  value: {
    height: 812,
    width: 375,
    offsetTop: 0,
    offsetLeft: 0,
    pageTop: 0,
    pageLeft: 0,
    scale: 1,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
});

window.ResizeObserver =
  window.ResizeObserver ||
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
