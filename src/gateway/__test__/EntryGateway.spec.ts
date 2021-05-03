import { PrismaClient } from ".prisma/client";
import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { Content, Entries, Entry, Title } from "../../domain/Entry";
import { UUID } from "../../domain/Id";
import { User } from "../../domain/User";
import { EntryGateway } from "../EntryGateway";

describe("EntryGateway", () => {
  describe("#findByOwner", () => {
    it("should find entries", async () => {
      const owner = new User(new UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), mock(), mock());
      const target = new EntryGateway();
      const entries = new Entries([
        new Entry(new UUID("aa"), new Title("aaa"), new Content("a")),
        new Entry(new UUID("bb"), new Title("bbb"), new Content("b")),
        new Entry(new UUID("cc"), new Title("ccc"), new Content("c")),
      ]);

      const entryList = [
        { id: "aa", title: "aaa", content: "a" },
        { id: "bb", title: "bbb", content: "b" },
        { id: "cc", title: "ccc", content: "c" },
      ];
      const prisma = {
        entry: {
          findMany: jest.fn(() => Promise.resolve(entryList))
        }
      }
      register(prisma).as(PrismaClient);

      await expect(target.findByOwner(owner)).resolves.toEqual(entries);
      expect(prisma.entry.findMany).toBeCalledWith({
        where: {
          ownerId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        }
      });
    });
  });
});
