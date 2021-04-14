import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Link from 'next/link';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import formatDate from '../utils/formatDate';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function onClickLoadMore(): Promise<void> {
    if (nextPage) {
      const response = await fetch(postsPagination.next_page);
      const { results, next_page } = await response.json();
      setPosts(currentPosts => [...currentPosts, ...results]);
      setNextPage(next_page);
    }
  }

  return (
    <div className={commonStyles.container}>
      <Header />
      <main className={`${styles.postsContainer}`}>
        <ul>
          {posts.map(post => (
            <li key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a className={styles.post}>
                  <h2>{post.data.title}</h2>
                  <p>{post.data.subtitle}</p>
                  <div>
                    <span>
                      <FiCalendar />
                      <p>
                        {formatDate(post.first_publication_date, 'dd MMM y')}
                      </p>
                    </span>
                    <span>
                      <FiUser />
                      <p>{post.data.author}</p>
                    </span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        {nextPage && (
          <button type="button" onClick={onClickLoadMore}>
            Carregar mais posts
          </button>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [
        'posts.title',
        'posts.subtitle',
        'posts.author',
        'posts.first_publication_date',
      ],
      pageSize: 1,
    }
  );
  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
