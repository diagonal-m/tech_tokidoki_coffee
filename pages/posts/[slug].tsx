import { createElement, Fragment } from 'react';
import fs from 'fs';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import remarkPrism from 'remark-prism';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';

type GetStaticPropsProps = {
  params: any
}

type PostProps = {
  frontMatter: any,
  content: any,
  slug: any
}

export async function getStaticProps({ params }: GetStaticPropsProps) {
  const file = fs.readFileSync(`posts/${params.slug}.md`, 'utf-8');
  const { data, content } = matter(file);

  const result = await unified()
    .use(remarkParse)
    .use(remarkPrism, {
      plugins: ['line-numbers'],
    })
    .use(remarkToc, {heading: '目次',})
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    props: { frontMatter: data, content: result.toString(), slug: params.slug },
  };
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

const Post = ({ frontMatter, content, slug }: PostProps) => {
  return (
    <>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        openGraph={{
          type: 'website',
          url: `http:localhost:3000/posts/${slug}`,
          title: frontMatter.title,
          description: frontMatter.description,
          images: [
            {
              url: `https://localhost:3000/${frontMatter.image}`,
              width: 1200,
              height: 700,
              alt: frontMatter.title,
            },
          ],
        }}
      />
      <div className="prose prose-lg max-w-none">
        <div className="border">
          <Image
            src={`/${frontMatter.image}`}
            width={1200}
            height={700}
            alt={frontMatter.title}
          />
        </div>
        <h1 className="mt-12">{frontMatter.title}</h1>
        <span>{frontMatter.date}</span>
        {toReactNode(content)}
      </div>
    </>
  );
};

const toReactNode = (content: any) => {
  return unified()
    .use(rehypeParse, {
      fragment: true,
    })
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        a: MyLink,
        img: MyImage
      },
    })
    .processSync(content).result;
};

  const MyLink = ({ children, href }: {children: any, href: any}) => {
    if (href === '') href = '/';
    return href.startsWith('/') || href.startsWith('#') ? (
      <Link href={href}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  };

  const MyImage = ({ src, alt }: {src: any, alt: any}) => {
    return (
      <div className="relative max-w-full h-96">
        <Image src={src} alt={alt} layout="fill" objectFit="contain" />
      </div>
    );
  };
  

export default Post;

