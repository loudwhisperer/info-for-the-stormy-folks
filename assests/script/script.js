$(function () {
  //Global Variables
  const searchBtn = $("#search");
  const rootEl = $("#root");
  const appId = "f73bdbc432694a653b9d129f40b58f7d";
  let currentLoc = [];
  function searchManager(event) {
    event.preventDefault();
    const searchBox = $("#searchvalue").val();
    let locationUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchBox}&units=metric&appid=${appId}`;

    async function getForecast(coordinates) {
      const response = await fetch(locationUrl);
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        currentLoc = data.city.coord;
        let currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLoc.lat}&lon=${currentLoc.lon}&appid=${appId}`;
        async function convertDaily() {
          const response = await fetch(currentUrl);
          const data = await response.json();
          console.log(data);
          const card = $("<div></div>");
					$("<h2></h2>").text(data.name).appendTo(card);
          $("<h4></h4>").text(dayjs(data.dt).format("MMMM D")).appendTo(card);
          $("<p></p>").text(`${data.main.temp} °F`).appendTo(card);
          $("<p></p>").text(`${data.main.humidity}%`).appendTo(card);
          $("<p></p>").text(`${data.wind.speed} MPH`).appendTo(card);
          rootEl.append(card);
        }
        convertDaily();
      }
    }
    getForecast(currentLoc);
  }

  searchBtn.on("click", searchManager);
});
