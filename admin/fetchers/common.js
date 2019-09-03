var authToken = undefined;

export async function loadAuthToken() {
  if (authToken !== undefined) {
    return authToken;
  }
  if (typeof localStorage !== 'object') {
    authToken = null;
    return authToken;
  }
  try {
    authToken = await localStorage.getItem('authToken');
  } catch (err) {
    console.log('Error loading authToken from local storage');
    return authToken;
  }
  return authToken;
}

export function setAuthToken(token) {
  authToken = token;
  if (typeof localStorage !== 'object') {
    return;
  }
  try {
    localStorage.setItem('authToken', token);
  } catch (err) {
    console.log('Error saving auth token to local storage')
  }
}

export function withAuthHeaders(headers) {
  if (authToken) {
    headers['Authorization'] = 'Bearer ' + authToken;
  }
  return headers;
}

export async function extractMessageFromJSONError(resp) {
  try {
    const errJson = await resp.json();
    if (errJson.error) {
      return errJson.error;
    }
    return 'Completed fetch but got error from resource: ' + errJson;
  } catch (err) {
    return 'Completed fetch but got bad status from resource: ' + resp.status + ' (' + err + ')';
  }
}

export async function throwMessageFromJSONError(resp) {
  const msg = await extractMessageFromJSONError(resp);
  throw msg;
}

export function encodeQuery(params) {
  return Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
}