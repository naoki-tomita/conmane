import { useState } from "react";
import { NextPage } from "next";
import { Api } from "../../lib/Api";
import { Form, Input, Submit } from "../../components/Form";

const Login: NextPage = () => {
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

export default Login;
