 
//MODAL



// var $modal = $('#modal-container');

// $("#modal-open").click(function(){
//   $modal.addClass('open');
// })

// $(".modal-close").click(function(){
//   $modal.removeClass('open');
// });


//END MODAL



var height = document.getElementById('viewport').clientHeight;
//alert("height max : " + height)
height = height * 0.95;

var width = document.getElementById('viewport').clientWidth;
var s = height * width;
//alert("height: " + height + " width: " + width);
var height1 = window.innerHeight
 || document.documentElement.clientHeight
 || document.body.clientHeight;

var width1 = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
//alert("height1 : " + height1);
//alert("width1 : " + width1);
// function viewH (){
//   var height = window.innerHeight
//   || document.documentElement.clientHeight
//   || document.body.clientHeight;
//   height = height - 10;
// alert("height : " + height);
// return height;
// };
//
// function viewW(){
//
//   var width = window.innerWidth
//   || document.documentElement.clientWidth
//   || document.body.clientWidth;
//  width = width - 10;
//   alert("width : " + width);
//   return width;
// }

//
// Paid px, have to get from DB or by calculation
var sP = 20425;
//var sP = 40850;
// height and width ratio of browser window
var k = Math.round((width / height) * 100) / 100;
// height of paid area
var heightP = Math.sqrt(sP / k);
// the ratio between window height and paid height/ 15-???
//alert("height : " + height + "heightP: " + heightP )
var kP = height / (heightP + 14);
//alert("multiplication :" + kP);
//width of paid area
var widthP = heightP * k;
//alert("heightP: " + heightP + " widthP: " + widthP);
//enlarger cell side - base is 5px
var cellSide = Math.floor(5 * kP);

cellSide = cellSide + "px";
alert("cellSide : " + cellSide);

var cellPercent = Math.round(cellSide / (height / 100) * 1000) / 1000;
cellPercent = cellPercent + "vh";
//number of cells horizontally + 2px for gap(?)
var colNum = Math.floor(width / cellSide + 2);
//alert("colNum : " + colNum);

//Load in character data

