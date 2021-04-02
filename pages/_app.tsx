import App, { AppContext, AppProps } from "next/app";

const Application = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

Application.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  return { ...appProps };
};
