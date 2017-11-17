var http=require("http");
var fs=require("fs");
const path=require("path");
const ejs=require("./ejs.js");
class server{
    constructor(){
        this.getInfo={};
        this.staticDir="static";
        this.type=".css,.js,.html,.png,.gif,.jpg";
        this.template="view";
    }
    listen(port,callback){
        var that=this;
        http.createServer(function(req,res){
            that.done(req,res);
        }).listen(port,function(){
            if(callback) {
                callback()
            }

        })
    }
    get(url,callback){
        var arr=url.match(/:[^\/]+/g)||[];
        arr=arr.map(function(obj){
            return obj.slice(1);
        });
        var reg="/^"+url.replace(/:[^\/]+/g,"([^\/]+)").replace(/\//g,"\\/")+"\\/?$/";

        this.getInfo[reg]={};
        this.getInfo[reg].callback=callback;
        this.getInfo[reg].attr=arr;

    }


    done(req,res){

         var flag=true;
        if(req.url!="/favicon.ico") {
            var reqUrl=req.url;

            res.send = function (str) {
                res.write(str);
                res.end();
            }
            res.sendFile=function(fileurl){
                var realurl=path.resolve("./");

                var fullPath=path.join(realurl,fileurl)
                /**/
                fs.createReadStream(fileurl).pipe(res);
            }

            var that=this;
            res.render=function(url,data){
                    var realpath=path.resolve("./");
                    var tplurl=path.join(realpath,that.template,url);
                    console.log(tplurl);
                    fs.readFile(tplurl,function(err,con){

                        res.write(ejs(con.toString(),data));
                        res.end();

                    })
            }

            var ext=path.extname(reqUrl);
            if(ext&&this.type.indexOf(ext)>-1){

                var realurl=path.resolve(this.staticDir);

                console.log(reqUrl);
                var fullpath=path.join(realurl,reqUrl);


                console.log(fullpath);
                fs.stat(fullpath,function(err){
                    if(err){
                        res.writeHead(404);
                        res.end("文件找不到");
                    }else{
                        fs.createReadStream(fullpath).pipe(res);
                    }
                })


            }else {


                for (var i in this.getInfo) {
                    if (eval(i).test(reqUrl)) {
                        flag = false;
                        var result = eval(i).exec(reqUrl);
                        for (var j = 0; j < this.getInfo[i].attr.length; j++) {

                            req[this.getInfo[i].attr[j]] = result[j + 1];
                        }

                        this.getInfo[i].callback(req, res);
                    }
                }
                if (flag) {
                    res.setHeader("content-type", "text/html;charset=utf-8");
                    res.end("迷路了");
                }

            }


        }
    }
}
module.exports=function(){
    return new server();
}