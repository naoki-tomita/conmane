import { createHandler } from "../../../../lib/ApiHandler";
import { app } from "../../../../src";
import { UUID } from "../../../../src/domain/Id";
import { User } from "../../../../src/domain/User";

const me = createHandler().get(async (req, res) => {
  const session = req.cookies.SESSION;
  if (session == null) {
    return res.writeHead(400).end("{}");
  }
  const user = await app.get("sessionUseCase").verifySession(new UUID(session));
  res.json(JSON.stringify(toEntity(user)));
});

function toEntity(user: User) {
  return { id: user.id.value, loginId: user.userId.value };
}

export default me;
