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
          return context.nodeModel.getNodeById({ id: source.postId })
        }
      }
    }
  })
}
