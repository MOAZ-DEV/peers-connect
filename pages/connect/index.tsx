import { Connect } from "@/components/Connect";
import type { Metadata } from 'next'
import Head from "next/head";

export const metadata: Metadata = {
  title: 'Peers Connect',
  description: 'An open-source app that enables peer-to-peer connections through WebRTC with minimal reliance on third-party services.',
}

const ConnectPage = () => {

  return (
    <div className="min-h-screen flex flex-col gap-12 items-center justify-center py-9">
      <Head>
        <title>Peers Connect</title>
        <meta name="description" content="An open-source app that enables peer-to-peer connections through WebRTC with minimal reliance on third-party services." />
      </Head>
      <Connect />
    </div>
  );
};

export default ConnectPage;
