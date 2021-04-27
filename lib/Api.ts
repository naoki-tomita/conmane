const Host = global.location?.origin ?? "http://localhost:3000";

function request(
  url: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) {
  return fetch(url, init).then(async (it) =>
    it.ok ? it.json() : it.text().then(throwError)
  );
}

type EmptyObject = Record<string, never>;

export const Api = {
  withCookie(cookie?: string) {
    const headers: { cookie: string } | {} = cookie ? { cookie } : {};
    return {
      users: {
        me(): Promise<{ id: string; loginId: string; }> {
          return request(`${Host}/api/v1/users/me`, { headers });
        },
      },
      models: {
        list(): Promise<{ models: Array<{ id: string; structure: string }> }> {
          return request(`${Host}/api/v1/models`, { headers });
        },
        create(structure: any) {
          return request(`${Host}/api/v1/models`, {
            method: "POST",
            headers: { ...headers, "content-type": "application/json" },
            body: JSON.stringify({ structure })
          })
        }
      }
    };
  },
  users: {
    create(userId: string, password: string): Promise<EmptyObject> {
      return request(`${Host}/api/v1/users/create`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ loginId: userId, password }),
      });
    },
    login(userId: string, password: string): Promise<EmptyObject> {
      return request(`${Host}/api/v1/users/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ loginId: userId, password }),
      });
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throwError(e: string): any {
  throw Error(e);
}
