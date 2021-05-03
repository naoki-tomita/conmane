import { NextApiHandler } from "next";

type ApiHandler<T> = NextApiHandler<T> & {
  get(handler: NextApiHandler<T>): ApiHandler<T>;
  post(handler: NextApiHandler<T>): ApiHandler<T>;
  put(handler: NextApiHandler<T>): ApiHandler<T>;
  delete(handler: NextApiHandler<T>): ApiHandler<T>;
  use(method: string, handler: NextApiHandler<T>): ApiHandler<T>;
};

export function createHandler<T = any>() {
  const handlers: { [key: string]: NextApiHandler<T> } = {};
  const handler: ApiHandler<T> = async (req, res) => {
    try {
      const apiHandler = handlers[req.method?.toLowerCase() ?? "get"];
      if (apiHandler) {
        return await apiHandler(req, res);
      }
      res.writeHead(405).end("Method not allowed.");
    } catch (e) {
      console.error(e);
      res.writeHead(500).end(e);
    }
  };
  handler.use = (m, h) => {
    handlers[m] = h;
    return handler;
  };
  handler.get = (h) => handler.use("get", h);
  handler.post = (h) => handler.use("post", h);
  handler.put = (h) => handler.use("put", h);
  handler.delete = (h) => handler.use("delete", h);
  return handler;
}
