const { printType } = require("graphql")
const fs = require("fs-extra")
const path = require("path")

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    CommentsJson: {
      post: {
        type: `PostsJson`,
        resolve(source, args, context, info) {
          const allNodes = context.nodeModel.getAllNodes()
          return allNodes
            .filter(node => node.internal.type === "PostsJson")
            .find(page => {
              const parent = allNodes.find(n => n.id === page.parent)
              return parent && parent.name === source.postId
            })
        },
      },
    },
  })
}

const schemaFilePath = path.join(__dirname, "./src/schema.gql")

exports.sourceNodes = async ({ actions }) => {
  const { createTypes } = actions

  if (await fs.exists(schemaFilePath)) {
    const typeDefs = (await fs.readFile(schemaFilePath)).toString()
    createTypes(typeDefs)
  }
}

exports.onPostBootstrap = async ({ store }) => {
  const { schema } = store.getState()
  const types = ["CommentsJson", "PostsJson"]
  const typeDefs = types
    .map(type => printType(schema.getType(type)))
    .join("\n\n")
  await fs.writeFile(schemaFilePath, typeDefs + "\n")
}
