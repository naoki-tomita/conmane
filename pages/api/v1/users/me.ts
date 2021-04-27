import { NextApiHandler } from "next";
import { app } from "../../../../src";
import { UUID } from "../../../../src/domain/Id";
import { User } from "../../../../src/domain/User";

const me: NextApiHandler = async (req, res) => {
  try {
    switch (req?.method?.toUpperCase()) {
      case "GET":
        return get(req, res);
      default:
        return res.status(405).json({});
    }
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
};

const get: NextApiHandler = async (req, res) => {
  const session = req.cookies.SESSION;
  if (session == null) {
    return res.writeHead(400).end("{}");
  }
  const user = await app.get("sessionUseCase").verifySession(new UUID(session));
  res.json(JSON.stringify(toEntity(user)));
};

function toEntity(user: User) {
  return { id: user.id.value, loginId: user.userId.value };
}

export default me;
