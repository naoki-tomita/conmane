import { mock } from "@kojiro.ueda/bandia";
import { register } from "automated-omusubi";
import { when } from "jest-when";
import { Entries } from "../../domain/Entry";
import { User } from "../../domain/User";
import { EntryPort } from "../../port/EntryPort";
import { EntryUseCase } from "../EntryUseCase";

describe("EntryUseCase", () => {
  describe("list", () => {
    it("should return all.", async () => {
      const target = new EntryUseCase();
      const entries = mock<Entries>();
      const owner = mock<User>();

      const entryPort = mock<EntryPort>();

      register(entryPort).as(EntryPort);

      when(entryPort.findByOwner).calledWith(owner).mockResolvedValueOnce(entries);

      await expect(target.list(owner)).resolves.toBe(entries);
    });
  });
});
