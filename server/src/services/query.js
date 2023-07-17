DEFAULT_PAGE_NUMBER = 1;
DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; // max number of results in a page
  const skip = (page - 1) * limit; //Skip defines how many documents
  //   we're skipping over and the result from our database.

  return {
    skip,
    limit,
  };
}

module.exports = { getPagination };
