const mongoose = require('mongoose');

exports.addNewEvent=async(req,res)=>{
    try{
        
    }
    catch(err)
    {
        console.log(err.message);
        res.status(500).json({meesage:err.message})
    }
}
