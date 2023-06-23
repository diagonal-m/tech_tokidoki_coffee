import fs from 'fs';
import matter from 'gray-matter';

import PostCard from '../components/PostCard';

// TODO: 型指定する 
type PostsProps = {
  posts: any
}

export const getStaticProps = () => {
  const files = fs.readdirSync('posts');
  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(`posts/${fileName}`, 'utf-8');
    const { data } = matter(fileContent);
    return {
      frontMatter: data,
      slug,
    };
  });

  const sortedPosts = posts.sort((postA, postB) =>
    new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1
  );

  return {
    props: {
      posts: sortedPosts,
    },
  };
};

export default function Home({ posts }: PostsProps) {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post: any) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}