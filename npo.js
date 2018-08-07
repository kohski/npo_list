const client = require("cheerio-httpcli");
const fs = require("fs");
const csv = require("csv");

var url = "http://www.nta.go.jp/taxes/tetsuzuki/shinsei/npo/meibo/03.htm";
var params = {};


client.fetch(url,params,function(err,$,response){
    //エラーだったらメッセージを出す
    if(err){
        console.log("err:"+err);
        return;
    };

    //エラー以外の場合
    const header = {
        name:"法人名称",
        number:"法人番号",
        address:"主たる事務所の所在地",
        rep:"代表者",
        validity:"有効期限"
    };

    // console.log($);
    // console.log($.xml());

    //var body =$.html();

    const stringifier = csv.stringify({header:true,columns:header});
    //const stringifier = csv.("");
    const writeableStream = fs.createWriteStream('npo.csv',{encoding:'utf-8'});
    //stringifier.write(body)


    var accum_txt = "";
    $("td").each(function(idx){
        var text = $(this).text();
        accum_txt += text + ",";
        if((idx+1)%5===0){
            accum_txt += "\n";
        };
    });

    stringifier.write(accum_txt);
    stringifier.pipe(writeableStream);

});



