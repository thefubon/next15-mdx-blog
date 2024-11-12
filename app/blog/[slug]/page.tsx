import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import YouTube from '@/components/mdx/youtube'
import Link from 'next/link'

async function getPost(slug: string) {
  const markdownFile = fs.readFileSync(
    path.join('content', `${slug}.mdx`),
    'utf-8'
  )
  const { data: frontMatter, content } = matter(markdownFile)
  return {
    frontMatter,
    slug,
    content,
  }
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join('content'))
  const params = files.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }))

  return params
}

export default async function Page(url: { params: Promise<{ slug: string }> }) {
  const params = await url.params
  const { slug } = params
  const props = await getPost(slug)

  // MDX Custom Components
  const components = {
    YouTube,
  }

  return (
    <>
      <Link
        className="px-4 py-2 inline-block rounded-lg border my-4 ml-4"
        href="/blog">
        Назад
      </Link>

      <article className="prose prose-sm md:prose-base lg:prose-lg mx-auto dark:prose-invert">
        <h1>{props.frontMatter.title}</h1>
        <p>{props.frontMatter.description}</p>
        <MDXRemote
          source={props.content}
          components={components}
        />
      </article>
    </>
  )
}
