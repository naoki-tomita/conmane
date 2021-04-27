import Link from "next/link";
import { NextPage } from "next";
import { Api } from "../../lib/Api";

interface Model {
  id: string;
  structure: any;
}

const Models: NextPage<{ models: Model[] }> = ({ models }) => {
  return (
    <>
    <Link href="/models/create"><a>create</a></Link>
    <ul>
      {models.map(it => <li key={it.id}>{it.id}:<pre>{JSON.stringify(it.structure)}</pre></li>)}
    </ul>
    </>
  );
}

Models.getInitialProps = ({ req }) => {
  return Api.withCookie(req?.headers.cookie).models.list();
};

export default Models;
