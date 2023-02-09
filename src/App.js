import logo from "./logo.svg";
import "./App.css";

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

function App() {
  return (
    <div className="calculator-panel">
      <Display />
      <Calculator />
    </div>
  );
}

function Display() {
  return (
    <div id="display">
      <span id="result">result</span>
      <span id="current">current</span>
    </div>
  );
}

function Calculator() {
  return (
    <div id="calculator">
      {buttons.map((btn) => (
        <button type="button" className={btn.class} id={btn.id}>
          {btn.caption}
        </button>
      ))}
    </div>
  );
}

export default App;
