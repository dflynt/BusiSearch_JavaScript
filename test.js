function Search(){
    var text = "";
    var matches = [];
    var noDupesMatches = [];
}
Search.prototype.stocks = function(){
    var file = new XMLHttpRequest();
    file.onreadystatechange = function() {
        if(file.readyState === 4)
        {
            if(file.status === 200 || file.status == 0)
            {
                var allText = file.responseText;
                console.log(allText);
                return allText;
            }
        }
        else{
            console.log("false");
        }
    }
    file.open("GET", "file:///Users/dannyflynt/BusiSearch_JavaScript/Stocks.txt"), true;
    file.send();
}
Search.prototype.checkBusiness = function(line, index, name, counter) {
        name = name.lower();
        if(counter != 5) {
            if(index == 0){

            }
        }
}
Search.prototype.analyze = function(){

}
Search.prototype.returnMatches = function() {return noDupesMatches;}

var search = new Search();
console.log(search.stocks());