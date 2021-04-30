import { NextApiHandler } from "next";
import { app } from "../../../../src";
import { Session } from "../../../../src/domain/Session";
import { LoginId, Password } from "../../../../src/domain/User";

const login: NextApiHandler = async (req, res) => {
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
  const session = await app
    .get("userUseCase")
    .login(new LoginId(loginId), Password.from(password));
  res.writeHead(200, { ...toSetCookieHeader(session) }).end(JSON.stringify({}));
};

const CookieName = "SESSION";
function toSetCookieHeader(session: Session) {
  return {
    "set-cookie": `${CookieName}=${
      session.id.value
    };Expires=${session.expiresAt.toDate().toUTCString()};Path=/`,
  };
}

export default login;
