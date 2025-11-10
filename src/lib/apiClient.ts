import { getTelegramInitData } from './telegramWebApp';

export const API_BASE_URL = 'https://look-api.tadpole-sirius.ts.net';
export const SUPPORT_BOT_URL = 'https://t.me/looksupportbot';

const DEFAULT_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
} as const;

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

const buildHeaders = (
  headers: HeadersInit | undefined,
  includeJsonContentType: boolean,
) => {
  const result = new Headers(DEFAULT_HEADERS);

  if (includeJsonContentType) {
    result.set('Content-Type', 'application/json');
  }

  const telegramInitData = getTelegramInitData();

  if (telegramInitData) {
    result.set('Authorization', `tma ${telegramInitData}`);
  }

  new Headers(headers).forEach((value, key) => {
    result.set(key, value);
  });

  return result;
};

const parseResponsePayload = async (response: Response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const rawBody = await response.text();

  if (!rawBody.trim()) {
    return null;
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  }

  if (contentType.startsWith('text/')) {
    return rawBody;
  }

  return rawBody;
};

export const apiFetch = async (
  path: string,
  init: RequestInit = {},
  includeJsonContentType = false,
) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init.headers, includeJsonContentType),
  });

  if (!response.ok) {
    const payload = await parseResponsePayload(response);
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return response;
};

export const apiGetJson = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await apiFetch(path, init);
  return (await parseResponsePayload(response)) as T;
};

export const apiSendJson = async <T>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown,
  init: RequestInit = {},
): Promise<T> => {
  const response = await apiFetch(
    path,
    {
      ...init,
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    true,
  );

  return (await parseResponsePayload(response)) as T;
};
