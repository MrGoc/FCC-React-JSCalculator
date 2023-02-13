import "./App.css";
import { useReducer } from "react";

const buttons = [
  { id: "clear", caption: "AC", class: "button" },
  { id: "divide", caption: "/", class: "button button-operator" },
  { id: "multiply", caption: "x", class: "button button-operator" },
  { id: "seven", caption: "7", class: "button" },
  { id: "eight", caption: "8", class: "button" },
  { id: "nine", caption: "9", class: "button" },
  { id: "subtract", caption: "-", class: "button button-operator" },
  { id: "four", caption: "4", class: "button" },
  { id: "five", caption: "5", class: "button" },
  { id: "six", caption: "6", class: "button" },
  { id: "add", caption: "+", class: "button button-operator" },
  { id: "one", caption: "1", class: "button" },
  { id: "two", caption: "2", class: "button" },
  { id: "three", caption: "3", class: "button" },
  { id: "equals", caption: "=", class: "button button-operator" },
  { id: "zero", caption: "0", class: "button" },
  { id: "decimal", caption: ".", class: "button" },
];

const initalState = {
  currentValue: "0",
  history: "",
  calculated: false,
  result: "",
};

function isOperator(value) {
  if (value === "-" || value === "/" || value === "x" || value === "+")
    return true;

  return false;
}

function handleNumbers(state, action) {
  const myValue = buttons.find(({ id }) => id === action.type);
  let newHistory = "";
  let newValue = "";
  if (state.calculated) {
    newValue = myValue.caption;
    newHistory = myValue.caption;
  } else if (!isNaN(state.currentValue)) {
    newValue = state.currentValue + myValue.caption;
    newHistory = state.history + myValue.caption;
    if (state.history === "") {
      newValue = myValue.caption;
      newHistory = myValue.caption;
    }
  } else {
    newValue = myValue.caption;
    newHistory = state.history + myValue.caption;
  }
  return {
    currentValue: newValue,
    history: newHistory,
    calculated: false,
    result: "",
  };
}

function handleZero(state, action) {
  let newHistory = "";
  let newValue = "";
  if (state.calculated) {
    newValue = "0";
    newHistory = "0";
  } else if (state.currentValue === "0") {
    newValue = "0";
    if (state.history === "") newHistory = "0";
    else newHistory = state.history;
  } else if (!isNaN(state.currentValue)) {
    newValue = state.currentValue + "0";
    newHistory = state.history + "0";
  } else {
    newValue = "0";
    newHistory = state.history + "0";
  }
  return {
    currentValue: newValue,
    history: newHistory,
    calculated: false,
    result: "",
  };
}

function handleDecimalPoint(state, action) {
  let newHistory = state.history;
  let newValue = state.currentValue;

  if (state.calculated) {
    newValue = "0.";
    newHistory = newValue;
  } else if (state.currentValue === "0") {
    newValue = "0.";
    if (state.history === "") newHistory = newValue;
    else newHistory = state.history + ".";
  } else if (
    !isNaN(state.currentValue) &&
    state.currentValue.indexOf(".") === -1
  ) {
    newValue = state.currentValue + ".";
    newHistory = state.history + ".";
  }

  return {
    currentValue: newValue,
    history: newHistory,
    calculated: false,
    result: "",
  };
}

function handleOperators(state, action) {
  let last2Char = state.history.slice(-2);
  const myValue = buttons.find(({ id }) => id === action.type);
  // This is default
  let newValue = state.currentValue;
  let newHistory = state.history;

  // State is initial
  if (action.type === "subtract" && state.history === "") {
    newValue = myValue.caption;
    newHistory = myValue.caption;
  }
  // State is initial
  if (action.type !== "subtract" && state.history === "") {
    newValue = myValue.caption;
    newHistory = "0" + myValue.caption;
  }

  // State is number or "="
  if (state.history !== "" && !isOperator(state.history)) {
    newValue = myValue.caption;
    newHistory = state.history + myValue.caption;
  }

  if (last2Char.length === 2) {
    // 9x
    if (!isOperator(last2Char[0]) && isOperator(last2Char[1])) {
      // - is pressed
      if (action.type === "subtract") {
        newValue = myValue.caption;
        newHistory = state.history + myValue.caption;
      } else {
        newValue = myValue.caption;
        newHistory = state.history.slice(0, -1) + myValue.caption;
      }
    }
    // 9x- or 9--
    if (isOperator(last2Char[0]) && isOperator(last2Char[1])) {
      if (action.type !== "subtract") {
        newValue = myValue.caption;
        newHistory = state.history.slice(0, -2) + myValue.caption;
      } else {
        newValue = myValue.caption;
        newHistory = state.history;
      }
    }
  }

  if (state.calculated) {
    newValue = myValue.caption;
    newHistory = state.result + myValue.caption;
    if (state.result === "") {
      if (action.type === "subtract") {
        newValue = myValue.caption;
        newHistory = myValue.caption;
      } else {
        newValue = myValue.caption;
        newHistory = "0" + myValue.caption;
      }
    }
  }

  return {
    currentValue: newValue,
    history: newHistory,
    calculated: false,
    result: "",
  };
}

