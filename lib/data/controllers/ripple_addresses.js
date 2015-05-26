var rippleAddressModel = require('../models/ripple_addresses');
// TODO CS this is where the issue must really be. The field 'createdAt' is not properly processed.
function configure(api) {

  api.create = function(opts, fn){
    var model = rippleAddressModel.build(opts);
    var errors = model.validate();

    if (errors) {
      fn(errors, null);
      return;
    }

    if (opts.type === 'hosted' && !opts.tag) {
      fn({ tag: 'hosted requires a tag' }, null);
      return;
    }

    model.save().complete(function(err, ripple_address){
      if (err) {
        fn(err, null);
      } else {
        fn(null, ripple_address);
      }
    }); 
  };

  api.read = function(opts, fn){
    rippleAddressModel.find({ where: opts }).complete(function(err, ripple_address){
      if(err){
        fn(err, null);
      } else if (ripple_address) {
        fn(null, ripple_address);
      } else {
        fn({ id: 'record not found' }, null);
      } 
    });
  };

  api.readAll = function(opts, fn){
    rippleAddressModel.findAll({ where: opts }).complete(function(err, ripple_address){
      if(err){
        fn(err, null);
      } else if (ripple_address) {
        fn(null, ripple_address);
      } else {
        fn({ id: 'record not found' }, null);
      } 
    });
  };

  api.update = function(opts, fn){
    rippleAddressModel.find(opts.id).complete(function(err, ripple_address){
      if (err){
        fn(err, null);
      } else if (ripple_address) {
        delete opts.id;
        ripple_address.updateAttributes(opts).complete(fn);
      } else {
        fn({ id: 'record not found' }, null);
      }
    });
  };

  api.delete = function(opts, fn){
    rippleAddressModel.find(opts.id).complete(function(err, ripple_address){
      var data = ripple_address.toJSON();
      ripple_address.destroy().complete(function(){
        fn(null, data);
      });
    });
  };
  
}

module.exports = configure;

