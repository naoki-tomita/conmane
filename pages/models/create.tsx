import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Api } from "../../lib/Api";

interface Model {
  id: string;
  structure: any;
}

const CreateModel: NextPage<{ models: Model[] }> = ({ models }) => {
  const [state, setState] = useState("");
  const router = useRouter();
  async function onSave() {
    await Api.withCookie().models.create(JSON.parse(state));
    router.push("/models")
  }
  return (
    <div>
      <textarea value={state} onChange={e => setState(e.target.value)}></textarea>
      <button onClick={onSave}>save</button>
    </div>
  );
}

CreateModel.getInitialProps = ({ req }) => {
  return Api.withCookie(req?.headers.cookie).models.list();
};

export default CreateModel;
