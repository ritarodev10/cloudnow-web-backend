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
  },
};