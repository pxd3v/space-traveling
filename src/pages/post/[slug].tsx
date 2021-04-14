import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import formatDate from '../../utils/formatDate';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const content = post.data.content.map(item => ({
    heading: item.heading,
    body: RichText.asHtml(item.body),
  }));

  const router = useRouter();
  return router.isFallback ? (
    <div>Carregando...</div>
  ) : (
    <div className={commonStyles.container}>
      <Header />
      <div className={styles.postContainer}>
        <img src={post.data.banner.url} alt="post banner" />
        <div className={styles.postSummary}>
          <h1>{post.data.title}</h1>
          <div>
            <span>
              <FiCalendar />
              <time>{formatDate(post.first_publication_date, 'dd MMM y')}</time>
            </span>
            <span>
              <FiUser />
              <p>{post.data.author}</p>
            </span>
            <span>
              <FiClock />
              <time>4 min</time>
            </span>
          </div>
        </div>
        {content.map((content, index) => (
          <div className={styles.postContent} key={index}>
            <h2>{content.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: content.body }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 2,
    }
  );

  return {
    paths: [
      ...response.results.map(post => ({
        params: {
          slug: post.uid ?? '',
        },
      })),
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: response,
    },
  };
};
