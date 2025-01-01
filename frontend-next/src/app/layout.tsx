// layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";

import Nav from "@/components/Nav";
import DashboardNav from "@/components/DashboardNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

import Script from "next/script";
import Head from "next/head";

import { GoogleAnalytics } from '@next/third-parties/google'
import { GoogleTagManager } from '@next/third-parties/google'

import { Providers } from "./providers";

// we use config.json now instead, keeping it commented here, it is public anyways
// const GA_MEASUREMENT_ID = "G-P4SLLVSNCX"; // your hanabira.org code

// Import the config file
//import config from "@/../config.json"; // Adjust the path if needed
//const GA_MEASUREMENT_ID = config.GA_MEASUREMENT_ID; // Use the value from config.json

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;




const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
    <html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="UTF-8" />
        <title>Hanabira.org - Free Open-Source No Ads Japanese Learning Platform</title>
        <meta name="title" content="Hanabira.org - Free Open Source No Ads Japanese Learning Platform" />
        <meta name="description" content="Learn Japanese for free with Hanabira.org, an open-source platform with no ads." />
        <meta name="keywords" content="Hanabira, Japanese Learning, JLPT, Open Source, No Ads" />
        <meta name="author" content="hanabira.org" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hanabira.org/" />
        <meta property="og:title" content="Hanabira.org - Free Open Source No Ads Japanese Learning Platform" />
        <meta property="og:description" content="Learn Japanese for free with Hanabira.org, an open-source platform with no ads." />
        <meta property="og:image" content="https://hanabira.org/path-to-your-image.jpg" />

        {/* Twitter Meta Tags */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hanabira.org/" />
        <meta property="twitter:title" content="Hanabira.org - Free Open Source No Ads Japanese Learning Platform" />
        <meta property="twitter:description" content="Learn Japanese for free with Hanabira.org, an open-source platform with no ads." />
        <meta property="twitter:image" content="https://hanabira.org/path-to-your-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Additional Meta Tags */}
        <meta name="application-name" content="Hanabira.org" />
        <meta name="robots" content="index, follow" />

        {/* Base URL */}
        <base href="/" />
      </Head>
      <body className={inter.className}>
        
        {/* Google Analytics Scripts */}
        {/* <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script> */}

        {/* Page Layout */}
        <div className="h-full grid lg:grid-cols-body overflow-auto">
          <Sidebar />
          <div className="flex flex-col h-full">
            <Nav />
            <DashboardNav />
            {children}
          </div>
        </div>
        <Footer />
        <CookieConsent />
      </body>


      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      {/* <GoogleTagManager gtmId={GA_MEASUREMENT_ID} /> */}
    </html>
    </Providers>
  );
}




























// decently functioning stuff

// import "./globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";

// import Nav from "@/components/Nav";
// import DashboardNav from "@/components/DashboardNav";
// import Sidebar from "@/components/Sidebar";
// import Footer from "@/components/Footer";
// import CookieConsent from "@/components/CookieConsent";

// import { Html, Head, Main, NextScript } from 'next/document';


// import Script from "next/script";
// const GA_MEASUREMENT_ID = "G-P4SLLVSNCX"; //my hanabira.org code
// //const GA_MEASUREMENT_ID = "G-27EKDKSDWE"; // zen-lingo.com


// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "hanabira.org",
//   description: "Your path to Japanese fluency (JLPT N5-N1).",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <base href="/" />

//         <meta property="og:title" content="Hanabira.org - Free Open Source No Ads Japanese Learning Platform" />
//         <meta property="og:description" content="Learn Japanese for free with Hanabira.org, an open-source platform with no ads." />
//         <meta property="og:url" content="https://hanabira.org" />
//         <meta property="og:type" content="website" />
//         {/* Optionally include an image */}
//         <meta property="og:image" content="https://hanabira.org/path-to-your-image.jpg" />


//       </head>
//       <Script
//         src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
//         strategy="afterInteractive"
//       />
//       <Script id="google-analytics" strategy="afterInteractive">
//         {`
//           window.dataLayer = window.dataLayer || [];
//           function gtag(){window.dataLayer.push(arguments);}
//           gtag('js', new Date());
//           gtag('config', '${GA_MEASUREMENT_ID}');
//         `}
//       </Script>


//       <body className={inter.className}>
//             <div className="h-full grid lg:grid-cols-body overflow-auto">
//               <Sidebar />
//               <div className="flex flex-col h-full">
//                 <Nav />
//                 <DashboardNav />
//                 {children}
//               </div>
//             </div>
//           <Footer />
//           <CookieConsent />
//       </body>
//     </html>
//   );
// }
