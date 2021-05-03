import { NextPage } from "next";
import Link from "next/link";
import { Api } from "../../lib/Api";

interface Entry {
  id: string;
  title: string;
  content: Record<string, unknown>[];
}

const Entries: NextPage<{ entries: Entry[] }> = ({ entries }) => {
  return (
    <ul>
      {entries.map((e) => (
        <li>
          <Link href={`/entries/${e.id}`}>
            <a>{e.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

Entries.getInitialProps = async ({ req }) => {
  const entries = await Api.withCookie(req?.headers.cookie).entries.list();
  return { entries };
};

export default Entries;
