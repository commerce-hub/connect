const isJsonContentType = (contentType: string): boolean => {
  const mediaType = contentType.split(';', 1)[0].trim().toLowerCase();

  return mediaType === 'application/json' || mediaType.endsWith('+json');
};

export const parseCommerceHubResponseBody = async (
  response: Response
): Promise<unknown> => {
  if (response.status === 204) {
    return undefined;
  }

  const bodyText = await response.text();

  if (bodyText.trim() === '') {
    return undefined;
  }

  return isJsonContentType(response.headers.get('content-type') ?? '')
    ? JSON.parse(bodyText)
    : bodyText;
};
