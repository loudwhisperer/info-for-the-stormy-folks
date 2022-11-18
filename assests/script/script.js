$(function () {
  //Global Variables
  const searchBtn = $("#search");
  const rootEl = $("#root");
  const cardEl = $("#wecard");
  const historEl = $("#history")
  //api key
  const appId = "f73bdbc432694a653b9d129f40b58f7d";
  //sets local Storage
  const searchHistory = JSON.parse(localStorage.getItem("city"))||[];
  let currentLoc = [];
  // start function for the search location button
  function searchManager(event) {
    //start try catch for async functions
    try{
    event.preventDefault();
    // creates buttons from local storage to show previous searches and does not add duplicates
    let searchBox
    let duplicate = false
    if (event.target.id === "search"){
       searchBox = $("#searchvalue").val();
       searchHistory.forEach(function(city){
        console.log(city === searchBox)
        if (city === searchBox){
          duplicate = true
        }
        })
        if (!duplicate){
          searchHistory.push(searchBox);
          localStorage.setItem("city", JSON.stringify(searchHistory));
          getHistory();
        }
    } else { 
      searchBox = $(this).text()
    }
    //pulls from the 5 days every 3 hours part of open weather API
    let locationUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchBox}&units=imperial&appid=${appId}`;
  //gets the lat and long on city by city name then feeds those values into the daily forecast part of the opne weather api and creates the daily forecast card
    async function getForecast(coordinates) {
      const response = await fetch(locationUrl);
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        currentLoc = data.city.coord;
        let currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLoc.lat}&lon=${currentLoc.lon}&units=imperial&appid=${appId}`;
        async function convertDaily() {
          const response = await fetch(currentUrl);
          const data = await response.json();
          console.log(data);
          const card = $("<div></div>");
          card.addClass("card border border-info border-4 rounded row m-3 p-3")
          $("<h2></h2>")
            .text(
              `${data.name} - ${dayjs.unix(data.dt).format("MMMM D")}`
            )
            .appendTo(card);
          $("<p></p>").text(`Temperature: ${data.main.temp} °F`).appendTo(card);
          $("<p></p>").text(`Humidity: ${data.main.humidity}%`).appendTo(card);
          $("<p></p>").text(`Wind Speed: ${data.wind.speed} MPH`).appendTo(card);
          rootEl.append(card);
        }
        convertDaily();
      } else {
        console.log(response)
        $("<div></div>").text("Error From Server").appendTo(rootEl)
      }
      
    }
    getForecast(currentLoc);
    // makes the cards for the next 5 days after the current date
    async function makeCards(){
      rootEl.empty()
      cardEl.empty()
       const response = await fetch(locationUrl);
       const data = await response.json();
       if (response.status === 200) {
        const cardDeck = $("<div></div>");
        cardDeck.addClass("card-deck d-flex flex-wrap");
        for (let i = 5; i < data.list.length; i+=8){
        const icon = data.list[i].weather[0].icon
        const iconLink = `http://openweathermap.org/img/w/${icon}.png`;
        const card = $("<div></div>").appendTo(cardDeck);
        card.addClass("card border border-info border-4 rounded col-lg-2 m-3 p-3");
        $(`<img src="${iconLink}"></img>`)
          .css("width", "50px", "length", "50px")
          .appendTo(card);
        $("<h2></h2>")
          .text(`${dayjs.unix(data.list[i].dt).format("MMMM D")}`)
          .appendTo(card);
        $("<p></p>").text(`Temperature: ${data.list[i].main.temp} °F`).appendTo(card);
        $("<p></p>").text(`Humidity: ${data.list[i].main.humidity}%`).appendTo(card);
        $("<p></p>").text(`Wind Speed: ${data.list[i].wind.speed} MPH`).appendTo(card);
        cardEl.append(cardDeck);
       }
       } else {
        console.log(response.json())
       }
    }
    makeCards()
    //end try catch for async functions
  } catch (error){
        console.error(error)
      }
  }
// adds the function to our search location button
  searchBtn.on("click", searchManager);
// creates the buttons that call to past searches 
  function getHistory(){
    historEl.empty()
    searchHistory.forEach(function(city){
      console.log(city)
      $("<button>").text(city).addClass("btn btn-primary col-lg-12 col-md-6 col-sm-3 p-2 mx-2 my-1").appendTo(historEl)
    })
  }
  getHistory();
  historEl.on("click", "button", searchManager)
});
