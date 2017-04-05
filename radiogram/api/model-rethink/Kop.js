/**
 * Radiogram.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    title:{
      type:'string'
    },
    scenario:{
      model:'scenario',
      required : true
    }
  },
  getById : function(id, cb)
  {

  },
  onChange : function(err, cursor)
  {
    var socket = this;

    cursor.each(function(err,data){
      //new data
      if(data.new_val != null && data.old_val == null)
      {
        socket.emit(data.new_val,{action:'create', new_val:data.new_val});
        socket.emit('new_kop', data);
      }
      //update data
      if(data.new_val != null && data.old_val != null)
      {
        socket.emit(data.new_val,{action:'update', old_val:data.old_val, new_val:data.new_val})
      }
      //delete
      if(data.new_val == null && data.old_val != null)
      {
        socket.emit(data.new_val,{action:'delete', old_val:data.old_val})
      }
    })
  }
};

