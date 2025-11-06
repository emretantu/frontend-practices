// BASIC VARIABLES

const currencyConverterForm = document.querySelector(".currency-converter-form");
const baseCurrency = document.querySelector("#base-currency");
const targetCurrency = document.querySelector("#target-currency");
const baseInput = document.querySelector("#base-input");
const targetInput = document.querySelector("#target-input");
const swapButton = document.querySelector("button#swap");
const exchangeRate = document.querySelector(".exchange-rate");
let data; // { base: "STR", target: "STR", multiplier: INT }
let currencies; // {"STR": {name: "STR", pluralName: "STR", decimalDigits: INT} }
let online = false;
const defaultBase = "USD";
const defaultTarget = "EUR";
let apikey = "";

// FETCHING OFFLINE DATA

const fetchOfflineCurrencies = async function() {
  try {
    let currencies = await fetch("./offline-currencies.json");
    currencies = await currencies.json();
    currencies = currencies.data;
    currencies = Object.entries(currencies);
    currencies = currencies.reduce((acc, currency) => {
      acc[currency[0]] = {
        name: currency[1]["name"],
        namePlural: currency[1]["name_plural"],
        decimalDigits: currency[1]["decimal_digits"]
      }
      return acc;
    }, {})
    return currencies;
  } catch (error) {
    console.log(error);
  }
}

const fetchOfflineData = async function(base=defaultBase, target=defaultTarget) {
  try {
    let offlineData = await fetch("./offline-data.json");
    offlineData = await offlineData.json();
    if(!offlineData[base]) {
      throw new Error("Invalid base value!");
    }
    if(!offlineData[base][target]) {
      throw new Error("Invalid target value!");
    }
    return {
      base: base,
      target: target,
      multiplier: offlineData[base][target]
    };
  } catch (error) {
    console.log(error)
  }
}

// FETCHING ONLINE DATA

const fetchCurrencies = async function() {
  try {
    let currencies = await fetch(
      "https://api.freecurrencyapi.com/v1/currencies",
      {
        method: "GET",
        headers: {
          apikey: apikey
        }
      }
    );
    if(!currencies.ok) {
      throw new Error("Invalid values!");
    }
    currencies = await currencies.json();
    currencies = currencies.data;
    currencies = Object.entries(currencies);
    currencies = currencies.reduce((acc, currency) => {
      acc[currency[0]] = {
        name: currency[1]["name"],
        namePlural: currency[1]["name_plural"],
        decimalDigits: currency[1]["decimal_digits"]
      }
      return acc;
    }, {})
    return currencies;
  } catch (error) {
    console.log(error);
  }
}

const fetchData = async function(base=defaultBase, target=defaultTarget) {
  try {
    let data = await fetch(
      `https://api.freecurrencyapi.com/v1/latest?base_currency=${base}&currencies=${target}`,
      {
        method: "GET",
        headers: {
          apikey: apikey
        }
      }
    );
    if(!data.ok) {
      throw new Error("Invalid values!");
    }
    data = await data.json();
    return {
      base: base,
      target: target,
      multiplier: data["data"][target]
    }
  } catch (error) {
    console.log(error);
  }
}

// FUNCTIONS

const round = function(number, decimalDigits) {
  const roundFactor = 10 ** decimalDigits;
  return Math.round(number * roundFactor) / roundFactor;
}

const setBase = function(option, value) {
  baseCurrency.value = option,
  baseInput.value = value;
}

const setTarget = function(option, value) {
  targetCurrency.value = option,
  targetInput.value = value;
}

const setExchangeRate = function(base, target, rate) {
  if (rate % 1 === 0 && rate !== 1) {
    exchangeRate.innerHTML = `1 ${base.name} = ${rate} ${target.namePlural}`;
  } else {
    exchangeRate.innerHTML = `1 ${base.name} = ${rate} ${target.name}`;
  }
}

const setAppFromData = function(data, currencies) {
  const roundedRate = round(data.multiplier, currencies[data.target].decimalDigits);
  setBase(data.base, 1);
  setTarget(data.target, roundedRate);
  setExchangeRate(currencies[data.base], currencies[data.target], roundedRate);
}

const setApp = async function(base, target) {
  disableApp();
  if (online) {
    data = await fetchData(base, target);
  } else {
    data = await fetchOfflineData(base, target);
  }
  setAppFromData(data, currencies);
  setLocalCurrencies(base, target);
  initializeApp();
}

const setCurrencyLists = function(baseElements, targetElements) {
  baseCurrency.append(...baseElements);
  targetCurrency.append(...targetElements);
}

const createOption = function(value) {
  const element = document.createElement("option");
  element.innerHTML = value;
  element.value = value;
  return element;
}

const setOptionsFromCurrencies = function(currencies) {
  const baseElements = [];
  const targetElements = [];

  currencies.map(currency => {

    const baseElement = createOption(currency);
    baseElements.push(baseElement);

    const targetElement = createOption(currency);
    targetElements.push(targetElement);

  });

  setCurrencyLists(baseElements, targetElements);
}

const swapCurrencies = function() {
  let temp = baseCurrency.value;
  baseCurrency.value = targetCurrency.value;
  targetCurrency.value = temp;
  setApp(data.target, data.base);
}

const setLocalCurrencies = function(base, target) {
  localStorage.setItem("baseCurrency", base);
  localStorage.setItem("targetCurrency", target);
}

