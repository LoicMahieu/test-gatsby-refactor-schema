const _ = require(`lodash`)
const path = require(`path`)

async function onCreateNode (
  { node, actions, loadNodeContent, createNodeId, createContentDigest },
  pluginOptions
) {
  function getType ({ node, object, isArray }) {
    if (pluginOptions && _.isFunction(pluginOptions.typeName)) {
      return pluginOptions.typeName({ node, object, isArray })
    } else if (pluginOptions && _.isString(pluginOptions.typeName)) {
      return pluginOptions.typeName
    } else if (node.internal.type !== `File`) {
      return _.upperFirst(_.camelCase(`${node.internal.type} Json`))
    } else if (isArray) {
      return _.upperFirst(_.camelCase(`${node.name} Json`))
    } else {
      return _.upperFirst(_.camelCase(`${path.basename(node.dir)} Json`))
    }
  }

  function transformObject (obj, id, type) {
    const data = pluginOptions.transform ? pluginOptions.transform(obj) : obj

    const jsonNode = {
      ...data,
      id,
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(data),
        type
      }
    }
    createNode(jsonNode)
    createParentChildLink({ parent: node, child: jsonNode })
  }

  const { createNode, createParentChildLink } = actions

  // We only care about JSON content.
  if (node.internal.mediaType !== `application/json`) {
    return
  }

  if (pluginOptions.only && !pluginOptions.only(node)) {
    return
  }

  const createId = pluginOptions.createNodeId || ((node, originalNode, index) => {
    if (typeof index === 'undefined') {
      return node.id ? node.id : createNodeId(`${originalNode.id} >>> JSON`)
    } else {
      return node.id ? node.id : createNodeId(`${originalNode.id} [${index}] >>> JSON`)
    }
  })

  const content = await loadNodeContent(node)
  const parsedContent = JSON.parse(content)

  if (_.isArray(parsedContent)) {
    parsedContent.forEach((obj, i) => {
      transformObject(
        obj,
        createId(obj, node, i),
        getType({ node, object: obj, isArray: true })
      )
    })
  } else if (_.isPlainObject(parsedContent)) {
    transformObject(
      parsedContent,
      createId(parsedContent, node),
      getType({ node, object: parsedContent, isArray: false })
    )
  }
}

exports.onCreateNode = onCreateNode
