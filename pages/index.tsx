import { NextPage } from "next";
import Link from "next/link";

const Index: NextPage = () => {
  return (
    <>
      <div>hello world</div>
      <Link href="/models">
        <a>models</a>
      </Link>
    </>
  );
};

export default Index;
