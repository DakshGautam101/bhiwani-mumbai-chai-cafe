import Navbar from '@/app/components/navbar';
import fs from 'fs';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import Image from 'next/image';

export default async function Page({ params }) {
  const { slug } = await params;

  // Ensure the slug is defined
  if (!slug) {
    notFound();
    return;
  }
  
  // Construct the file path based on the slug
  const filePath = `content/${slug}.md`;

  if (!fs.existsSync(filePath)) {
    notFound();
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: food, content } = matter(fileContent);

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeDocument, { title: food.title || 'Article' })
    .use(rehypeFormat)
    .use(rehypeStringify);

  const htmlContent = (await processor.process(content)).toString();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-10">
        {food.image && (
          <Image
            src={food.image || '/fallback-image.jpg'}
            alt={food.title}
            width={800}
            height={400}
            className="w-full h-72 object-cover rounded-xl shadow-md"
          />
        )}

        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {food.title}
        </h1>

        {food.description && (
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {food.description}
          </p>
        )}

        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="prose dark:prose-invert max-w-none"
        />
      </div>
    </div>
  );
}