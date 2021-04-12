import { AppProps } from 'next/app';
import '../styles/globals.scss';
import styles from '../styles/common.module.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div className={styles.appContainer}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
