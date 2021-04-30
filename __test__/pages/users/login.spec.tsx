import { create, act } from "react-test-renderer";
import Login from "../../../pages/users/login";

describe("login", () => {
  describe("initial state", () => {
    it("should match with snapshot", () => {
      const renderer = create(<Login />);
      expect(renderer).toMatchSnapshot();
    });
  });

  describe("login control", () => {
    it.todo("should not loginable when id not filled.");
    it.todo("should not loginable when password not filled.");
    it.todo("should loginable when id password filled.");
  });

  describe("exec login", () => {
    it("should execute login", async () => {
      const renderer = create(<Login />);
      const idInput = renderer.root
        .find((it) => it.props.label === "id")
        .find((it) => it.type === "input");
      const passwordInput = renderer.root
        .find((it) => it.props.label === "password")
        .find((it) => it.type === "input");
      const submit = renderer.root.find((it) => it.type === "button");
      global.fetch = (jest.fn(async () => ({
        ok: true,
        json: async () => ({}),
      })) as unknown) as typeof fetch;
      act(() => {
        idInput.props.onChange({ target: { value: "foo" } });
        passwordInput.props.onChange({ target: { value: "bar" } });
      });
      await act(() => submit.props.onClick({ preventDefault: () => "" }));
      expect(global.fetch).toBeCalledWith(
        `http://localhost/api/v1/users/login`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ loginId: "foo", password: "bar" }),
        }
      );
    });
  });
});
