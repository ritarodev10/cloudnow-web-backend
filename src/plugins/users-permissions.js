module.exports = {
  config: {
    jwt: {
      expiresIn: '7d',
    },
  },
  bootstrap: async ({ strapi }) => {
    // Force enable public permissions for content types
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
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

      for (const permission of permissions) {
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
          })
          .catch(() => {
            // Permission might already exist, ignore error
          });
      }

      console.log('✅ Public permissions configured for content types');
    }
  },
};
