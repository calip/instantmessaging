/**
 * Radiogram.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    owner:{
      model:'role'
    },
    sender:{
      model:'role'
    },
    senderDetail: {
      type:'string'
    },
    senderWasdal :{
      type: 'boolean',
      defaultsTo:false,
    },
    receivers:{
      type:'array'
    },
    receiverDetail: {
      type:'string'
    },
    cc:{
      type:'array'
    },
    ccDetail: {
      type:'string'
    },
    author:{
      type: 'string'
    },
    session:{
      model:'Session',
      required : true
    },
    Number: {
      type: 'integer'
    },
    classification:{
      enum:['Biasa', 'Rahasia', 'Sangat Rahasia']
    },
    content: {
      type: 'text'
    },
    howTo:{
      type:'string'
    },
    attachment: {
      collection: 'Attachment',
      via:'radiogram'
    },
    isApproved :{
      type: 'boolean',
      defaultsTo:false,
    },
    approval :{
      model:'rolegroup'
    },
    composeStatus:{
      enum:['inbox','sent','draft','trash','pending'],
      defaultsTo: 'draft'
    },
    readStatus:{
      enum:['read','unread'],
      defaultsTo:'unread'
    },
    materi:{
      type:'array'
    },
    approved:{
      type:'array'
    },
    createTime:{
      type:'datetime'
    },
    SendTime:{
      type:'datetime'
    },
    simtime:{
      type:'datetime'
    },
    folder:{
      model:'Folder'
    },
    panggilan: {
      type:'string'
    },
    jenis: {
      type:'string'
    },
    nomor: {
      type:'string'
    },
    derajat: {
      type:'string'
    },
    instruksi: {
      type:'string'
    },
    alamataksi: {
      type:'string'
    },
    alamattembusan: {
      type:'string'
    },
    cara: {
      type:'string'
    },
    paraf: {
      type:'string'
    },
    tandadinas: {
      type:'string'
    },
    group: {
      type:'string'
    },
    senderName:{
      type:'string'
    },
    senderRank:{
      type:'string'
    },
    parentId:{
      model:'Radiogram'
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
        socket.emit('new_radiogram', data);
      }
      //update data
      if(data.new_val != null && data.old_val != null)
      {
        socket.emit(data.new_val,{action:'update', old_val:data.old_val, new_val:data.new_val});
        socket.emit('new_radiogram', data);
      }
      //delete
      if(data.new_val == null && data.old_val != null)
      {
        socket.emit(data.new_val,{action:'delete', old_val:data.old_val})
      }
    })
  }
  /*,
   getByFolder : function(options, cb)
   {
   Folder.findone(options.id).exec(function(err, thisFolder){
   if (err) return cb(err);
   if (!thisFolder) return cb(new Error('Folder not found.'));
   return Radiogram.find({ where : {folder:thisFolder}, skip:options.offset, limit : options.limit, sort: options.sortBy + ' DESC' })
   });
   },
   getByTimeInterval : function(options, cb)
   {
   return Radiogram.find({ where : {SendTime:{ '>': new Date(options.startDate), '<': new Date(options.endDate) }}, skip:options.offset, limit : options.limit, sort: options.sortBy + ' DESC' })
   },
   getByUser : function(userid, cb)
   {

   },
   getByContent : function(options, cb)
   {

   },
   getById : function(id, cb)
   {

   },

   */
};

