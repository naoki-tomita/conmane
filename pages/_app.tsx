import App, { AppContext } from "next/app";
import { Api } from "../lib/Api";

interface AppProps {
  user?: {
    id: string;
    loginId: string;
  };
}

class Application extends App<AppProps> {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div>
        <div>{this.props?.user?.loginId}</div>
        <Component {...pageProps} />
      </div>
    );
  }

  static async getInitialProps({ Component, ctx, router }: AppContext) {
    if (ctx.pathname === "/users/login" || ctx.pathname === "/users/create") {
      const pageProps = (await Component.getInitialProps?.(ctx)) ?? {};
      return { pageProps };
    }
    try {
      const user = await Api.withCookie(ctx?.req?.headers.cookie).users.me();
      const pageProps = (await Component.getInitialProps?.(ctx)) ?? {};
      return { pageProps, user };
    } catch {
      ctx.res?.writeHead(302, { location: "/users/login" }).end() ??
        router.push("/users/login");
      return { pageProps: {} };
    }
  }
}

export default Application;
