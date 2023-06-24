import Layout from '../components/Layout';
import '../styles/globals.css';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import SEO from '../next-seo.config';
import { DefaultSeo } from 'next-seo';

// TODO: 型指定する 
type MyAppProps = {
  Component: any,
  pageProps: any
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <Layout>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;