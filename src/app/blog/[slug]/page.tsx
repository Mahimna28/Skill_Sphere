import BlogPostClient from "./BlogPostClient";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <BlogPostClient slug={slug} />
    </main>
  );
}
