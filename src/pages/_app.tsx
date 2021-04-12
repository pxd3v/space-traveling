import { AppProps } from 'next/app';
import Header from '../components/Header';
import '../styles/globals.scss';
import styles from '../styles/common.module.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div className={styles.appContainer}>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
