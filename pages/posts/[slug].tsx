import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next'
import ErrorPage from 'next/error'
import Container from '../../components/Container'
import PostBody from '../../components/PostBody'
import MoreStories from '../../components/MoreStories'
import Header from '../../components/Header'
import PostHeader from '../../components/PostHeader'
import SectionSeparator from '../../components/SectionSeparator'
import Layout from '../../components/Layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import PostTitle from '../../components/PostTitle'
import Head from 'next/head'
import { MorePosts, Post } from '../../DataStructure'

interface Props {
  post: Post
  morePosts: MorePosts
  preview: boolean
}

const Posts: React.FC<Props> = ({ post, morePosts, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.title} | Laststance.io is indipendent organization for
                  OSS activity.
                </title>
                {/* <meta property="og:image" content={post.ogImage.url} /> */}
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                slug={post.slug}
              />
              <PostBody content={post.content} />
            </article>
            <SectionSeparator />
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          </>
        )}
      </Container>
    </Layout>
  )
}

export default Posts

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const data = await getPostAndMorePosts(params.slug, preview)
  return {
    props: {
      preview,
      post: data?.post || null,
      morePosts: data?.morePosts || null,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug()
  return {
    paths:
      allPosts?.map((post) => ({
        params: {
          slug: post.slug,
        },
      })) || [],
    fallback: true,
  }
}
