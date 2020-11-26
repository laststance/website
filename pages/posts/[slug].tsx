import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from 'next'
import ErrorPage from 'next/error'
import Main from '../../components/generic/Main'
import PostBody from '../../components/pages/posts/[id]/PostBody'
import MoreStories from '../../components/pages/posts/MoreStories'
import LeftUpperWebSiteNameLink from '../../components/pages/posts/[id]/LeftUpperWebSiteNameLink'
import PostHeader from '../../components/pages/posts/[id]/PostHeader'
import SectionSeparator from '../../components/generic/SectionSeparator'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import PostTitle from '../../components/pages/posts/PostTitle'
import Head from 'next/head'
import { Posts, Post } from '../../DataStructure'

interface Props {
  post: Post
  morePosts: Posts
  preview?: GetStaticPropsContext['preview']
}

const PostPage: React.FC<Props> = ({ post, morePosts, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Main>
      <LeftUpperWebSiteNameLink />
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article>
            <Head>
              <title>
                {post.title} | Laststance.io is indipendent organization for OSS
                activity.
              </title>
              {/* <meta property="og:image" content={post.ogImage.url} /> */}
            </Head>
            <PostHeader
              title={post.title}
              coverImageUrl={post.coverImageUrl}
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
    </Main>
  )
}

export default PostPage

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  // @ts-ignore @TODO I don't know how resove this at the time
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
