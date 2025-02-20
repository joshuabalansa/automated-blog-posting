"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/blogs");
        const data = await response.json();
        setPosts(data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  interface Post {
    id: string;
    title: string;
    content: string;
    created_at: string;
  }

  const filteredPosts = posts.filter(
    (post: Post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Daily Tech Blog
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Stay updated with the latest in technology, AI, cybersecurity, and
            more.
          </p>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Search blog posts..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Getting latest blog posts...
            </p>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post: Post) => (
              <article
                key={post.id}
                className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                <time className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </time>
                <h4 className="mt-3 text-xl font-semibold text-gray-900 hover:text-blue-600">
                  <Link href={`/blog/${post.id}`}>
                    {post.title.replace(/<\/?[^>]+(>|$)/g, "")}
                  </Link>
                </h4>
                <div
                  className="mt-4 text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: post.content.substring(0, 70),
                  }}
                />
                <Link
                  href={`/blog/${post.id}`}
                  className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                >
                  Read More →
                </Link>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Opps! no blog posts found. Try searching for something else.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
