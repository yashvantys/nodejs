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
            var contents = await Content.find(query, '-__v').sort(sortColumn).limit(limit).skip(start)
            //console.log("contents: " +contents)
            var TotalContents = await Content.find(query).count({})                   
            res.send({statusCode: 200, message: 'success', contents, recordsTotal:TotalContents})
               
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }    
}

// create new content
exports.create_content = (req, res)=>{
    var contentData = req.body;
    var content = new Content(contentData)               
    content.save((err, newContent) => {
        if(err){
            return res.status(500).send({message: 'Error saving Content'})
        }
    return res.status(200).send({statusCode: 200, message:'Content added successfully'})
    })       
}

// update content
exports.update_content = (req, res)=>{
    Content.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, updateContent) {
        if(err){
            return res.status(500).send({message: 'Error updating Content'})
        }
        return res.status(200).send({statusCode: 200, message:'Content updated successfully'})
    })
   
}

// delete content
exports.delete_content = (req, res, next) => {
    /*Content.remove({_id: req.params.id})
    .exec()
    .then(result => {
        res.status(200).send({statusCode: 200, message:'Content deleted successfully'})
    })
    .catch(err =>{
        res.status(500).send({message: 'Error deleting Content'})
    })*/
    let flag = req.params.status
    var msg = 'Activate'
    if(flag == 0)
        msg = 'Inactivate' 
    Content.findByIdAndUpdate(req.params.id, {$set: {active: req.params.status}}, function (err, updateContent) {
        if(err){
            return res.status(500).send({message: 'Error '+ this.msg +' Content'})
        }
        return res.status(200).send({statusCode: 200, message:'Content '+ this.msg +' successfully'})
    })   
}