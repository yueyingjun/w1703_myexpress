var express=require("./express.js");
var mysql=require("mysql");
var app=express();
var db=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'w1703_blog'
});
db.connect();

app.get("/",function(req,res){
    db.query("select * from user",function(err,result){

        res.render("index.ejs",{data:result});
    })

})

app.get("/list/:id",function(req,res){

      var id=req.id;
      db.query("select * from user where uid="+id,function(err,result){
          res.render("list.ejs",{info:result})
      })
        ;
})



app.listen(8888,function(){
    console.log("start...")
})







