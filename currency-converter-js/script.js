// const myPromise = new Promise((resolve, reject) => {
//   const error = false;
//   if (!error) {
//     resolve("Yes! Resolved the promise!")
//   } else {
//     reject("No! Rejected the promise!")
//   }
// });

// console.log(myPromise);

// myPromise.then(value => {
//   return "The value: " + value;
// }).then(newValue => {
//   console.log(newValue);
// }).catch(err => {
//   console.log(err);
// })

// const myNextPromise = new Promise((resolve, reject) => {
//   setTimeout(function() {
//     resolve("myNextPromise resolved!");
//   }, 3000);
// });

// myNextPromise.then(value => {
//   console.log(value);
// });

// console.log(myNextPromise);

// myPromise.then(value => {
//   console.log(value);
// })

// ---------------------------------





// ---------------------------------

// BASIC VARIABLES

const currencyConverterForm = document.querySelector(".currency-converter-form");
const baseCurrency = document.querySelector("#base-currency");
const targetCurrency = document.querySelector("#target-currency");
const baseInput = document.querySelector("#base-input");
const targetInput = document.querySelector("#target-input");
const swapButton = document.querySelector("button#swap");
const exchangeRate = document.querySelector(".exchange-rate");
let currencies;
let multiplier;

// FUNCTIONS

const setMultiplier = function(currencies) {
  let newMultiplier = currencies[baseCurrency.value][targetCurrency.value];
  let roundedNewMultiplier = Math.round(newMultiplier * 100) / 100;
  baseInput.value = 1;
  targetInput.value = roundedNewMultiplier;
  exchangeRate.innerHTML = `1 ${baseCurrency.value} = ${roundedNewMultiplier} ${targetCurrency.value}`;
  return newMultiplier;
}

const setCurrencyLists = function(baseElements, targetElements) {
  baseCurrency.append(...baseElements);
  targetCurrency.append(...targetElements);
}

const createOption = function(value) {
  const element = document.createElement("option");
  element.innerHTML = value.base;
  element.value = value.base;
  return element;
}

const swapCurrencies = function() {
  let temp = baseCurrency.value;
  baseCurrency.value = targetCurrency.value;
  targetCurrency.value = temp;
  multiplier = setMultiplier(currencies)
}

const setLocalStorage = function() {
  localStorage.setItem("baseCurrency", baseCurrency.value);
  localStorage.setItem("targetCurrency", targetCurrency.value);
}

const getLocalStorage = function() {
  const localBaseCurrency = localStorage.getItem("baseCurrency");
  const localTargetCurrency = localStorage.getItem("targetCurrency");
  if (localBaseCurrency && localTargetCurrency) {
    baseCurrency.value = localBaseCurrency;
    targetCurrency.value = localTargetCurrency
    return true;
  }
  return false;
}

const initializeApp = function() {
    if(!getLocalStorage()) {
      setLocalStorage();
    }
    multiplier = setMultiplier(currencies);
    baseInput.disabled = false;
    targetInput.disabled = false;
    swapButton.disabled = false;
    baseCurrency.disabled = false;
    targetCurrency.disabled = false;
    
}

// FETCHING OFFLINE DATA

fetch("./offline-data.json")
  .then(data => data.json())
  .then(data => data.currencies)
  .then(data => {

    const baseElements = [];
    const targetElements = [];

    data.map(value => {

      const baseElement = createOption(value);
      baseElements.push(baseElement);

      const targetElement = createOption(value);
      targetElements.push(targetElement);

    });

  setCurrencyLists(baseElements, targetElements);

  return data;

  })
  .then(data => {
    const finalData = data.reduce((acc, curr) => {
      acc[curr.base] = curr.data;
      return acc;
    }, {});
    // Initialize app
    
    currencies = finalData;
    initializeApp();
  });

// INTERACTIONS

currencyConverterForm.addEventListener("submit", e => {
  e.preventDefault();
})

swapButton.addEventListener("click", e => {
  swapCurrencies();
  setLocalStorage();
})

baseCurrency.addEventListener("change", () => {
  multiplier = setMultiplier(currencies);
  setLocalStorage();
});

targetCurrency.addEventListener("change", () => {
  multiplier = setMultiplier(currencies);
  setLocalStorage();
});

baseInput.addEventListener("keyup", (e) => {
  if (e.target.value === "") {
    targetInput.value = "";
  } else {
    targetInput.value = Math.round(e.target.value * multiplier * 100) / 100;
  }
});

targetInput.addEventListener("keyup", (e) => {
  if (e.target.value === "") {
    baseInput.value = "";
  } else {
    baseInput.value = Math.round(e.target.value / multiplier * 100) / 100;
  }
});