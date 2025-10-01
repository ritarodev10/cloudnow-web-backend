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
    console.log('🚀 Bootstrap: Starting initial data setup...');
    
    // Wait for Strapi to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await addInitialData(strapi);
    } catch (error) {
      console.error('❌ Bootstrap error:', error);
    }
  },
};

async function addInitialData(strapi: Core.Strapi) {
  console.log('📊 Checking for existing data...');

  // Create Categories first
  await createCategories(strapi);
  
  // Create Tags
  await createTags(strapi);
  
  // Create Author
  await createAuthor(strapi);
  
  // Create Articles (after categories, tags, and author exist)
  await createArticles(strapi);
  
  console.log('✅ Initial data setup complete!');
}

async function createCategories(strapi: Core.Strapi) {
  try {
    const existingCategories = await strapi.entityService.findMany('api::category.category');
    
    if (existingCategories.length > 0) {
      console.log('📁 Categories already exist, skipping...');
      return;
    }

    console.log('📁 Creating categories...');
    
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
      console.log(`✅ Created category: ${categoryData.name}`);
    }
  } catch (error) {
    console.error('❌ Error creating categories:', error);
  }
}

async function createTags(strapi: Core.Strapi) {
  try {
    const existingTags = await strapi.entityService.findMany('api::tag.tag');
    
    if (existingTags.length > 0) {
      console.log('🏷️ Tags already exist, skipping...');
      return;
    }

    console.log('🏷️ Creating tags...');
    
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
      console.log(`✅ Created tag: ${tagName}`);
    }
  } catch (error) {
    console.error('❌ Error creating tags:', error);
  }
}

async function createAuthor(strapi: Core.Strapi) {
  try {
    const existingAuthors = await strapi.entityService.findMany('api::author.author');
    
    if (existingAuthors.length > 0) {
      console.log('✍️ Author already exists, skipping...');
      return;
    }

    console.log('✍️ Creating author...');
    
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
    
    console.log('✅ Created author: Riza Rizohman');
  } catch (error) {
    console.error('❌ Error creating author:', error);
  }
}

async function createArticles(strapi: Core.Strapi) {
  try {
    const existingArticles = await strapi.entityService.findMany('api::article.article');
    
    if (existingArticles.length > 0) {
      console.log('📰 Articles already exist, skipping...');
      return;
    }

    console.log('📰 Creating articles...');
    
    // Get existing data for relations
    const categories = await strapi.entityService.findMany('api::category.category');
    const tags = await strapi.entityService.findMany('api::tag.tag');
    const authors = await strapi.entityService.findMany('api::author.author');

    if (categories.length === 0 || tags.length === 0 || authors.length === 0) {
      console.log('⚠️ Missing required data for articles, skipping...');
      return;
    }

    const articles = [
      {
        title: 'Welcome to CloudNow Blog',
        excerpt: 'Welcome to our new blog! We\'re excited to share insights about technology, business, and web development.',
        content: `# Welcome to CloudNow Blog! 🚀

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

*Happy coding!* 👨‍💻`,
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
        content: `# Getting Started with Next.js 14 🎯

Next.js 14 brings exciting new features that make building React applications even more powerful. Let's explore what's new!

## Key Features

### App Router
The new App Router provides a more intuitive way to structure your applications.

### Server Components  
Server Components allow you to render components on the server, improving performance.

## Best Practices

1. **Use TypeScript** for better development experience
2. **Implement proper error handling** with error boundaries
3. **Optimize images** with the built-in Image component
4. **Use dynamic imports** for code splitting

Ready to start building? Let's create something amazing! 🚀`,
        featured: false,
        category: categories[2]?.id, // Tutorials
        tags: [tags[1]?.id, tags[2]?.id, tags[3]?.id], // Next.js, JavaScript, TypeScript
        author: authors[0]?.id,
        seo: {
          metaTitle: 'Getting Started with Next.js 14 - Complete Guide',
          metaDescription: 'Learn Next.js 14 from scratch with our comprehensive guide covering App Router, Server Components, and best practices.'
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
      console.log(`✅ Created article: ${articleData.title}`);
    }
  } catch (error) {
    console.error('❌ Error creating articles:', error);
  }
}