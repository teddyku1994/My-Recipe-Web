module.exports = {
  error:(message) => {
    let error = {error: message}
    return error
  },
  paging:(limit, totalPage, page, data) => {
    let newLimit = (page+1)*limit
    if(totalPage - newLimit > 0) {
      data.page = page+1
    }
    if(Math.floor(totalPage/limit) > 0 && totalPage > limit) {
      data.totalPage = Math.floor(totalPage/limit)
    }
  },
  errorHandling: (error) => {
    
  }
}