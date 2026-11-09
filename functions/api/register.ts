interface RegistrationDetails {
  childName: string;
  childClass: string;
  parentName: string;
  parentPhone: string;
}

const jsonResponse = (body: { success: boolean; message?: string }, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });

export async function onRequestPost({ request, env }: { request: Request; env: { APPS_SCRIPT_URL?: string } }): Promise<Response> {
  const appsScriptUrl = env.APPS_SCRIPT_URL;
  if (!appsScriptUrl) {
    return jsonResponse({ success: false, message: 'Registration service is not configured.' }, 500);
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object') {
      return jsonResponse({ success: false, message: 'Please check the registration details.' }, 400);
    }

    const registration = body as Record<string, unknown>;
    const { childName, childClass, parentName, parentPhone } = registration;

    if (
      typeof childName !== 'string' || !childName.trim() || childName.trim().length > 80 ||
      typeof childClass !== 'string' || !childClass.trim() || childClass.trim().length > 40 ||
      typeof parentName !== 'string' || !parentName.trim() || parentName.trim().length > 80 ||
      typeof parentPhone !== 'string' || !/^[6-9]\d{9}$/.test(parentPhone.trim())
    ) {
      return jsonResponse({ success: false, message: 'Please check the registration details.' }, 400);
    }

    const details: RegistrationDetails = {
      childName: childName.trim(),
      childClass: childClass.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim()
    };

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(details)
    });
    const result = await response.json() as { success?: unknown };

    if (!response.ok || result.success !== true) {
      return jsonResponse({ success: false, message: 'The registration could not be saved.' }, 502);
    }

    return jsonResponse({ success: true });
  } catch {
    return jsonResponse({ success: false, message: 'The registration could not be saved.' }, 502);
  }
}