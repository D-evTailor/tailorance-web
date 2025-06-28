import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "_posts");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

function validateFrontmatter(data: { [key: string]: any }): Omit<PostData, 'slug' | 'content'> {
    const { title, date, excerpt } = data;
    if (typeof title !== 'string' || typeof date !== 'string' || typeof excerpt !== 'string') {
        throw new Error('Invalid frontmatter in one of the posts. Make sure title, date, and excerpt are strings.');
    }
    return { title, date, excerpt };
}

export function getSortedPostsData(): Omit<PostData, "content">[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName: string) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    
    const frontmatter = validateFrontmatter(data);

    return {
      slug,
      ...frontmatter,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  const frontmatter = validateFrontmatter(data);

  return {
    slug,
    ...frontmatter,
    content,
  };
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName: string) => {
    return {
      params: {
        slug: fileName.replace(/\.mdx$/, ""),
      },
    };
  });
}
 