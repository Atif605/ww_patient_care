import { notFound } from "next/navigation"

export function generateStaticParams() {
  return [] // No blog posts yet
}

export default function BlogPostPage() {
  notFound()
}
