/**
 * Created by TES on 5/12/2016.
 */
module.exports = {
    attributes: {
      name:{
        type: 'string'
      },
      color:{
        type: 'string'
      },
      scenario:{
        model:'scenario'
      }
    },
    onChange : function(err, cursor)
    {
      var socket = this;
  
      cursor.each(function(err,data){
        //new data
        if(data.new_val != null && data.old_val == null)
        {
          socket.emit(data.new_val,{action:'create', new_val:data.new_val});
          socket.emit('new_team', data);
        }
        //update data
        if(data.new_val != null && data.old_val != null)
        {
          socket.emit(data.new_val,{action:'update', old_val:data.old_val, new_val:data.new_val})
          socket.emit('update_team', data);
        }
        //delete
        if(data.new_val == null && data.old_val != null)
        {
          socket.emit(data.old_val,{action:'delete', old_val:data.old_val})
        }
      })
    }
  };
  