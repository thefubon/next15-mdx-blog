import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import YouTube from '@/components/mdx/youtube'

// Контент для этих страниц будет получен с помощью функции getPost.
// Эта функция вызывается во время сборки.
// Она возвращает содержимое поста с соответствующим slug.
// Она также возвращает сам slug, который Next.js будет использовать для определения того, какую страницу рендерить во время сборки.
//Например, { props: { slug: "my-first-post", content: "..." } }
async function getPost({ slug }: { slug: string }) {
  const markdownFile = fs.readFileSync(
    path.join('content', slug + '.mdx'),
    'utf-8'
  )
  const { data: frontMatter, content } = matter(markdownFile)
  return {
    frontMatter,
    slug,
    content,
  }
}

// generateStaticParams генерирует статические пути для записей блога.
// Эта функция вызывается во время сборки.
// Она возвращает массив возможных значений для slug.
// Например, [{ params: { slug: "my-first-post" } }, { params: { slug: "my-second-post" } } }]
export async function generateStaticParams() {
  const files = fs.readdirSync(path.join('content'))
  const params = files.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }))

  return params
}

export default async function Page(slug: {
  params: Promise<{ slug: string }>
}) {
  const params = await slug.params
  // Параметр содержит пост `slug`.

  // Получение содержимого поста на основе slug
  const props = await getPost(params)

  // Настройте компоненты для рендеринга MDX.
  // Например, компонент Code будет отображать блоки кода с подсветкой синтаксиса.
  // Компонент YouTube будет отображать видеоролики YouTube.
  const components = {
    YouTube,
  }

  return (
    <article className="prose prose-sm md:prose-base lg:prose-lg mx-auto">
      <h1>{props.frontMatter.title}</h1>
      <MDXRemote
        source={props.content}
        components={components}
      />
    </article>
  )
}
