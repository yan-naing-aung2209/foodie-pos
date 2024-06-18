import Layout from "@/component/Layout";
import ThemeProviiderWrapper from "@/component/ThemeProviderWrapper";
import { store } from "@/store";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProviiderWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProviiderWrapper>
      </Provider>
    </SessionProvider>
  );
}