function handleCalculation(state) {
  let newValue = state.currentValue;
  let newHistory = state.history;
  let result = state.result;
  let calculated = state.calculated;
  let last2Char = state.history.slice(-2);

  if (state.history === "") {
    newValue = "NaN";
    newHistory = "=NaN";
    calculated = true;
  } else if (!isNaN(state.currentValue)) {
    result = calculate(state.history);
    newHistory = state.history + "=" + result;
    newValue = result;
    calculated = true;
  } else {
    if (isOperator(last2Char[0])) {
      result = calculate(state.history.slice(0, -2));
      newHistory = state.history.slice(0, -2) + "=" + result;
    } else {
      result = calculate(state.history.slice(0, -1));
      newHistory = state.history.slice(0, -1) + "=" + result;
    }
    newValue = result;
    calculated = true;
  }

  return {
    currentValue: newValue,
    history: newHistory,
    calculated: calculated,
    result: result,
  };
}

function calculate(value) {
  //return "calc";
  let calcArr = getCalcArray(value);
  let res = 0;

  let ix = calcArr.indexOf("/");
  while (ix > -1) {
    res = calcArr[ix - 1] / calcArr[ix + 1];
    calcArr.splice(ix - 1, 3, res);
    ix = calcArr.indexOf("/");
  }

  ix = calcArr.indexOf("x");
  while (ix > -1) {
    res = calcArr[ix - 1] * calcArr[ix + 1];
    calcArr.splice(ix - 1, 3, res);
    ix = calcArr.indexOf("x");
  }

  ix = calcArr.indexOf("+");
  while (ix > -1) {
    res = calcArr[ix - 1] + calcArr[ix + 1];
    calcArr.splice(ix - 1, 3, res);
    ix = calcArr.indexOf("+");
  }

  ix = calcArr.indexOf("-");
  while (ix > -1) {
    res = calcArr[ix - 1] - calcArr[ix + 1];
    calcArr.splice(ix - 1, 3, res);
    ix = calcArr.indexOf("-");
  }
  return res;
}

function getCalcArray(value) {
  let val = "";
  let res = [];
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "-" && i === 0) {
      val = value[i];
    } else if (isOperator(value[i])) {
      if (/*value[i] === "-" &&*/ value[i + 1] === "-") {
        res.push(val);
        res.push(value[i]);
        val = "-";
        i++;
      } else {
        res.push(val);
        res.push(value[i]);
        val = "";
      }
    } else {
      val += value[i];
    }
  }
  if (val !== "") res.push(val);

  return res;

  /*
  let copy = value;

  value = value.replace(/[0-9]+/g, "#").replace(/[\(|\|\.)]/g, "");
  let numbers = copy.split(/[^0-9\.]+/);
  let operators = value.split("#").filter(function (n) {
    return n;
  });
  let result = [];

  for (let i = 0; i < numbers.length; i++) {
    result.push(numbers[i]);
    if (i < operators.length) result.push(operators[i]);
  }
  return result;
  */
}

function reducer(state, action) {
  switch (action.type) {
    case "clear":
      return initalState;
    case "one":
    case "two":
    case "three":
    case "four":
    case "five":
    case "six":
    case "seven":
    case "eight":
    case "nine":
      return handleNumbers(state, action);
    case "zero":
      return handleZero(state, action);
    case "decimal":
      return handleDecimalPoint(state, action);
    case "divide":
    case "multiply":
    case "subtract":
    case "add":
      return handleOperators(state, action);
    case "equals":
      return handleCalculation(state);
    default:
      return initalState;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initalState);

  return (
    <div className="calculator-panel">
      <Display state={state} />
      <Calculator dispatch={dispatch} />
    </div>
  );
}

function Display({ state }) {
  return (
    <div id="display">
      <span id="result">{state.history}</span>
      <span id="current">{state.currentValue}</span>
    </div>
  );
}

function Calculator({ dispatch }) {
  return (
    <div id="calculator">
      {buttons.map((btn) => (
        <button
          type="button"
          className={btn.class}
          id={btn.id}
          onClick={() => {
            dispatch({ type: btn.id });
          }}
        >
          {btn.caption}
        </button>
      ))}
    </div>
  );
}

export default App;
