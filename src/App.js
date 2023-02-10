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
};

function handleNumbers(state, action) {
  let newHistory = state.history;
  let newCurentValue = state.currentValue;
  const myValue = buttons.find(({ id }) => id === action.type);
  if (newHistory === "") newHistory = myValue.caption;

  if (
    newCurentValue === "*" ||
    newCurentValue === "-" ||
    newCurentValue === "/" ||
    newCurentValue === "x"
  ) {
    newCurentValue = "";
  }

  if (action.type !== "zero") {
    if (state.currentValue === "0") {
      newCurentValue = myValue.caption;
      newHistory = myValue.caption;
    } else {
      newCurentValue = newCurentValue + myValue.caption;
      newHistory = newHistory + myValue.caption;
    }
  }
  if (action.type === "zero" && state.currentValue !== myValue.caption) {
    newCurentValue = newCurentValue + myValue.caption;
    newHistory = newHistory + myValue.caption;
  }
  return {
    currentValue: newCurentValue,
    history: newHistory,
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

  return {
    currentValue: newCurentValue,
    history: newHistory,
  };
}

function handleOperators(state, action) {
  let newHistory = state.history;
  let newCurentValue = state.currentValue;
  let last2Char = newHistory.slice(-2);
  const myValue = buttons.find(({ id }) => id === action.type);

  if (newHistory === "" && action.type === "subtract") {
    newCurentValue = myValue.caption;
    newHistory = myValue.caption;
  } else if (
    newHistory.length === 1 &&
    newHistory !== "*" &&
    newHistory !== "-" &&
    newHistory !== "/" &&
    newHistory !== "x"
  ) {
    newCurentValue = myValue.caption;
    newHistory = newHistory + myValue.caption;
  }
  /*
  if (
    buttons.findIndex((el) => el.caption === last2Char[0]) > -1 &&
    action.type !== "subtract"
  ) {
    newCurentValue = myValue.caption;
    newHistory = newHistory.slice(0, newHistory.length - 3) + myValue.caption;
  } else if (last2Char[1] === myValue.caption) {
    newCurentValue = myValue.caption;
    newHistory = newHistory + myValue.caption;
  }
*/
  return {
    currentValue: newCurentValue,
    history: newHistory,
  };
}

function reducer(state, action) {
  let newHistory = state.history;
  let newCurentValue = state.currentValue;
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
