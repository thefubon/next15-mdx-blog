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
      <h2>Blog List</h2>

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
