//Oscar Rodriguez
let w = 800;
let h= 400;
let rectWidth = w / 275;

let tooltip = d3.select(".visHolder")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0); 

let overlay = d3.select(".visHolder")
                .append("div")
                .attr("class", "overlay")
                .style("opacity", 0);

const svg = d3.select(".visHolder")
              .append("svg")
              .attr("width", w + 100)
              .attr("height", h + 60);

fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(res => res.json())
    .then(data => {

       let years = data.data.map(i => {
            let Q;
            let temp =  i[0].substring(5, 7);
              switch (temp) {
                     case "01":
                            Q = "Q1";
                            break;
                     case "04":
                            Q = "Q2";       
                            break;
                     case "07":
                            Q = "Q3";
                            break;       
                     default:
                            Q = "Q4";
                            break;
              }

             if (temp === "01") quarter = "Q1";
             else if (temp === "04") quarter = "Q2";
             else if (temp === "07") quarter = "Q3";
             else if (temp === "10") quarter = "Q4";

            return i[0].substring(0, 4) + " " + quarter;
        });

        let yearsDate = data.data.map(i => new Date(i[0]));
        
        let xMax = new Date(d3.max(yearsDate));
        xMax.setMonth(xMax.getMonth() + 3);

        const xScale = d3.scaleTime()
                         .domain([d3.min(yearsDate), xMax])
                         .range([0, w]);

        const xAxis = d3.axisBottom()
                        .scale(xScale);
                        
        svg.append("g")
           .attr("transform", "translate(60, 400)")        
           .attr("id", "x-axis") 
           .call(xAxis);       

        const billions = data.data.map(i => i[1]);

        let scaledGDP = [];

        let gdpMin = d3.min(billions);
        let gdpMax = d3.max(billions);

        const linearScale = d3.scaleLinear()
                              .domain([0, gdpMax])
                              .range([0, h]);

        scaledGDP = billions.map(i => linearScale(i));
        
        const yAxisScale = d3.scaleLinear()
                             .domain([0, gdpMax])
                             .range([h, 0]);

        const yAxis = d3.axisLeft(yAxisScale);     
        
        svg.append("g") 
           .attr("transform", "translate(60, 0)")
           .attr("id", "y-axis")
           .call(yAxis);

        d3.select("svg")
          .selectAll("rect")
          .data(scaledGDP)
          .enter()
          .append("rect")
          .attr("data-date", (d, i) => data.data[i][0]) 
          .attr("data-gdp", (d, i) => data.data[i][1]) 
          .attr("class", "bar") 
          .attr("x", (d, i) => xScale(yearsDate[i])) 
          .attr("y", d => h - d) 
          .attr("width", rectWidth) 
          .attr("height", d => d)
          .attr("transform", "translate(60, 0)")
          .style("fill", "blue")
          .on("mouseover", (d, i) => {
              overlay.transition()
                     .duration(100)
                     .style("height", d + "px")
                     .style("width", rectWidth + "px")
                     .style("opacity", .9)
                     .style("left", (i * rectWidth) + "px")
                     .style("top", h - d + "px")
                     .style("transform", "translateX(60px)");
              tooltip.transition()       
                     .duration(200)
                     .style("opacity", .9);
                     
              tooltip.html(years[i] + "<br>" + "$" + billions[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + "Billion")       
                     .attr("data-date", data.data[i][0])
                     .style("left", (i * rectWidth) + 80 + "px")
                     .style("top", h - 100 + "px")
          })
          
          .on("mouseout", d => {
            tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            overlay.transition()
                   .duration(200)
                   .style("opacity", 0);
          })

          //appending the text
          svg.append("text")
          .attr("transform", "rotate(270)")
          .attr("x", -200)
          .attr("y", 80)
          .text("USA Gross Domestic Product");

          svg.append("text")       
           .attr("x", w / 2 + 120)  
           .attr("y", h + 50)
           .attr("class", "moreInformation")
           .text("More Information? visit: http://www.bea.gov/national/pdf/nipaguid.pdf");  


    })           



    

