var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
mongoose.connect('mongodb://localhost/enctest');

var db = mongoose.connection;

db.on('error', function(err){
    console.log('connection error', err);
});

db.once('open', function(){
    console.log('connected.');
});

var Schema = mongoose.Schema;
var userSchema = new Schema({
    name:String,
    password:String
});



var User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash;
            next();
        });
    });
});

var raja = new  User({
    name: "admin",
   password: "test123"
});

raja.save(function(err, data){
    if(err) console.log(error);
    else console.log ('Saved:' , data);
});

