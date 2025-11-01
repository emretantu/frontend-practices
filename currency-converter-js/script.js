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

// FETCHING OFFLINE DATA

const fetchOfflineCurrencies = async function() {
  let currencies = await fetch("./offline-currencies.json")
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
}

const fetchOfflineData = async function(base="USD", target="EUR") {
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
  if (online) {
    // TO BE IMPLEMENT
  } else {
    data = await fetchOfflineData(base, target);
  }
  setAppFromData(data, currencies);
  setLocalCurrencies(base, target);
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

// MAIN

const main = async function() {
  currencies = await fetchOfflineCurrencies();
  setOptionsFromCurrencies(Object.keys(currencies));
  const local = getLocalCurrencies();
  if(!local) {
    setApp("USD", "EUR");
  } else {
    setApp(local.localBaseCurrency, local.localTargetCurrency);
  }
  initializeApp();
}

main();