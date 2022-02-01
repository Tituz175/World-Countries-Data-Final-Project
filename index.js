/* === GLOBAL VARIABLES === */
let nameFlag = true;
let capitalFlag = false;
let populationFlag = false;
let populationGraphflag = true;
let langauagesGraphflage = false;
const url = "https://restcountries.com/v2/all";

/* === Getting HTML elements === */
const countriesContainer = document.querySelector("#country-container");
const graphWrapper = document.querySelector("#graph");
const subtitle = document.querySelector("#subtitle");
const searchInput = document.querySelector("#input-container span input");
const buttons = document.querySelector("#button-container");
const feedback = document.querySelector("#response");
const graphButtons = document.querySelector("#graph-buttons");
const graphTitle = document.querySelector("#graph-feedback");

// /* === Sorting icons === */
const nameIcon = document.querySelector(".name i");
const capitalIcon = document.querySelector(".capital i");
const populationIcon = document.querySelector(".population i");

/* Create a single country UI*/
const createCountryUI = ({
  name,
  region,
  capital,
  languages,
  population,
  flag,
  currencies,
}) => {
  const continent =
    region.length > 0 ? `<span>Continent: </span> ${region}` : "";
  const formatedCapital =
    capital && capital.length > 0 ? `<span>Capital: </span> ${capital}` : "";
  const langLength = languages.length > 1 ? `Langauges` : `Langauge`;
  const formatedLang = languages
    .map((lang) => {
      return lang.name;
    })
    .join(", ");
  let currency;
  currencies != undefined
    ? currencies.forEach((items) => {
        currency = `<span>Currency: </span> ${items.name} (${items.symbol})`;
      })
    : (currency = "");
  return `<div class="country">
            <div class="country_flag">
              <img src="${flag}" />
            </div>
            <h3 class="country_name">${name.toUpperCase()}</h3>
            <div class="country_text">
              <p>${continent}</p>
              <p>${formatedCapital}</p>
              <p><span>${langLength}: </span>${formatedLang}</p>
              <p><span>Population: </span>${population.toLocaleString()}</p>
              <p>${currency}</p>
            </div>
        </div>`;
};

/* === Filter countries based on search input === */
const filterCountries = (arr, search) => {
  search = search.toLowerCase();
  const filteredCountries = arr.filter((country) => {
    const { name, capital, languages } = country;
    const formatedLang = languages.map((lang) => lang.name).join(", ");
    const isName = name.toLowerCase().includes(search);
    const isCapital = capital && capital.toLowerCase().includes(search);
    const isLanguages = formatedLang.toLowerCase().includes(search);
    return isName || isCapital || isLanguages;
  });
  const result = search == "" ? arr : filteredCountries;
  return result;
};

/* === Render  all the contries on the countries wrapper div */
const renderCountries = (arr) => {
  let contents = "";
  arr.forEach((country) => {
    contents += createCountryUI(country);
  });
  countriesContainer.innerHTML = contents;
};

const fetchData = async () => {
  try {
    const response = await fetch(url);
    const countries = await response.json();
    renderCountries(sortCountries(countries, countries.population));
  } catch (err) {
    console.error(err);
  }
};

/* === Sorting countries either by name, capital or population === */
const sortCountries = (arr, type) => {
  const countries = [...arr];
  const sortedCountries = countries.sort((a, b) => {
    if (a[type] > b[type]) return -1;
    if (a[type] < b[type]) return 1;
    return 0;
  });
  return sortedCountries;
};

/* === Reverse countries array === */
const reverseCountries = (arr) => {
  const countries = [...arr];
  return countries.reverse();
};
// /* === calculate the number of times a langauage is  an official langauge in different countries. */
const countLanguages = (arr) => {
  const langs = [];
  const langObjs = [];
  const langSet = new Set();
  arr.forEach((country) => {
    const { languages } = country;
    const formatedLang = languages.map((lang) => lang.name);
    for (const language of formatedLang) {
      langs.push(language);
      langSet.add(language);
    }
  });
  for (const language of langSet) {
    const countries = langs.filter((lang) => lang == language).length;
    langObjs.push({ language, countries });
  }
  return langObjs;
};

/* create  a population graph, create single bar */
const createPopulationUI = ({ name, population }) => {
  const worldPopulation = 7693165599;
  let formatedName;
  if (name === "Russian Federation") formatedName = "Russia";
  else if (name === "United States of America") formatedName = "USA";
  else formatedName = name;

  const width = Math.round((population / worldPopulation) * 100);
  return `<div class="bars">
              <div>${formatedName}</div>
              <div class="bar" style="width:${width}%;height:35px;"></div>
              <div>${population.toLocaleString()}</div>
          </div>`;
};

/* create bar graph for language */
const createLanguagesUI = ({ language, countries }) => {
  const totalLanguage = 91;
  const width = Math.round((countries / totalLanguage) * 100);
  return `<div class="bars">
            <div>${language}</div>
            <div class="bar" style="width:${width}%;height:35px"></div>
            <div>${countries}</div>
          </div>`;
};

/* == Render the population graph on browser ==*/
const renderPopulationGraph = (arr) => {
  let content = "";
  let world = { name: "World", population: 7693165599 };
  content += createPopulationUI(world);
  arr.forEach((country) => (content += createPopulationUI(country)));
  graphWrapper.innerHTML = content;
};

