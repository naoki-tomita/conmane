import React, { useState } from "react";
import { NextPage } from "next";
import { Form, Input, Submit } from "../../components/Form";
import { Api } from "../../lib/Api";
import Link from "next/link";

const Login: NextPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  async function login() {
    await Api.users.login(id, password);
    location.assign("/");
  }

  return (
    <>
    <Form>
      <Input label="id" onChange={setId} value={id} />
      <Input label="password" onChange={setPassword} value={password} />
      <Submit label="create" onClick={login} />
    </Form>
    do not have account? <Link href="/users/create"><a>create</a></Link>
    </>
  );
};

Login.getInitialProps = async ({ req, res }) => {
  try {
    await Api.withCookie(req?.headers.cookie).users.me();
    if (res) {
      res.writeHead(302, { location: "/" }).end();
    } else {
      location.href = "/";
    }
  } catch {
    return {};
  }
};

export default Login;
