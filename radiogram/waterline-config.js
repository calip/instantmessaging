module.exports = {
  waterline : {
    adapters: {
      'mongo': require('sails-mongo')
    },
    connections: {
      local: {
        adapter: 'mongo',
        host: 'mongomain.db.soyut',
        port: 27017,
        database: 'soyut_radiogram'
      }
    },
    defaults: {
      migrate: 'alter'
    }
  }
};
