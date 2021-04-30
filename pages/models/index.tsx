import Link from "next/link";
import { NextPage } from "next";
import { Api } from "../../lib/Api";
import { useRouter } from "next/router";

interface Model {
  id: string;
  name: string;
  structure: Array<Record<string, unknown>>;
}

const Models: NextPage<{ models: Model[] }> = ({ models }) => {
  const router = useRouter();
  async function onCreateClick() {
    const { id } = await Api.withCookie().models.create("", [
      { type: "text", name: "" },
    ]);
    router.push(`/models/${id}`);
  }
  return (
    <>
      <button onClick={onCreateClick}>create</button>
      <ul>
        {models.map((it) => (
          <li key={it.id}>
            <Link href={`/models/${it.id}`}>
              <a>{it.name || "no name"}</a>
            </Link>
            :<pre>{JSON.stringify(it.structure)}</pre>
          </li>
        ))}
      </ul>
    </>
  );
};

Models.getInitialProps = ({ req }) => {
  return Api.withCookie(req?.headers.cookie).models.list();
};

export default Models;
