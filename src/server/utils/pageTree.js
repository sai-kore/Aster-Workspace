import Page from '../models/Page.js'

// Breadth-first walk of a page's subtree. `deleted` filters which children are matched.
const collectDescendantIds = async (ownerId, rootId, deleted) => {
  const ids = []
  let frontier = [rootId]
  let guard = 0
  while (frontier.length && guard++ < 25) {
    const children = await Page.find({
      owner: ownerId,
      isDeleted: deleted,
      parentPage: { $in: frontier },
    })
      .select('_id')
      .lean()
    frontier = children.map((child) => child._id)
    ids.push(...frontier)
  }
  return ids
}

export default collectDescendantIds