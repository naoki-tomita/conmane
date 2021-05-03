import { createHandler } from "../../../../lib/ApiHandler";
import { app } from "../../../../src";
import { Entries, Entry } from "../../../../src/domain/Entry";
import { UUID } from "../../../../src/domain/Id";

const entries = createHandler()
.get(async (req, res) => {
  const session = req.cookies.SESSION;
  const owner = await app.get("sessionUseCase").verifySession(new UUID(session));
  const list = await app.get("entryUseCase").list(owner);
  res.json(toEntities(list));
})
.post(async () => {

});

function toEntities(entries: Entries) {
  return entries.map(toEntity)
}

function toEntity(entry: Entry) {
  return { id: entry.id.value, title: entry.title.value, content: JSON.parse(entry.content.value) };
}
export default entries;
