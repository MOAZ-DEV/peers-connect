import { Button } from '@/components/ui/button';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {

  return (
    <div className="min-h-screen flex flex-col gap-12 items-center justify-center py-9">
      <Head>
        <title>Peers Connect</title>
        <meta name="description" content="An open-source app that enables peer-to-peer connections through WebRTC with minimal reliance on third-party services." />
      </Head>
      <div>
        <Link href={'/connect'}>
          <Button variant='secondary' className='font-semibold'>
            Connect Now!
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
