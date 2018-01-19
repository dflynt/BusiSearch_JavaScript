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
        analyze(); //Why does calling analyze() here work but not in onReadyHTMLStateChange() ???
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
        console.log(Search.matches)
        for(var match in Search.matches) { //for each match found in the page
            for(var stock in Search.stocksDict) { //for each stock in the stocksDict dictionary
                if(match === Search.stocksDict[stock]) { //hey, it's an actual stock
                    Search.noDupesMatches[stock] = match;
                }
            }   
        }
    }

    function returnMatches() {return Search.noDupesMatches;}

});