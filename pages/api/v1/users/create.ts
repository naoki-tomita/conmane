import { NextApiHandler } from "next";
import { app } from "../../../../src";
import { Session } from "../../../../src/domain/Session";
import { LoginId, Password } from "../../../../src/domain/User";

const create: NextApiHandler = async (req, res) => {
  try {
    switch (req?.method?.toUpperCase()) {
      case "POST":
        return post(req, res);
      default:
        return res.status(405).json({});
    }
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
};

const post: NextApiHandler = async (req, res) => {
  const { loginId, password } = req.body;
  const user = await app
    .get("userUseCase")
    .create(new LoginId(loginId), Password.from(password));
  const session = await app
    .get("userUseCase")
    .login(user.userId, user.password);
  res.writeHead(200, { ...toSetCookieHeader(session) }).end(JSON.stringify({}));
};

const CookieName = "SESSION";
function toSetCookieHeader(session: Session) {
  return {
    "set-cookie": `${CookieName}=${
      session.id.value
    };Expires=${session.expiresAt.toDate().toUTCString()};Path=/;`,
  };
}

export default create;
