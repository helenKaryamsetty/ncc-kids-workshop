import { onRequestPost } from './functions/api/register';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  APPS_SCRIPT_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/register') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, message: 'Method not allowed.' }), {
          status: 405,
          headers: {
            'allow': 'POST',
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store'
          }
        });
      }

      return onRequestPost({ request, env });
    }

    if (pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404 });
    }

    return env.ASSETS.fetch(request);
  }
};