import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((p) => ({ slug: p.params.slug }));
}

export async function generateMetadata({ params }: PostPageProps) {
  try {
    const post = await getPostData(params.slug);
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch (error) {
    return {
      title: "Post no encontrado",
      description: "Este post no existe o fue movido.",
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  let post;
  try {
    post = await getPostData(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0d1117] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-brand-300 hover:text-brand-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al blog
        </Link>
        
        <article className="prose prose-lg prose-invert mx-auto">
          <h1 className="text-white">{post.title}</h1>
          <p className="text-gray-400 not-prose">
            {new Date(post.date).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <hr className="border-gray-700 my-8" />
          <div className="text-gray-300">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
