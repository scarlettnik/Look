import { act, renderHook } from '@testing-library/react';

import useIsKeyboardOpen from '../useIsKeyboardOpen';

describe('useIsKeyboardOpen', () => {
  it('marks keyboard as visible when visual viewport shrinks past threshold', () => {
    const listeners = new Map<string, () => void>();
    const visualViewport = {
      height: 800,
      addEventListener: jest.fn((event: string, callback: () => void) => {
        listeners.set(event, callback);
      }),
      removeEventListener: jest.fn(),
    };

    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: visualViewport,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });

    const { result, unmount } = renderHook(() => useIsKeyboardOpen());

    expect(result.current).toBe(false);

    act(() => {
      visualViewport.height = 650;
      listeners.get('resize')?.();
    });

    expect(result.current).toBe(true);

    act(() => {
      visualViewport.height = 820;
      listeners.get('resize')?.();
    });

    expect(result.current).toBe(false);

    unmount();
    expect(visualViewport.removeEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });
});
