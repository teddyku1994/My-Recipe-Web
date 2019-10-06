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
  errorHandling: (error, res) => {
    if(error instanceof TypeError) {
      console.log("TypeError", error)
      res.status(400).json('Bad Request')
    } else if(error instanceof SyntaxError) {
      console.log("SyntaxError", error)
      res.status(400).json('Bad Request')
    } else if(error instanceof RangeError) {
      console.log("RangeError", error)
      res.status(400).json('Bad Request')
    } else if (error instanceof ReferenceError) {
      console.log("ReferenceError", error)
      res.status(400).json('Bad Request')
    } else if(error instanceof ER_BAD_FIELD_ERROR) {
      console.log("ER_BAD_FIELD_ERROR", error)
      res.status(400).json('Bad Request')
    } else {
      console.log("Others", error)
      res.status(500).json('Internal Server Error')
    }
  }
}