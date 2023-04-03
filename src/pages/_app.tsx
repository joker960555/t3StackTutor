import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Letters</title>
        <meta name="description" content="WoW" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster
        containerClassName=" text-sm"
        position="bottom-center"
        toastOptions={{ duration: 4000 }}
      />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
