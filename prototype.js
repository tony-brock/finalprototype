var dur = 500;

var RecalculateScales = function(money, lengths)
{
//make Incomes an array
var getIncomes = function(entry)
    {
        return entry.Income
    };
var Incomes = money.map(getIncomes);
console.log("Incomes", Incomes);
//make scores an array   
var getThree = function(entry)
    {
        return entry.Big_Three
    };
var big_Three = money.map(getThree);
console.log("Big Three", big_Three);
//make self rates an array
var getFinance = function(entry)
    {
        return entry.Financial_Matters
    };
var finance = money.map(getFinance);
console.log("Financial Matters Scores", finance);
    
    var xBase = d3.scaleBand()
            .domain(Incomes)
            .range([0,lengths.graph.width])
            .paddingInner(.5);
    
    var xBars = d3.scaleBand()
            .domain(big_Three,finance)
            .range([0,(lengths.graph.width/8)])
    
    var y1 = d3.scaleLinear()
            .domain([0,1])
            .range([lengths.graph.height,0]);
    
    var y2 = d3.scaleLinear()
            .domain([1,7])
            .range([lengths.graph.height,0]);
    
    return {xBase:xBase, xBars:xBars, y1:y1, y2:y2};
};

var updateGraph = function(target,money,lengths, Incomes, big_Three, Finance)
{
    var scales = RecalculateScales(money,lengths);
    var xBase = scales.xBase;
    var xBars = scales.xBars;
    var y1 = scales.y1;
    var y2 = scales.y2;
    
    updateAxes(target,xBase,xBars,y1,y2)
    
    var rects = d3.select(target)
        .select(".graph")
        .selectAll("rect")
        .data(money)
    //might need accessor
    rects.enter()
        .append("rect")
    
    rects.exit()
        .remove()
    
    d3.select(target)
        .select(".graph")
        .selectAll("rect")
        .transition()
        .duration(500)
        .attr("x", xBars(big_Three))
        .attr("y", y1(big_Three))
        .attr("width", xBars.bandwidth)
        .attr("height", function(entry)
        {
            return lengths.graph.height - y1(entry.Big_Three);
        })
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "green") 
    
    d3.select(target)
        .select(".graph")
        .selectAll("rect")
        .transition()
        .duration(500)
        .attr("x", xBars(Finance))
        .attr("y", y2(Finance))
        .attr("width", xBars.bandwidth)
        .attr("height", function(entry)
        {
            return lengths.graph.height - y1(entry.Big_Three);
        })
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "orange") 
};

var createLabels = function(lengths,target)
{
    var labels = d3.select(target)
        .append("g")
        .classed("labels", true)
    
    labels.append("text")
        .attr("id", "graphtitle")
        .text("Income")
        .classed("title", true)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90)")
};
    
var initAxes = function(lengths, target)
{
    var axes = d3.select(target)
        .append("g")
        .classed("class", "axis")
    
    axes.append("g")
        .attr("id","xAxis")
        .attr("transform","translate("+lengths.margins.left+","
             +(lengths.margins.top+lengths.graph.height)+")")
    
    axes.append("g")
        .attr("id","leftAxis")
        .attr("transform","translate("+(lengths.margins.left-5)+","
             +(lengths.margins.top)+")")
    
    axes.append("g")
        .attr("id", "rightAxis")
        .attr("transform", "translate("+(lengths.margins.left+lengths.graph.width)+","+(lengths.margins.top)+")")
};

var updateAxes = function(target,xBase,y1,y2)
{
    var xAxis = d3.axisBottom(xBase)
    var yLeft = d3.axisLeft(y1)
    var yRight = d3.axisRight(y2)
    
    d3.select("#xAxis")
        .transition()
        .duration(dur)
        .call(xAxis)
    
    d3.select("#leftAxis")
        .transition()
        .duration(dur)
        .call(yLeft)
    
    d3.select("#rightAxis")
        .transition()
        .duration(dur)
        .call(yRight)
}

var initGraph = function(target, money)
{
    var screen = {width:900, height:400}
    var margins = {top:25, bottom:40, left:75, right:75}
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    var lengths = {
        screen:screen,
        margins:margins,
        graph:graph,
    }
    
    d3.select(target)
        .attr("width", screen.width)
        .attr("height", screen.height)
    
    var g = d3.select(target)
        .append("g")
        .classed("graph", true)
        .attr("transform", "translate("+margins.left+","+margins.top+")");
    
    initAxes(lengths, target);
    updateGraph(target, money, lengths);
};

var Incomes = function(money)
{
    return money.Incomes
}


var tablePromise = d3.csv("IncomeData.csv")
tablePromise.then(function(money)
{
    console.log("money", money);
    console.log(money[0].Income);
    console.log(money[0].Big_Three);
    console.log(money[0].Financial_Matters);
    console.log(money.columns[0]);
    initGraph("svg",money);
},
function(err)
{
    console.log("Error", err)
});