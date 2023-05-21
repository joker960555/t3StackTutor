import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { MainLayout } from "~/components/mainLayout/MainLayout";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <ClerkProvider {...pageProps}>
        <Head>
          <title>Letters</title>
          <meta name="description" content="WoW" />
          {/* <meta name="color-scheme" content="light dark" /> */}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Toaster
          containerClassName=" text-sm"
          position="bottom-center"
          toastOptions={{ duration: 4000 }}
        />
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
        <Analytics />
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
