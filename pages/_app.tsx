import Layout from '../components/Layout';
import '../styles/globals.css';

// TODO: 型指定する 
type MyAppProps = {
  Component: any,
  pageProps: any
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;