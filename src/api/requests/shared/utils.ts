export function parseBody(body: any): any {
  if (typeof body === 'string') return JSON.parse(body);
  if (body?.data && typeof body.data === 'string') return JSON.parse(body.data);
  return body;
}
