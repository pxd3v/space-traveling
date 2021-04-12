import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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
  return (
    <>
      <Header />
      <img src={post.data.banner.url} alt="post banner" />
      <div>
        <h1>{post.data.title}</h1>
        <div>
          <span>
            <FiCalendar />
            <time>{post.first_publication_date}</time>
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
      {post.data.content.map(content => (
        <div>
          <h2>{content.heading}</h2>
          <div dangerouslySetInnerHTML={{ __html: content.body }} />
        </div>
      ))}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const content = response.data.content.map(item => ({
    heading: item.heading,
    body: RichText.asHtml(item.body),
  }));
  const data = {
    ...response.data,
    content,
  };
  console.log({ ...response, data });
  return {
    props: {
      post: { ...response, data },
    },
  };
};
