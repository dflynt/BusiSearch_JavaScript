var Search = {
    stocksDict: {},
    matches: [],
    noDupesMatches: [],
    webPageText:[],
}

$(document).ready(function() {

    function onReadyStateChange() {
        var stockList = this.responseText; //list of stocks from .txt file, separated by \n
        stockList = stockList.split("\n");
    
        for(var i = 0; i < stockList.length; i++) {
            var stock = stockList[i].split(", "); //Key: Symbol  Value: Name
            Search.stocksDict[stock[0].trim()] = stock[1].replace("\n", "").trim();
        }
        console.log(Search.stocksDict);
        analyze();
        console.log(returnNoDupes());
        makeAPICall(Search.noDupesMatches);
    }

    function onReadyHTMLStateChange(){
        $(document).ready(function() {
            $("p").each(function(index) {
                Search.webPageText.push($(this).text());
            });
        });
    }
    
    var file = new XMLHttpRequest();
    file.addEventListener("load", onReadyStateChange);
    file.open("GET", "http://localhost:8080/Stocks.txt"), true;
    file.send();
    
    
    var textHTML = new XMLHttpRequest();
    textHTML.addEventListener("load", onReadyHTMLStateChange);
    textHTML.open("GET", "http://localhost:8080/htmlEx.html"), true;
    textHTML.send();
    
    function checkBusiness(dict, line, index, name, counter) {
        name = name.toLowerCase().trim();
        if (counter != 5) {
            if(index == 0){
                for(var key in dict) {
                    if(dict.hasOwnProperty(key)) {
                        if(dict[key] === name) {
                            Search.matches.push(name);
                        }
                    }
                }
            }
            else if(checkBusiHelper(name)){
                Search.matches.push(name);
                //console.log(matches);
                return;
            }
            else {
                checkBusiness(dict, line, index - 1, line[index - 1] + " " + name, counter + 1);
            }
        }
        else{
            return null;
        }
        function checkBusiHelper(name) {
            for(var k in dict) {
                if(dict.hasOwnProperty(k)) {
                    if(dict[k] === name) {
                        return true;
                    }
                    //8 hours of troubleshooting and it was this line that was causing errors in parsing
                    //time to go play in traffic
                    //return false;
                }
            }
            return false;
        }
    }
    function analyze() {
        Search.webPageText.forEach(function(line) { //for each line in a <p> tag
            line = line.toLowerCase();
            line = line.split(" "); //turn into a list to check each word
            //console.log(line);
            for(var index = line.length - 1; index >= 0; index--) { //for each word in the line
                //console.log(line + " " + index + " " + line[index], 0);
                line[index] = line[index].replace("\'s", "").trim(); //parses noun possession
                //checkBusiness(line in <p>, index of line, company name, counter)
                //console.log(line + " " + index + " " + line[index]);
                checkBusiness(Search.stocksDict, line, index, line[index].trim(), 0);
            } 
        });

        for(var match in Search.matches) { //for each match found in the page
            for(var stock in Search.stocksDict) { //for each stock in the stocksDict dictionary
                if(Search.matches[match] === Search.stocksDict[stock]) { //hey, it's an actual stock
                    //get company's symbol as the key for api requests and val is the company name
                    Search.noDupesMatches[stock] = Search.matches[match]; 
                }
            }   
        }
    }
    function returnNoDupes() {return Search.noDupesMatches;}
    
    function makeAPICall(dictMatches) {
        var filters = "&types=quote&filter=symbol,companyName,open,close,change,changePercent";
        var address = "https://api.iextrading.com/1.0/stock/market/batch?symbols=";
        var symbols = "";
        for(var match in dictMatches){
            //symbols = symbols + "," + match yields comma at the beginning
            console.log(match);
            symbols = symbols + "," + match;
        }
        address = address + symbols + filters;
        console.log(address);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", address, false);
        xhr.send();
        var results = xhr.responseText;
        var parsedResults = JSON.parse(results);
        var stockContainerDiv = document.getElementById("StockContainer");
        for(var stock in parsedResults) {
            console.log(parsedResults[stock]);
            var childDiv = document.createElement("div");
            childDiv.innterHTML = parsedResults[stock]; 
        }
    }
});