import { act, renderHook } from '@testing-library/react';

import useVisualViewportMetrics from '../useVisualViewportMetrics';

describe('useVisualViewportMetrics', () => {
  it('returns rounded viewport metrics and updates them on viewport resize', () => {
    const listeners = new Map<string, () => void>();
    const visualViewport = {
      height: 700.4,
      width: 390.6,
      offsetTop: 20.2,
      addEventListener: jest.fn((event: string, callback: () => void) => {
        listeners.set(event, callback);
      }),
      removeEventListener: jest.fn(),
    };

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 812,
    });
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 390,
    });
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: visualViewport,
    });

    const { result, unmount } = renderHook(() => useVisualViewportMetrics());

    expect(result.current).toEqual({
      height: 700,
      width: 391,
      offsetTop: 20,
      keyboardOffset: 92,
    });

    act(() => {
      visualViewport.height = 812;
      visualViewport.width = 390;
      visualViewport.offsetTop = 0;
      listeners.get('resize')?.();
    });

    expect(result.current).toEqual({
      height: 812,
      width: 390,
      offsetTop: 0,
      keyboardOffset: 0,
    });

    unmount();
    expect(visualViewport.removeEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
    expect(visualViewport.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );
  });

  it('keeps initial metrics and skips listeners when disabled', () => {
    const addEventListener = jest.fn();
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: {
        height: 812,
        width: 375,
        offsetTop: 0,
        addEventListener,
        removeEventListener: jest.fn(),
      },
    });

    const { result } = renderHook(() => useVisualViewportMetrics(false));

    expect(result.current.height).toBe(812);
    expect(addEventListener).not.toHaveBeenCalled();
  });
});
