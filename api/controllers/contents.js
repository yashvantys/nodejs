const Content = require('../../models/Content.js')
const bcrypt = require('bcrypt-nodejs')


// get All Contents
exports.contents_get_all =  async (req, res, next)=>{
    try {
            var result = []
            // get values from req
    	    //var sort_column = null
	    	var start = req.body.start
	    	var limit = req.body.length
	    	var sort_column_index = req.body.order[0]['column']
	    	var sort_column = req.body.columns[sort_column_index]['data']
	    	var direction = req.body.order[0]['dir']
            var search = req.body.search['value']
            var orderbyasc = 1
             
            result['draw'] = req.body.draw
            if(direction == 'desc')
                orderbyasc = -1
            var query = {}             
             
	    	if(search !='')
                query  = {  $or: [{ title: new RegExp(search, 'i')}, { description: new RegExp(search, 'i')}] } 
                            
            var sortColumn = {}
            sortColumn[sort_column] = orderbyasc
            var contents = await Content.find(query, '__v').sort(sortColumn).limit(limit).skip(start)
            var TotalContents = await Content.find(query).count({})                   
            res.send({statusCode: 200, message: 'success', contents, recordsTotal:TotalContents})
               
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }    
}