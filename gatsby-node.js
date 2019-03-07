/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    CommentsJson: {
      post: {
        type: `PostsJson`,
        resolve (source, args, context, info) {
          const allNodes = context.nodeModel.getAllNodes()
          return allNodes
            .filter(node => node.internal.type === 'PostsJson')
            .find(page => {
              const parent = allNodes.find(n => n.id === page.parent)
              return parent && parent.name === source.postId
            })
        }
      }
    }
  })
}
