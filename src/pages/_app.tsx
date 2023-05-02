import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { MainLayout } from "~/components/mainLayout/MainLayout";

import "~/styles/globals.css";
import { useState, useEffect } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  // const [mounted, setMounted] = useState<boolean>(false);
  // // enable theme when mounted
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  // const { theme } = useTheme();
  // console.log(theme, "theme");
  // if (!mounted) return null;
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
        {/* <Component {...pageProps} /> */}
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
