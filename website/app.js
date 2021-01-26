const baseUrl = "http://localhost:3000";
const openWeatherMapApiKey = "85acd1ad547c2be25d0cfa4fdfe3a744";
const openWeatherMapUrl =
  "https://api.openweathermap.org/data/2.5/weather?zip=";

const weatherByZipForm = document.getElementById("weatherByZipForm");
const weatherByZipFormButton = document.getElementById("generate");

const dateItem = document.getElementById("date");
const tempItem = document.getElementById("temp");
const contentItem = document.getElementById("content");

const getData = async ({ url }) => {
  const response = await fetch(url);
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

const postData = async ({ url, data = {} }) => {
  console.log("postData");
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  console.log("response");
  try {
    console.log("response");
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

const getCurrentWeather = async (e) => {
  e.preventDefault();
  const formData = getDataFromForm(weatherByZipForm);
  const { zip, feelings } = formData;
  const url = `${openWeatherMapUrl}${zip},us&appid=${openWeatherMapApiKey}`;
  await getData({ url }).then(async (data) => {
    console.log({ data });
    if (data.cod === "404") {
      dateItem.innerHTML = "-";
      tempItem.innerHTML = "-";
      contentItem.innerHTML = "-";

      dateItem.removeAttribute("class");
      tempItem.removeAttribute("class");
      contentItem.removeAttribute("class");
      alert("zip code not valid");
    } else {
      const url = `${baseUrl}/addData`;
      const newDate = new Date();
      console.log("1then");
      await postData({
        url,
        data: {
          temperature: data.main.temp,
          date: newDate.getTime(),
          userResponse: feelings,
        },
      }).then(async () => await updateUI());
    }
  });
};

const updateUI = async () => {
  const url = `${baseUrl}/getProjectData`;
  const request = await fetch(url);
  try {
    const data = await request.json();
    console.log("updateUI");
    console.log({ data });
    if (data.date) {
      dateItem.innerHTML = data.date;
      dateItem.setAttribute("class", "info");
    }
    if (data.temperature) {
      tempItem.innerHTML = data.temperature;
      tempItem.setAttribute("class", "info");
    }
    if (data.userResponse) {
      contentItem.innerHTML = `"${data.userResponse}"`;
      contentItem.setAttribute("class", "info");
    }
  } catch (error) {
    console.log("error", error);
  }
};

weatherByZipFormButton.addEventListener("click", getCurrentWeather);

const getDataFromForm = (form) => {
  const data = new FormData(form);
  const formEntries = Array.from(data.entries());
  return formEntries.reduce((acc, cur) => {
    const [key, value] = cur;
    acc[key] = value;
    return acc;
  }, {});
};