d3.json("https://gist.githubusercontent.com/andybarefoot/172ebdb29e781a71625753ab02f4920d/raw/ced130d481e3b363fa053bffc37034139eb1e670/chars.json", function(data) {
//alert("It's D3!")
  grid = d3.select("div.mycontent")
    .append("div")
    .attr("id", "grid")
    .attr("class", "grid")
   //.style("height", divHeight())
   //  .style("width", viewW())
  ;

  chars = grid
    .selectAll("div")
    .data(data.characters)
    .enter()
    .append("div")
    .attr("class", "char")
    .attr("title", function(d,i){
      return d.charName;
    })

  ;

  chars
    .style("background-image", function(d){
      return 'url("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/got/images/sigil/'+d.charSigil+'?raw=true")';
    })
  ;
  content = chars
     .append("div")
     .attr("class", "charContent")
  ;
  // content
  //    .append("h2")
  //    .text(function(d,i){
  //       return d.charName;
  //    })
  // ;
  chars
    .filter(function(d){ return d.totalAppearances > 1; })
		.classed("size1", true)
    .filter(function(d){ return d.totalAppearances > 5; })
		.classed("size1", false)
		.classed("size2", true)
    .filter(function(d){ return d.totalAppearances > 10; })
		.classed("size2", false)
		.classed("size3", true)
    .filter(function(d){ return d.totalAppearances > 30; })
		.classed("size3", false)
		.classed("size4", true)
    .filter(function(d){ return d.totalAppearances > 50; })
		.classed("size4", false)
		.classed("size5", true)
  ;
  chars
    .on("click", function(d, i) {
      if(this.className.split(' ').indexOf('open') > -1 ){
        d3.select(this).classed("open", false);
      }else{
        gridColumns = window.getComputedStyle(this.parentElement).gridTemplateColumns.split(" ");
        gridRows = window.getComputedStyle(this.parentElement).gridTemplateRows.split(" ");
        numColumns = gridColumns.length;
        numRows = gridRows.length;
        xPosInGrid = this.getBoundingClientRect().left - this.parentElement.getBoundingClientRect().left;
        yPosInGrid = this.getBoundingClientRect().top - this.parentElement.getBoundingClientRect().top;
        gridRowHeight = parseFloat(gridRows[0]) + parseFloat(window.getComputedStyle(this.parentElement).gridRowGap);
        gridColumnWidth = parseFloat(gridColumns[0]) + parseFloat(window.getComputedStyle(this.parentElement).gridColumnGap);
        thisRow = Math.round(yPosInGrid/gridRowHeight) +1;
        thisColumn = Math.round(xPosInGrid/gridColumnWidth) +1;
        thisPortrait = this.getElementsByClassName("portrait")[0];
        if(thisPortrait)thisPortrait.setAttribute("src",thisPortrait.getAttribute("data-src"));
        d3.selectAll(".char").classed("open", false);
        d3.selectAll(".char").style("grid-row-start", "auto");
        d3.selectAll(".char").style("grid-column-start", "auto");
        d3.select(this).classed("open", true);
        divWidth = parseFloat(window.getComputedStyle(this).gridColumnEnd.split(" ")[1]);
        divHeight = parseFloat(window.getComputedStyle(this).gridRowEnd.split(" ")[1]);
        if(thisRow+divHeight>numRows)thisRow = 1 + numRows-divHeight;
        if(thisColumn+divWidth>numColumns)thisColumn = 1 + numColumns-divWidth;
        d3.select(this).style("grid-row-start", thisRow)
        d3.select(this).style("grid-column-start", thisColumn)
      }
    })
  ;

  details = content
     .append("div")
     .attr("class", "details")
  ;
//
//   imageHolder = details
//    .filter(function(d){ return d.charThumb != ""; })
//    .append("div")
//    .attr("class", "imageHolder")
//   ;
//   imageHolder
//    .append("img")
//    .attr("class","portrait")
//    .attr("data-src", function(d,i){
//       return "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/got/images/char"+d.charID+".png";
//    })
//   ;
bio = details
    .append("div")
    .attr("class", "bio")
  ;
  bio
    .append("h3")
    .attr("class", "bioLink")
    .append("a")
    .attr("href", function(d){ return d.charURL })
    .attr("target", "_blank")
    .text(function(d,i){
      return d.charName;
    })
  ;

  tippy('.char', {
  placement: 'right',
  animation: 'scale',
  duration: [1000, 300],
  arrow: true,
  size: 'large'
  });

  // bio
  //   .filter(function(d){ return d.charAllegiance != ""; })
  //   .append("h4")
  //   .text("Allegiance:")
  // ;
  bio
    .filter(function(d){ return d.charAllegiance != ""; })
    .append("span")
    .text(function(d,i){
      d.charAllegiance = d.charAllegiance + " " + d.charAllegiance + " " + d.charAllegiance;
      return d.charAllegiance;
   })
  ;
//   bio
//     .filter(function(d){ return d.charCulture != ""; })
//     .append("h4")
//     .text("Culture:")
//   ;
//   bio
//     .filter(function(d){ return d.charCulture != ""; })
//     .append("span")
//     .text(function(d,i){
//       return d.charCulture;
//     })
//   ;
//   bio
//     .filter(function(d){ return d.charOrigin != ""; })
//     .append("h4")
//     .text("Origin:")
//   ;
//   bio
//     .filter(function(d){ return d.charOrigin != ""; })
//     .append("span")
//     .text(function(d,i){
//       return d.charOrigin;
//     })
//   ;
//   bio
//     .filter(function(d){ return d.charReligion != ""; })
//     .append("h4")
//     .text("Religion:")
//   ;
//   bio
//     .filter(function(d){ return d.charReligion != ""; })
//     .append("span")
//     .text(function(d,i){
//       return d.charReligion;
//     })
//   ;
  bio
    .append("div")
    .attr("class", "bioLink")
    .append("a")
    .attr("href", function(d){ return d.charURL })
    .attr("target", "_blank")
    .text("<<<->>>")
  ;


  // alert("size1 : " + document.querySelectorAll('.size1').length);
  // alert("size2 : " + document.querySelectorAll('.size2').length);
  // alert("size3 : " + document.querySelectorAll('.size3').length);
  // alert("size4 : " + document.querySelectorAll('.size4').length);
  // alert("size5 : " + document.querySelectorAll('.size5').length);
  // alert("size6 : " + document.querySelectorAll('.size6').length);

});

document.documentElement.style.setProperty("--cellSide", cellSide);


