/**
 * Blog Loader Script - Manifest-Based
 * Reads blog posts from blog-manifest.json
 * Automatically sorts by date (newest first)
 *
 * How to use:
 * 1. Add a new entry to blog-manifest.json for each new post.
 *    - "url": "path/to/your/post.html"
 *    - "date": "YYYY-MM-DD"
 * 2. The script handles the rest!
 */

document.addEventListener("DOMContentLoaded", async () => {
  const posts = await fetchBlogPosts();

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.querySelector("[data-blog-container]");
  if (!container) return;

  const displayType = container.getAttribute("data-blog-container");

  if (displayType === "main") {
    const recentPosts = posts.slice(0, 5);
    await renderBlogPosts(recentPosts);
    if (posts.length > 5) {
      const linkHTML = `
        <div class="all-posts-link">
          <a href="all-blogs.html" class="btn">View All ${posts.length} Blog Posts →</a>
        </div>`;
      container.insertAdjacentHTML("beforeend", linkHTML);
    }
  } else if (displayType === "all") {
    await renderBlogPosts(posts);
  }
});

async function fetchBlogPosts() {
  try {
    const response = await fetch("blog-manifest.json");
    if (!response.ok) {
      console.error("Failed to load blog-manifest.json");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

async function renderBlogPosts(posts) {
  const container = document.querySelector("[data-blog-container]");
  if (posts.length === 0) {
    container.innerHTML += "<p>No blog posts found yet.</p>";
    return;
  }

  const postsHTML = await Promise.all(
    posts.map(async (post) => {
      const excerpt = await fetchBlogExcerpt(post.url);
      const title = extractTitleFromUrl(post.url);
      const dateStr = formatDate(post.date);
      return `
        <article class="blog-post">
          <h2><a href="${post.url}">${title}</a></h2>
          <p class="blog-date">${dateStr}</p>
          <p class="blog-excerpt">${excerpt}</p>
          <a href="${post.url}" class="read-more">Read More →</a>
        </article>`;
    })
  );
  container.innerHTML += postsHTML.join("");
}

async function fetchBlogExcerpt(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const firstParagraph = doc.querySelector("main p");
    let text = firstParagraph ? firstParagraph.textContent.trim() : "No preview available.";
    if (text.length > 200) {
      text = text.substring(0, 200) + "...";
    }
    return text;
  } catch (error) {
    console.error(`Error fetching excerpt from ${url}:`, error);
    return "Unable to load preview.";
  }
}

function extractTitleFromUrl(url) {
  try {
    let filename = url.substring(url.lastIndexOf("/") + 1);
    let title = filename.replace(/\.html$/, "").replace(/^blog-/, "");
    title = title.replace(/\d{2}\.\d{2}\.\d{4}-?/, "");
    if (!title) return "Blog Post";
    title = title.replace(/-/g, " ");
    return title.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  } catch (e) {
    return "Blog Post";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}