const getLocalCurrencies = function() {
  const localBaseCurrency = localStorage.getItem("baseCurrency");
  const localTargetCurrency = localStorage.getItem("targetCurrency");
  if (localBaseCurrency && localTargetCurrency) {
    return {localBaseCurrency, localTargetCurrency};
  }
  return null;
}

const initializeApp = function() {
    baseInput.disabled = false;
    targetInput.disabled = false;
    swapButton.disabled = false;
    baseCurrency.disabled = false;
    targetCurrency.disabled = false;
}

const disableApp = function() {
    baseInput.disabled = true;
    targetInput.disabled = true;
    swapButton.disabled = true;
    baseCurrency.disabled = true;
    targetCurrency.disabled = true;
}

// INTERACTIONS

currencyConverterForm.addEventListener("submit", e => {
  e.preventDefault();
})

swapButton.addEventListener("click", e => {
  swapCurrencies();
})

baseCurrency.addEventListener("change", () => {
  setApp(baseCurrency.value, targetCurrency.value);
});

targetCurrency.addEventListener("change", () => {
  setApp(baseCurrency.value, targetCurrency.value);
});

baseInput.addEventListener("keyup", (e) => {
  if (baseInput.value === "") {
    targetInput.value = "";
  } else {
    targetInput.value = round(baseInput.value * data.multiplier, currencies[data.target].decimalDigits);
  }
});

targetInput.addEventListener("keyup", (e) => {
  if (targetInput.value === "") {
    baseInput.value = "";
  } else {
    baseInput.value = round(targetInput.value / data.multiplier, currencies[data.base].decimalDigits);
  }
});

// Online Components

const openModalButton = document.querySelector(".app-mode");
const dialog = document.querySelector("dialog");
const apikeyForm = document.querySelector("#apikey-form");
const statusStr = document.querySelector("#status");
const toggleButton = document.querySelector("#online");
const apikeyInput = document.querySelector("#apikey");
const warning = document.querySelector(".warning");

const fetchStatus = async function() {
  try {
    let status = await fetch(
      "https://api.freecurrencyapi.com/v1/status",
      {
        method: "GET",
        headers: {
          apikey: apikey
        }
      }
    );
    if(!status.ok) {
      throw new Error("Invalid values!");
    }
    status = await status.json();
    status = status["quotas"]["month"];
    return status;
  } catch (error) {
    console.log(error);
  }
}

const setStatusOffline = function() {
  statusStr.innerHTML = "Offline";
  toggleButton.checked = false;
  openModalButton.classList.add("offline");
  showQuota(false);
  online = false;
}

const setStatusWaiting = function() {
  setStatusOffline();
  statusStr.innerHTML = "Waiting response...";
}

const setStatusOnline = function() {
  statusStr.innerHTML = "Online";
  toggleButton.checked = true;
  openModalButton.classList.remove("offline");
  showQuota(true);
  online = true;
}

const setOnlineMode = async function() {
  setStatusWaiting();
  let response = await fetchStatus();

  if (response) {
    setLocalAPIKey(apikey);
    setStatusOnline();
    startApp();
  } else {
    removeLocalAPIKey();
    setStatusOffline();
    startApp();
    apikey = "";
    apikeyInput.value = "";
    warning.style.display = "block";
    dialog.showModal();
  }
}

openModalButton.addEventListener("click", (e) => {

  if(e.target.closest("label") && apikey) {
    if(online) {
      setStatusOffline();
      startApp();
    } else {
      setOnlineMode(apikey);
    }
  } else {
    if(online) {
      setQuota();
    }
    dialog.showModal();
  }

});

apikeyForm.addEventListener("submit", async () => {
  dialog.close(); // In any case
  apikey = apikeyInput.value;
  setOnlineMode();
});

apikeyInput.addEventListener("input", () => {
  warning.style.display = "none";
});

dialog.addEventListener("click", e => {
  
  const dialogRect = dialog.getBoundingClientRect();
  const isInContent =
    e.clientX >= dialogRect.left &&
    e.clientX <= dialogRect.right &&
    e.clientY >= dialogRect.top &&
    e.clientY <= dialogRect.bottom;

  if (!isInContent) {
    dialog.close();
  }

});

// Local API Key

const getLocalAPIKey = function() {
  return localStorage.getItem("localAPIKey");
}

const setLocalAPIKey = function(value) {
  return localStorage.setItem("localAPIKey", value);
}

const removeLocalAPIKey = function() {
  return localStorage.removeItem("localAPIKey");
}

// Status
const quota = document.querySelector("#quota");

const setQuota = async function() {
  let result = await fetchStatus();
  quota.innerHTML = `Quota: ${result.used}/${result.total}`; 
}

const showQuota = function(show) {
  if(show) {
    quota.style.display = "block";
  } else {
    quota.style.display = "none";
  }
}

// MAIN

const startApp = async function() {
  disableApp();
  if (online) {
    currencies = await fetchCurrencies();
  } else {
    currencies = await fetchOfflineCurrencies();
  }
  setOptionsFromCurrencies(Object.keys(currencies));
  const local = getLocalCurrencies();
  if(!local) {
    await setApp(defaultBase, defaultTarget);
  } else {
    await setApp(local.localBaseCurrency, local.localTargetCurrency);
  }
  initializeApp();
}

const main = async function() {
  const localAPIKey = getLocalAPIKey();
  if(localAPIKey) {
    apikey = localAPIKey;
    setOnlineMode();
  } else {
    startApp();
  }
}

main();