import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Force reload of content types to ensure they appear in permissions
    console.log('Bootstrap: Ensuring content types are loaded...');
    
    // Wait a bit for content types to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Bootstrap: Content types should now be available in permissions');

    // Add initial dummy data
    await addInitialData(strapi);
  },
};

async function addInitialData(strapi: Core.Strapi) {
  try {
    console.log('🚀 Adding initial dummy data...');

    // Check if data already exists
    const existingCategories = await strapi.entityService.findMany('api::category.category');
    const existingTags = await strapi.entityService.findMany('api::tag.tag');
    const existingAuthors = await strapi.entityService.findMany('api::author.author');
    const existingArticles = await strapi.entityService.findMany('api::article.article');

    // Create Categories
    if (existingCategories.length === 0) {
      const categories = [
        { name: 'Technology', description: 'Latest technology trends and insights' },
        { name: 'Business', description: 'Business strategies and entrepreneurship' },
        { name: 'Tutorials', description: 'Step-by-step guides and tutorials' },
        { name: 'Design', description: 'UI/UX design and creative content' }
      ];

      for (const categoryData of categories) {
        await strapi.entityService.create('api::category.category', {
          data: {
            ...categoryData,
            publishedAt: new Date()
          }
        });
      }
      console.log('✅ Categories created');
    }

    // Create Tags
    if (existingTags.length === 0) {
      const tags = [
        'React', 'Next.js', 'JavaScript', 'TypeScript', 'CSS', 'HTML',
        'Node.js', 'API', 'Database', 'Tutorial', 'Guide', 'Tips',
        'Frontend', 'Backend', 'Full-stack', 'Web Development'
      ];

      for (const tagName of tags) {
        await strapi.entityService.create('api::tag.tag', {
          data: {
            name: tagName,
            publishedAt: new Date()
          }
        });
      }
      console.log('✅ Tags created');
    }

    // Create Author
    if (existingAuthors.length === 0) {
      const author = await strapi.entityService.create('api::author.author', {
        data: {
          displayName: 'Riza Rizohman',
          bio: 'Full-stack developer passionate about creating amazing web experiences. Love working with React, Next.js, and modern web technologies.',
          socialLinks: {
            website: 'https://cloudnowcorp.com',
            twitter: 'https://twitter.com/ritarodev10',
            github: 'https://github.com/ritarodev10',
            linkedin: 'https://linkedin.com/in/rizarohman'
          },
          publishedAt: new Date()
        }
      });
      console.log('✅ Author created');
    }

    // Create Articles
    if (existingArticles.length === 0) {
      const categories = await strapi.entityService.findMany('api::category.category');
      const tags = await strapi.entityService.findMany('api::tag.tag');
      const authors = await strapi.entityService.findMany('api::author.author');

      const articles = [
        {
          title: 'Welcome to CloudNow Blog',
          excerpt: 'Welcome to our new blog! We\'re excited to share insights about technology, business, and web development.',
          content: `
# Welcome to CloudNow Blog! 🚀

We're thrilled to launch our new blog platform built with **Strapi** and **Next.js**. This blog will be your go-to resource for:

## What You'll Find Here

- **Technology Insights**: Latest trends in web development
- **Business Strategies**: Tips for growing your business
- **Tutorials**: Step-by-step guides for developers
- **Design Inspiration**: UI/UX best practices

## Our Mission

At CloudNow, we believe in sharing knowledge and helping developers build amazing applications. Whether you're a beginner or an experienced developer, you'll find valuable content here.

Stay tuned for more exciting content coming your way!

---

*Happy coding!* 👨‍💻
          `,
          featured: true,
          category: categories[0]?.id,
          tags: [tags[0]?.id, tags[1]?.id, tags[2]?.id],
          author: authors[0]?.id,
          seo: {
            metaTitle: 'Welcome to CloudNow Blog - Technology & Business Insights',
            metaDescription: 'Discover the latest in technology, business strategies, and web development tutorials on CloudNow Blog.'
          }
        },
        {
          title: 'Getting Started with Next.js 14',
          excerpt: 'Learn how to build modern web applications with Next.js 14, including new features and best practices.',
          content: `
# Getting Started with Next.js 14 🎯

Next.js 14 brings exciting new features that make building React applications even more powerful. Let's explore what's new!

## Key Features

### App Router
The new App Router provides a more intuitive way to structure your applications:

\`\`\`javascript
// app/page.js
export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js 14!</h1>
    </div>
  );
}
\`\`\`

### Server Components
Server Components allow you to render components on the server, improving performance:

\`\`\`javascript
// app/blog/page.js
async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts');
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

## Best Practices

1. **Use TypeScript** for better development experience
2. **Implement proper error handling** with error boundaries
3. **Optimize images** with the built-in Image component
4. **Use dynamic imports** for code splitting

Ready to start building? Let's create something amazing! 🚀
          `,
          featured: false,
          category: categories[2]?.id, // Tutorials
          tags: [tags[1]?.id, tags[2]?.id, tags[3]?.id], // Next.js, JavaScript, TypeScript
          author: authors[0]?.id,
          seo: {
            metaTitle: 'Getting Started with Next.js 14 - Complete Guide',
            metaDescription: 'Learn Next.js 14 from scratch with our comprehensive guide covering App Router, Server Components, and best practices.'
          }
        },
        {
          title: 'Building Scalable APIs with Strapi',
          excerpt: 'Discover how to build robust and scalable APIs using Strapi CMS for your web applications.',
          content: `
# Building Scalable APIs with Strapi 🔧

Strapi is a powerful headless CMS that makes building APIs incredibly easy. Let's explore how to create scalable content management systems.

## Why Choose Strapi?

- **Headless Architecture**: Use any frontend framework
- **REST & GraphQL**: Built-in API generation
- **Role-based Permissions**: Fine-grained access control
- **Plugin Ecosystem**: Extend functionality easily

## Setting Up Content Types

Creating content types in Strapi is straightforward:

\`\`\`javascript
// Content Type: Article
{
  "title": "string",
  "content": "richtext",
  "author": "relation",
  "category": "relation",
  "tags": "relation"
}
\`\`\`

## API Endpoints

Strapi automatically generates REST endpoints:

- \`GET /api/articles\` - List all articles
- \`GET /api/articles/:id\` - Get single article
- \`POST /api/articles\` - Create article
- \`PUT /api/articles/:id\` - Update article
- \`DELETE /api/articles/:id\` - Delete article

## Best Practices

1. **Use Draft & Publish** for content workflow
2. **Implement proper validation** for data integrity
3. **Set up webhooks** for real-time updates
4. **Configure caching** for better performance

Strapi makes content management a breeze! 🎉
          `,
          featured: false,
          category: categories[0]?.id, // Technology
          tags: [tags[7]?.id, tags[8]?.id, tags[9]?.id], // API, Database, Tutorial
          author: authors[0]?.id,
          seo: {
            metaTitle: 'Building Scalable APIs with Strapi - Complete Guide',
            metaDescription: 'Learn how to build robust APIs with Strapi CMS. Complete guide covering content types, permissions, and best practices.'
          }
        }
      ];

      for (const articleData of articles) {
        await strapi.entityService.create('api::article.article', {
          data: {
            ...articleData,
            publishedAt: new Date()
          }
        });
      }
      console.log('✅ Articles created');
    }

    console.log('🎉 Initial dummy data setup complete!');
  } catch (error) {
    console.error('❌ Error adding initial data:', error);
  }
}