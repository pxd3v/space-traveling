import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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
  function formatDate(date: string): string {
    const castedDate = new Date(date);

    return format(castedDate, 'dd MMM y', {
      locale: ptBR,
    });
  }

  async function onClickLoadMore(): Promise<void> {
    if (nextPage) {
      const response = await fetch(postsPagination.next_page);
      const { results, next_page } = await response.json();
      setPosts(currentPosts => [...currentPosts, ...results]);
      setNextPage(next_page);
    }
  }

  return (
    <main className={styles.postsContainer}>
      <ul>
        {posts.map(post => (
          <li key={post.uid} className={styles.post}>
            <h2>{post.data.title}</h2>
            <p>{post.data.subtitle}</p>
            <div>
              <span>
                <FiCalendar />
                <p>{formatDate(post.first_publication_date)}</p>
              </span>
              <span>
                <FiUser />
                <p>{post.data.author}</p>
              </span>
            </div>
          </li>
        ))}
      </ul>
      {nextPage && (
        <button type="button" onClick={onClickLoadMore}>
          Carregar mais posts
        </button>
      )}
    </main>
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