/* == Render the languages graph on browser ==*/
const renderLanguagesGraph = (arr) => {
  let content = "";
  arr.forEach((country) => (content += createLanguagesUI(country)));
  graphWrapper.innerHTML = content;
};

// console.log(buttons);

/* Shows a down arrow */
function showArrowDown(e) {
  e.target.childNodes[1].innerHTML = "";
  e.target.childNodes[1].innerHTML = `&darr;`;
}

/* Shows an up arrow */
function showArrowUp(e) {
  e.target.childNodes[1].innerHTML = "";
  e.target.childNodes[1].innerHTML = `&uarr;`;
}

/* Display an up or down side icon, when a button is clicked */
function displayIcon(type) {
  if (type === "name") {
    nameIcon.style.display = "inline-block";
    populationIcon.style.display = "none";
    capitalIcon.style.display = "none";
  } else if (type === "capital") {
    nameIcon.style.display = "none";
    populationIcon.style.display = "none";
    capitalIcon.style.display = "inline-block";
  } else if (type === "population") {
    nameIcon.style.display = "none";
    capitalIcon.style.display = "none";
    populationIcon.style.display = "inline-block";
  } else {
  }
}

sortedCountriesfuc = (arr, sortKey, searchVal) => {
  let sortedCountries =
    searchVal === ""
      ? sortCountries(arr, sortKey)
      : sortCountries(filterCountries(arr, searchVal), sortKey);
  return sortedCountries;
};


//Fetching from API starts here
fetch(url)
  .then((response) => response.json())
  .then((countries) => {
    // Ten most populated countries
    const populatedCountries = sortCountries(countries, "population").slice(
      0,
      10
    );
    // Ten most spoken langauge by region or by location
    const mostSpokenLanguages = sortCountries(
      countLanguages(countries),
      "countries"
    ).slice(0, 10);
    buttons.addEventListener("click", (e) => {
      let type = e.target.className;
      let sortedCountries;
      if (type === "name") {
        displayIcon(type);
        sortedCountriesfuc(countries, type, searchInput.value);
        if (nameFlag) {
          console.log("im here");
          nameFlag = false;
          showArrowUp(e);
          renderCountries(
            sortedCountriesfuc(countries, type, searchInput.value)
          );
        } else {
          showArrowDown(e);
          const copiedsortedCountries = [
            ...sortedCountriesfuc(countries, type, searchInput.value),
          ];
          const reversed = reverseCountries(copiedsortedCountries);
          renderCountries(reversed);
          nameFlag = true;
        }
      } else if (type === "capital") {
        displayIcon(type);
        sortedCountriesfuc(countries, type, searchInput.value);
        if (capitalFlag) {
          capitalFlag = false;
          console.log(populationFlag);
          showArrowUp(e);
          renderCountries(
            sortedCountriesfuc(countries, type, searchInput.value)
          );
        } else {
          capitalFlag = true;
          console.log(populationFlag);
          showArrowDown(e);
          const copiedsortedCountries = [
            ...sortedCountriesfuc(countries, type, searchInput.value),
          ];
          const reversed = reverseCountries(copiedsortedCountries);
          renderCountries(reversed);
        }
      } else if (type === "population") {
        displayIcon(type);
        sortedCountriesfuc(countries, type, searchInput.value);
        if (populationFlag) {
          populationFlag = false;
          showArrowUp(e);
          renderCountries(
            sortedCountriesfuc(countries, type, searchInput.value)
          );
        } else {
          populationFlag = true;
          showArrowDown(e);
          let copiedsortedCountries = [
            ...sortedCountriesfuc(countries, type, searchInput.value),
          ];
          let reversed = reverseCountries(copiedsortedCountries);
          renderCountries(reversed);
        }
      } else {
        sortedCountries = renderCountries(countries);
      }
    });

    /*=== Event listener to get search input === */
    searchInput.addEventListener("input", (e) => {
      let searchTerm = e.target.value;
      let countryOrCountries =
        filterCountries(countries, searchTerm).length > 1
          ? "countries"
          : "country";
      feedback.innerHTML =
        searchInput.value != ""
          ? `<strong><b>${
              filterCountries(countries, searchTerm).length
            }</b></strong> ${countryOrCountries} satisified the search criteria`
          : "";
      renderCountries(filterCountries(countries, searchTerm));
      if (searchInput.value != "") {
        graphTitle.textContent = "World Population ";
        renderPopulationGraph(filterCountries(countries, searchTerm));
      } else {
        graphTitle.textContent = "10 Most populated countries";
        renderPopulationGraph(populatedCountries);
      }
    });

    subtitle.textContent = `Currently, we have ${countries.length} countries`;
    renderCountries(filterCountries(countries, searchInput.value));
    graphTitle.textContent = "10 Most populated countries in the world";
    renderPopulationGraph(populatedCountries);

    graphButtons.addEventListener("click", (e) => {
      const type = e.target.innerHTML;
      if (type === "population") {
        graphTitle.textContent = "10 Most populated countries in the world";
        renderPopulationGraph(populatedCountries);
      } else if (type === "languages") {
        graphTitle.textContent = "10 Most Spoken languages in the world";
        renderLanguagesGraph(mostSpokenLanguages);
      } else {
      }
    });
  });
