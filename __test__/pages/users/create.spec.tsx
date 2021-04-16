import { create, act } from "react-test-renderer";
import Create from "../../../pages/users/create";

describe("create user", () => {
  describe("initial state", () => {
    it("should match with snapshot", () => {
      const renderer = create(<Create />);
      expect(renderer).toMatchSnapshot();
    });
  });

  describe("login control", () => {
    it.todo("should not loginable when id not filled.");
    it.todo("should not loginable when password not filled.");
    it.todo("should loginable when id password filled.");
  });

  describe("exec create user", () => {
    it("should execute create user", async () => {
      const renderer = create(<Create />);
      const idInput = renderer.root
        .find((it) => it.props.label === "id")
        .find((it) => it.type === "input");
      const passwordInput = renderer.root
        .find((it) => it.props.label === "password")
        .find((it) => it.type === "input");
      const doubleCheckPasswordInput = renderer.root
        .find((it) => it.props.label === "double check password")
        .find((it) => it.type === "input");
      const submit = renderer.root.find((it) => it.type === "button");
      global.fetch = (jest.fn(async () => ({
        ok: true,
        json: async () => ({}),
      })) as unknown) as typeof fetch;
      act(() => {
        idInput.props.onChange({ target: { value: "foo" } });
        passwordInput.props.onChange({ target: { value: "bar" } });
        doubleCheckPasswordInput.props.onChange({ target: { value: "bar" } });
      });
      await act(() => submit.props.onClick());
      expect(global.fetch).toBeCalledWith(
        `http://localhost/api/v1/users/create`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ loginId: "foo", password: "bar" }),
        }
      );
    });
  });
});
