import fs from 'fs';
import matter from 'gray-matter';

type GetStaticPropsProps = {
  params: any
}

type PostProps = {
  frontMatter: any,
  content: any
}

export async function getStaticProps({ params }: GetStaticPropsProps) {
  const file = fs.readFileSync(`posts/${params.slug}.md`, 'utf-8');
  const { data, content } = matter(file);
  return { props: { frontMatter: data, content } };
}

export async function getStaticPaths() {
  const files = fs.readdirSync('posts');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
  console.log('paths:', paths);
  return {
    paths,
    fallback: false,
  };
}

const Post = ({ frontMatter, content }: PostProps) => {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <div>{content}</div>
    </div>
  );
};

export default Post;