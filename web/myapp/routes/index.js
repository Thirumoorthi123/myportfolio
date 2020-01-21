var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/',function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("portfolio");
    let d = new Date();
    // get the projects
    dbo.collection('projects').find({}).limit(3).toArray(function(err, projects){
      if (err) throw err;
      console.log(JSON.stringify(projects));
    
// get the posts
      dbo.collection('post').find({}).limit(3).toArray(function(err, post){
        if (err) throw err;
        console.log(JSON.stringify(post));
      db.close();
      res.render('index', { title: 'Portfolio | Mr.Thirumoorthi', 'indexNav': true, projects: projects, post: post});
    })
  })
  });   
 
})
/* GET project page with data*/
router.get('/projects', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("portfolio");
    let d = new Date();
    dbo.collection('projects').find().toArray(function(err, data){
      if (err) throw err;

      console.log(JSON.stringify(data));
      db.close();
      res.render('projects', { title: 'Projects | Mr.Thirumoorthi', 'projectsNav': true, projects: data});
    })
  });
  
});
router.get('/projects/:id', function(req, res){
  let id = req.params.id;
  console.log("myid",id);
  console.log('id --- > ', typeof id); 
  //  once you got the project id
  // make the database call to check if it exists
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("portfolio");
    console.log("myid2",id);
    
    dbo.collection('projects').findOne({"_id":ObjectId(id)},function(err, data){
      if (err) throw err;
      console.log("hii",data);
      db.close();
      res.render('project-detail', { title: 'Projects | Mr.Thirumoorthi', 'projectsNav': true, data: data});
    }) 
  });  
  // if(id < data.length ){
  //   res.render('project-detail', { data : data[id] })
  // }else{
  //   // 404 
  //   console.log('page not found')
  //   res.send('Page not found')
  // }
})
/* GET blog page with data*/
router.get('/blog', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("portfolio");
    let d = new Date();
    dbo.collection('post').find().toArray(function(err, post){
      if (err) throw err;
      console.log(JSON.stringify(post));
      db.close();
      res.render('blog', { title: 'Blog | Mr.Thirumoorthi', 'blogNav': true, post: post});
    })
  });
});
/* GET About page.*/
router.get('/about', function(req, res){
  res.render('about', {title: 'About | Mr.Thirumoorthi', 'aboutNav': true});
})
/* GET Contact page.*/
router.get('/contact', function(req, res){
  res.render('contact', {title: 'Contact | Mr.Thirumoorthi', 'contactNav': true});
})

router.post('/contact', [
    check('email').isEmail().withMessage('Please enter a valid email id'),
    check('mobile').isLength({ min: 10 }).withMessage('Mobile  number must be atleast 10 characters')
  ],
  function(req, res){
    const errors = validationResult(req);
    console.log(JSON.stringify(errors))
    if(!errors.isEmpty()){
      var messages = [];
      errors.errors.forEach(function(err){
        console.log(JSON.stringify(err))
        messages.push(err.msg)
      })
      
      res.render('contact', {errors: true, messages: messages, name, mobile, email, description});
    }else{
      // read the values and save it in the DB
      let name = req.body.name;
      let mobile = req.body.mobile;
      let email = req.body.email;
      let description = req.body.description;

      MongoClient.connect(url,function(err,db){
        if(err)throw err;
        var dbo = db.db('portfolio');
        let contact = {name,mobile,email,description};
        dbo.collection('contact').insertOne(contact, function(err,contactObj){
          if(err)throw err;
            console.log("one document instered. Id ="+contactObj._id);
            db.close();
        })   
      });     
      res.render('contact', {success: true});
    }
})
module.exports = router;
