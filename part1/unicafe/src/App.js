import { useState } from "react";

const Header = (props) => {
  return <h1>{props.name}</h1>;
};

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);

const StatisticLine = (props) => {
  if (props.text === "Positive:") {
    return (
      <p>
        {props.text} {props.value} %
      </p>
    );
  }
  return (
    <p>
      {props.text} {props.value}
    </p>
  );
};

// a proper place to define a component
const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad;
  const average = (props.good - props.bad) / all;
  const positive = (props.good / all) * 100;

  if (all === 0) {
    return (
      <>
        <tr>No feedback given</tr>
      </>
    );
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="Good:" value={props.good} />
        <StatisticLine text="Neutral:" value={props.neutral} />
        <StatisticLine text="Bad:" value={props.bad} />
        <StatisticLine text="All:" value={all} />
        <StatisticLine text="Average:" value={average} />
        <StatisticLine text="Positive:" value={positive} />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <Header name="Customer feedback" />
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      <Header name="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
