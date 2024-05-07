import React, { useState, useEffect } from "react";
import { nepaliData } from "./nepaliData";

export default function App() {
  return (
    <>
      <FlashCard />
    </>
  );
}

//localStorage.setItem('myData', JSON.stringify(myData));
// const myData = JSON.parse(localStorage.getItem('myData'));

function FlashCard() {
  const typesAndTags = parseTypesAndTags(nepaliData);
  const [dataSettings, setDataSettings] = useState(typesAndTags);
  const activeArray = createActiveArray(nepaliData, dataSettings);
  const activeIds = activeArray.map(({ id }) => id);
  const randomId = Math.floor(Math.random() * activeIds.length);
  const [activeID, setActiveId] = useState(randomId);
  const [answer, setAnswer] = useState("");
  const [side, setSide] = useState("nepali");
  const [correct, setCorrect] = useState(null);

  const activeWord = activeArray.find(({ id }) => id === activeID);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();

    const languageCheck = side === "english" ? "npl_ph" : "en";

    const isAnswerCorrect =
      (answer || "").trim().toLowerCase() ===
      (activeWord[languageCheck] || "").toLowerCase();

    setCorrect(() => isAnswerCorrect);

    setSide((side) => (side === "english" ? "nepali" : "english"));
  };

  function resetDefaults() {
    setCorrect(() => null);
    setSide((side) => (side === "english" ? "nepali" : "english"));
    setAnswer(() => "");
    const randomId = Math.floor(Math.random() * activeIds.length);
    setActiveId(() => randomId);
  }

  function handleResetSettings(e, value) {
    return e.target.checked
      ? setDataSettings((prev) => [...prev, value])
      : setDataSettings((prev) => prev.filter((tag) => tag !== value));
  }

  return (
    <div className="flash-card">
      <Settings>
        {typesAndTags.map((tag) => {
          return (
            <ToggleButton
              key={tag}
              value={tag}
              onHandleChange={handleResetSettings}
            >
              {tag}
            </ToggleButton>
          );
        })}
      </Settings>
      <Card correct={correct}>
        {side === "english" ? (
          <EnglishCardData word={activeWord} />
        ) : (
          <NepaliCardData word={activeWord} />
        )}
      </Card>
      {typeof correct === "boolean" && (
        <div>
          {correct ? "Correct!" : "Incorrect!"}
          <Button onClick={() => resetDefaults()}>Next</Button>
        </div>
      )}
      <AnswerInput>
        <InputText value={answer} onChange={(e) => setAnswer(e.target.value)}>
          Answer
        </InputText>
        <Button onClick={(e) => handleAnswerSubmit(e)}>Submit</Button>
      </AnswerInput>
    </div>
  );
}

function Settings({ children }) {
  return <div className="toggle-container">{children}</div>;
}

function ToggleButton({ children, value, onHandleChange }) {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          defaultChecked={true}
          onChange={(e) => onHandleChange(e, value)}
        />
        <span className="toggle">{children}</span>
      </label>
    </div>
  );
}
function EnglishCardData({ word }) {
  return (
    <>
      <p>{word.en}</p>
    </>
  );
}

function NepaliCardData({ word }) {
  return (
    <div>
      <p>{word.npl}</p>
      <p>{word.npl_ph}</p>
    </div>
  );
}

function Card({ children, correct }) {
  const correctStyle = (correct) => {
    if (typeof correct === "boolean") return correct ? "green" : "red";
  };

  return <div className={`card ${correctStyle(correct)}`}>{children}</div>;
}

function AnswerInput({ children }) {
  return <form>{children}</form>;
}

const InputText = ({ children, ...props }) => (
  <label>
    {children}
    <input {...props} />
  </label>
);

function Button({ children, ...props }) {
  return (
    <button className="button" {...props}>
      {children}
    </button>
  );
}

// UTILS FUNCTIONS

const parseTypesAndTags = (data) => {
  return data.reduce((a, c) => {
    const arr = [c.type, c.tags].flat().filter((a) => a);
    arr.forEach((term) => {
      if (a && !a.includes(term)) a.push(term);
    });
    return a;
  }, []);
};

const createActiveArray = (data, settings) => {
  return data.filter((word) => {
    const arr = [word.type, word.tags].flat().filter((a) => a);
    return arr.some((term) => settings.includes(term));
  });
};
