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
      await configurePublicPermissions(strapi);
    } catch (error) {
      console.error('❌ Bootstrap error:', error);
    }
  },
};

async function configurePublicPermissions(strapi: Core.Strapi) {
  try {
    console.log('🔐 Configuring public permissions...');
    
    // Get the public role
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      console.log('❌ Public role not found');
      return;
    }

    // Define permissions for content types
    const permissions = [
      { action: 'api::article.article.find', subject: null },
      { action: 'api::article.article.findOne', subject: null },
      { action: 'api::category.category.find', subject: null },
      { action: 'api::category.category.findOne', subject: null },
      { action: 'api::tag.tag.find', subject: null },
      { action: 'api::tag.tag.findOne', subject: null },
      { action: 'api::author.author.find', subject: null },
      { action: 'api::author.author.findOne', subject: null },
    ];

    // Create or update permissions
    for (const permission of permissions) {
      try {
        // Check if permission already exists
        const existingPermission = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({
            where: {
              action: permission.action,
              role: publicRole.id,
            },
          });

        if (!existingPermission) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({
              data: {
                action: permission.action,
                subject: permission.subject,
                properties: {},
                conditions: [],
                role: publicRole.id,
              },
            });
          console.log(`✅ Created permission: ${permission.action}`);
        } else {
          console.log(`ℹ️ Permission already exists: ${permission.action}`);
        }
      } catch (error) {
        console.error(`❌ Error creating permission ${permission.action}:`, error);
      }
    }

    console.log('✅ Public permissions configured successfully!');
  } catch (error) {
    console.error('❌ Error configuring permissions:', error);
  }
}

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
      { name: 'Technology', slug: 'technology', description: 'Latest technology trends and insights' },
      { name: 'Business', slug: 'business', description: 'Business strategies and entrepreneurship' },
      { name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides and tutorials' },
      { name: 'Design', slug: 'design', description: 'UI/UX design and creative content' }
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
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'CSS', slug: 'css' },
      { name: 'HTML', slug: 'html' },
      { name: 'Node.js', slug: 'nodejs' },
      { name: 'API', slug: 'api' },
      { name: 'Database', slug: 'database' },
      { name: 'Tutorial', slug: 'tutorial' },
      { name: 'Guide', slug: 'guide' },
      { name: 'Tips', slug: 'tips' },
      { name: 'Frontend', slug: 'frontend' },
      { name: 'Backend', slug: 'backend' },
      { name: 'Full-stack', slug: 'fullstack' },
      { name: 'Web Development', slug: 'web-development' }
    ];

    for (const tagData of tags) {
      await strapi.entityService.create('api::tag.tag', {
        data: {
          ...tagData,
          publishedAt: new Date()
        }
      });
      console.log(`✅ Created tag: ${tagData.name}`);
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
        slug: 'riza-rizohman',
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
        slug: 'welcome-to-cloudnow-blog',
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
        slug: 'getting-started-with-nextjs-14',
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