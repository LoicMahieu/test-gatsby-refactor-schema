module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
    {
      resolve: `transformer-json`,
      options: {
        only: node => node.sourceInstanceName === 'Comment',
        typeName: () => 'CommentsJson',
        transform: obj => ({
          ...obj,
          post___NODE: obj.postId
        }),
        createNodeId: (node, originalNode) => originalNode.name
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'Comment',
        path: `${__dirname}/data/comments`,
      }
    },

    {
      resolve: `transformer-json`,
      options: {
        only: node => node.sourceInstanceName === 'Post',
        typeName: () => 'PostsJson',
        createNodeId: (node, originalNode) => originalNode.name
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'Post',
        path: `${__dirname}/data/posts`,
      }
    }

  ],
}
