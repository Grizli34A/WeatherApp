const apiKey = "dfd756a9f7684a7f9b7205643231307";

const header = document.querySelector(".header");
const input = document.querySelector(".input");
const btn = document.querySelector(".btn");
let searchingCity;
let isadd = false;

input.addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\d+/, "");
});

const addCard = (name, country, temp, text, image) => {
  const card = ` <div class="card">
    <h2 class="card-city">${name}<span>${country}</span></h2>
    <div class="card-weather">
        <div class="card-value">${Math.round(temp)}<sup>°c</sup></div>
        <img src="${image}" alt="Weather" class="card-image">
    </div>
    <div class="card-description">${text}</div>
</div>`;
  header.insertAdjacentHTML("afterend", card);
  isadd = true;
};
async function getWeather(city) {
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchingCity}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
btn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (input.value != "") {
    try {
      searchingCity = input.value.trim();

      const data = await getWeather(searchingCity);

      if (isadd) {
        const oldCard = document.querySelector(".card");
        oldCard.remove();
      }
      const response = await fetch("./conditions.json");
      const conditionData = await response.json();

      const info = conditionData.find((element) => {
        return element.code === data.current.condition.code;
      });

      const filePath = "/img/" + (data.current.is_day ? "day" : "night") + "/";
      const fileName = (data.current.is_day ? info.day : info.night) + ".png";
      console.log(filePath + fileName);
      addCard(
        data.location.name,
        data.location.country,
        data.current.temp_c,
        data.current.is_day
          ? info.languages[23].day_text
          : info.languages[23].night_text,
        filePath + fileName
      );
    } catch {
      const card = `<div class="card">Данный город не был найден!</div>`;
      header.insertAdjacentHTML("afterend", card);
    }
  }
});
