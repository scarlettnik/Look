import { API_BASE_URL, ApiError, apiFetch, apiGetJson, apiSendJson } from '../apiClient';
import { getTelegramInitData } from '../telegramWebApp';

jest.mock('../telegramWebApp', () => ({
  getTelegramInitData: jest.fn(),
}));

const mockedGetTelegramInitData = jest.mocked(getTelegramInitData);
const mockedFetch = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    mockedGetTelegramInitData.mockReturnValue('');
    globalThis.fetch = mockedFetch;
  });

  afterEach(() => {
    mockedFetch.mockReset();
  });

  it('sends default, json and Telegram authorization headers', async () => {
    mockedGetTelegramInitData.mockReturnValue('signed-init-data');
    mockedFetch.mockResolvedValue(
      new Response(JSON.stringify({ saved: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const result = await apiSendJson('/v1/user', 'PATCH', {
      preferences: { complete_onboarding: true },
    });

    expect(result).toEqual({ saved: true });
    expect(mockedFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/v1/user`,
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          preferences: { complete_onboarding: true },
        }),
      }),
    );

    const headers = mockedFetch.mock.calls[0][1].headers as Headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('tma signed-init-data');
    expect(headers.get('ngrok-skip-browser-warning')).toBe('true');
  });

  it('lets caller headers override defaults', async () => {
    mockedFetch.mockResolvedValue(new Response(null, { status: 204 }));

    await apiFetch('/v1/catalog/search/meta', {
      headers: {
        'ngrok-skip-browser-warning': 'false',
        'x-request-id': 'test-request',
      },
    });

    const headers = mockedFetch.mock.calls[0][1].headers as Headers;
    expect(headers.get('ngrok-skip-browser-warning')).toBe('false');
    expect(headers.get('x-request-id')).toBe('test-request');
  });

  it('parses empty and text responses without forcing json', async () => {
    mockedFetch
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response('plain body', {
          status: 200,
          headers: { 'content-type': 'text/plain' },
        }),
      );

    await expect(apiGetJson('/v1/empty')).resolves.toBeNull();
    await expect(apiGetJson('/v1/text')).resolves.toBe('plain body');
  });

  it('throws ApiError with server message and payload on failed requests', async () => {
    mockedFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Bad initData' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }),
    );

    let error: unknown;
    try {
      await apiGetJson('/v1/auth/init-data');
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toMatchObject({
      name: 'ApiError',
      message: 'Bad initData',
      status: 401,
      payload: { message: 'Bad initData' },
    });
    expect(error).toBeInstanceOf(ApiError);
  });
});
