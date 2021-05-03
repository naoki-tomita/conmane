import { createHandler } from "../../../../lib/ApiHandler";
import { app } from "../../../../src";
import { Session } from "../../../../src/domain/Session";
import { LoginId, Password } from "../../../../src/domain/User";

const login = createHandler().post(async (req, res) => {
  const { loginId, password } = req.body;
  const session = await app
    .get("userUseCase")
    .login(new LoginId(loginId), Password.from(password));
  res.writeHead(200, { ...toSetCookieHeader(session) }).end(JSON.stringify({}));
});

const CookieName = "SESSION";
function toSetCookieHeader(session: Session) {
  return {
    "set-cookie": `${CookieName}=${
      session.id.value
    };Expires=${session.expiresAt.toDate().toUTCString()};Path=/`,
  };
}

export default login;
