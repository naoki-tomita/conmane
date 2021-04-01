import React, { useState } from "react";
import { NextPage } from "next";
import { Form, Input, Submit } from "../../components/Form";
import { Api } from "../../lib/Api";

const Login: NextPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  async function login() {
    await Api.users.login(id, password);
  }

  return (
    <Form>
      <Input label="id" onChange={setId} value={id} />
      <Input label="password" onChange={setPassword} value={password} />
      <Submit label="create" onClick={login} />
    </Form>
  );
}

export default Login;
