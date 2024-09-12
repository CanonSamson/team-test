import dynamic from 'next/dynamic';

const MyComponent = dynamic(() => import('@/components/Main'), { ssr: false });



export default function Home() {

  return (
    <MyComponent />
  );
}
