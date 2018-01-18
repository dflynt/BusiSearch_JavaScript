var Search = {
    stockListDict: {},
    matches: [],
    noDupesMatches: [],
    webPageText:[],
}
function checkBusiness(line, index, name, counter) {
    name = name.lower();
    if(counter != 5) {
        if(index == 0){
        }
    }
}
function analyze() {
    for(var line = 0; line < Search.webPageText.length; line++) {
        for(var word = Search.webPageText.length - 1; word >= 0; word--) {
            line[word] = line[word].replace("\'s", ""); //parses noun possession
            //checkBusiness(line in <p>, index of line, company name, counter)
            checkBusiness(line, word, line[word], 0);
        }
    }
}
function returnMatches() {return noDupesMatches;}

function onReadyStateChange() {
    var stockList = this.responseText; //list of stocks from .txt file, separated by \n
    stockList = stockList.split("\n");

    for(var i = 0; i < stockList.length; i++) {
        var stock = stockList[i].split(", "); //Key: Symbol  Value: Name
        Search.stockListDict[stock[0]] = stock[1].replace("\n", "");
    }
    console.log(Search.stockListDict);
}
function onReadyHTMLStateChange(){
    console.log("On ready html");
    $(document).ready(function() {
        $("p").each(function(index) {
            Search.webPageText.push($(this).text().replace("\n", ""));
        });
    });
    console.log(Search.webPageText);
}
var file = new XMLHttpRequest();
file.addEventListener("load", onReadyStateChange);
file.open("GET", "http://localhost:8080/Stocks.txt"), true;
file.send();

var textHTML = new XMLHttpRequest();
textHTML.addEventListener("load", onReadyHTMLStateChange);
textHTML.open("GET", "http://localhost:8080/htmlEx.html"), true;
textHTML.send();

analyze();