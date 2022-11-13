$(function () {
  //Global Variables
  const searchBtn = $("#search");
  const rootEl = $("#root");
  const appId = "f73bdbc432694a653b9d129f40b58f7d";

  function searchManager(event) {
    event.preventDefault();
    const searchBox = $("#searchvalue").val();
    let locationUrl =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      searchBox +
      "&limit=5&appid=" +
      appId +
      "";
    console.log(searchBox);
      function getForecast(request) {
        fetch(locationUrl).then(function(response) {
          console.log(response);
          if (response.status === 200){
           const card = rootEl.append("div");
           card.addClass("card text-center bg-info p-4 mx-3 my-1");
           const cardHeader = card.append("h3")
           cardHeader.text("Monday")
          }
        });
      }
      getForecast(locationUrl)
  }

  searchBtn.on("click", searchManager);
});
