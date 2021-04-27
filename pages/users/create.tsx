import { useState } from "react";
import { NextPage } from "next";
import { Api } from "../../lib/Api";
import { Form, Input, Submit } from "../../components/Form";
import { useRouter } from "next/router";

const Create: NextPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [doubleCheckPassword, setDoubleCheckPassword] = useState("");

  async function create() {
    await Api.users.create(id, password);
    location.assign("/");
  }

  return (
    <Form>
      <Input label="id" onChange={setId} value={id} />
      <Input label="password" onChange={setPassword} value={password} />
      <Input
        label="double check password"
        onChange={setDoubleCheckPassword}
        value={doubleCheckPassword}
      />
      <Submit label="create" onClick={create} />
    </Form>
  );
};

Create.getInitialProps = async ({ req, res }) => {
  try {
    await Api.withCookie(req?.headers.cookie).users.me();
    if (res) {
      res.writeHead(302, { location: "/" }).end()
    } else {
      location.href = "/"
    }
  } catch {
    return {};
  }
}

export default Create;
