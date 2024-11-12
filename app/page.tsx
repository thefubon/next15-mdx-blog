import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Link
        className="px-4 py-2 rounded-lg border"
        href="/blog">
        Open Blog
      </Link>
    </div>
  )
}
