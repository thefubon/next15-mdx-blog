# Next Blog

Next 15.0.3 | React 19.0.0 | TailwindCSS 3.4.14 | ESlint 9.14.0 | PNPM

- [x] Next 15
- [x] NDX Blog
- [ ] Tailwind 4

[VIEW CHANGELOG](https://github.com/thefubon/next15-mdx-blog/blob/main/CHANGELOG.md)

### MDX Components

```mdx
<YouTube videoId="2aocIrQCkE4" />

<Vimeo videoId="371621457" />
```

## Install Package

```bash
pnpm i gray-matter next-mdx-remote path fs
```

## Bug Fix: slug.params

```bash
npx @next/codemod@canary next-async-request-api . --force
```

## Pages

Context MDX: `content/hello-world.mdx`

```mdx
---
title: "Hello World"
date: "2024-11-12"
description: "This is a sample MDX file."
---

## This is a sample MDX file

This is a sample MDX file. It contains JSX and markdown content.

![Image](https://images.unsplash.com/photo-1730840669516-10f18020ca8e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)

<YouTube videoId="_PoawhlC9o4" />
```

Components: `components/mdx/youtube.tsx`

```tsx
const YouTube = ({ videoId }: { videoId: string }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}`
  return (
    <div className="">
      <iframe
        className="w-full aspect-video"
        src={videoSrc}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen></iframe>
    </div>
  )
}

export default YouTube
```

Blog List: `app/blog/page.tsx`

```tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

export default function Blog() {
  const blogDirectory = path.join(process.cwd(), 'content')
  const fileNames = fs.readdirSync(blogDirectory)

  const blogs = fileNames.map((fileName) => {
    const slug = fileName.replace('.mdx', '')
    const fullPath = path.join(blogDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const { data: frontMatter } = matter(fileContents)

    const date = new Date(frontMatter.date)

    // Отформатируйте дату в удобочитаемый строковый формат
    // Например, "12 ноября 2024 г.".
    const formattedDate = date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return {
      slug,
      formattedDate,
      meta: frontMatter,
    }
  })

  return (
    <section className="container py-10 space-y-10">
      {blogs.map((blog) => (
        <div
          key={blog.slug}
          className="p-4 border rounded-lg">
          <Link href={`/blog/${blog.slug}`}>
            <h3>{blog.meta.title}</h3>
            <p>{blog.formattedDate}</p>
            <p>{blog.meta.description}</p>
          </Link>
        </div>
      ))}
    </section>
  )
}

```

Blog Post: `app/blog/[slug]/page.tsx`

```tsx
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
```
