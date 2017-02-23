(function() {
  var width = 1200,
    height = 700;

  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)")

  var defs = svg.append("defs")
  
  defs.append("pattern")
    .attr("id", "jon-snow")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    .attr("xlink:href", "https://images-na.ssl-images-amazon.com/images/M/MV5BZmE0MDVmMzctNjEzMS00Mzk2LTliYTktZDk0YThiMmI5NTM1XkEyXkFqcGdeQXVyMjk3NTUyOTc@._V1_UY100_UX100_AL_.jpg")  


  var radiusScale = d3.scaleSqrt().domain([1,54]).range([1,60])

  // the force on the x-axis that has all bubbles combined
  var forceXCombined = d3.forceX(width/2).strength(0.05)


  // the force on the x-axis that seperates bubbles based on dead/alive
  var forceXSplit = d3.forceX(function(d){
      if (d.alive == "FALSE") {
        return 220
      } else {
        return 880
      }
    }).strength(0.05)

  var simulation = d3.forceSimulation()
    .force("x", forceXCombined)
    .force("y", d3.forceY(height/2).strength(0.04))
    .force("collide", d3.forceCollide(function(d){
      return radiusScale(d.total) + 1
    }))

  d3.queue()
    .defer(d3.csv, "got.csv")
    .await(ready)

  function ready (error, datapoints) {


    defs.selectAll(".character-pattern")

      .data(datapoints)
      .enter().append("pattern")
      .attr("class", "character-pattern")
      .attr("id", function(d){
        console.log(d)
        return d.id
      })
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("height", 1)
      .attr("width", 1)
      .attr("preserveAspectRatio", "none")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .attr("xlink:href", function(d) {
        return d.img_url
      })



    console.log("datapoints being retrieved.")

    var circles = svg.selectAll(".character")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "character")
      .attr("r", function(d) {
        return radiusScale(d.total)
      })
      //.attr("fill", "lightblue")
      //.attr("fill", "url(#jon-snow)")
      .attr("fill", function(d) {
        return "url(#" + d.id + ")"
      })
      .attr("stroke", "silver")
      .on('click', function(d){
        console.log(d)
      })

    simulation.nodes(datapoints)
      .on('tick', ticked)

    function ticked() {
      circles
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
    }
    //BUTTON ACTION:
    d3.select("#combine").on('click', function(){
      console.log("ok we clicked the button")

      // combine the bubbles back together
      simulation
        .force("x", forceXCombined)
        .alphaTarget(0.06)
        .restart()
      document.getElementById("combine").disabled=true;  
    })

    d3.select("#split").on('click', function(){
      console.log("ok weclicked the split button")
      //d3.select("#combine").dsi
      //document.getElementById("combined").disabled = false
      // combine the bubbles back together
      simulation
        .force("x", forceXSplit)
        .alphaTarget(0.15)
        .restart()

      document.getElementById("combine").disabled=false;

    })    


  }

})();