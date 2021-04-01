const Host = global.location?.origin ?? "http://localhost:3000";

function request(url: Parameters<typeof fetch>[0], init: Parameters<typeof fetch>[1]) {
  return fetch(url, init).then(async it => it.ok ? it.json() : it.text().then(throwError));
}

export const Api = {
  users: {
    create(userId: string, password: string) {
      return request(`${Host}/api/v1/users/create`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ loginId: userId, password })
      });
    },
    login(userId: string, password: string) {
      return request(`${Host}/api/v1/users/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ loginId: userId, password })
      });
    }
  }
}

function throwError(e: string): any {
  throw Error(e);
}
