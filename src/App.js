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
  let newHistory = state.history;
  let newValue = state.currentValue;
  const myValue = buttons.find(({ id }) => id === action.type);
  if (newHistory === "") newHistory = myValue.caption;

  if (action.type !== "zero") {
    if (state.currentValue === "0") {
      newValue = myValue.caption;
      newHistory = myValue.caption;
    } else {
      if (isOperator(state.currentValue)) newValue = myValue.caption;
      else newValue = state.currentValue + myValue.caption;
      newHistory = newHistory + myValue.caption;
    }
  }
  if (action.type === "zero") {
    if (state.history === "") newHistory = myValue.caption;

    if (isOperator(state.currentValue)) {
      newValue = myValue.caption;
      newHistory = state.history + myValue.caption;
    } else if (state.currentValue === "0") {
      newValue = myValue.caption;
    }
  }

  if (state.calculated) {
    newValue = myValue.caption;
    newHistory = myValue.caption;
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
  let newCurentValue = state.currentValue;

  if (state.currentValue === "0") {
    newCurentValue = newCurentValue + ".";
    newHistory = newCurentValue;
  } else if (newHistory.indexOf(".") === -1) {
    newCurentValue = newCurentValue + ".";
    newHistory = newHistory + ".";
  }

  if (state.calculated) {
    newCurentValue = "0.";
    newHistory = newCurentValue;
  }

  return {
    currentValue: newCurentValue,
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
    newValue = state.result;
    newHistory = newValue + myValue.caption;
    if (newValue === "") {
      newValue = "0";
      newHistory = "";
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
  let newValue = "";
  let newHistory = "";
  let result = "";

  if (state.history === "") {
    newValue = "NaN";
    newHistory = "=NaN";
  }
  return {
    currentValue: newValue,
    history: newHistory,
    calculated: true,
    result: result,
  };
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
    case "zero":
      return handleNumbers(state, action);
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
