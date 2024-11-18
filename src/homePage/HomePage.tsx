"use client";
import { useState } from "react";

interface Answer {
  id: number;
  text: string;
  yes: boolean;
}

interface Question {
  id: number;
  question: string;
  otvets: Answer[];
}

const HomePage: React.FC = () => {
  const questions: Question[] = [
    {
      id: 1,
      question: "Что означает аббревиатура HTML?",
      otvets: [
        { id: 1, text: "HyperText Markup Language", yes: true },
        { id: 2, text: "HyperText Markdown Language", yes: false },
        { id: 3, text: "HighText Markup Language", yes: false },
        { id: 4, text: "HomeText Markup Language", yes: false },
      ],
    },
    {
      id: 2,
      question: "Какой тег используется для вставки изображения?",
      otvets: [
        { id: 1, text: "<img>", yes: true },
        { id: 2, text: "<image>", yes: false },
        { id: 3, text: "<src>", yes: false },
        { id: 4, text: "<picture>", yes: false },
      ],
    },
    {
      id: 3,
      question: "Какой атрибут задает ссылку для <a> тега?",
      otvets: [
        { id: 1, text: "href", yes: true },
        { id: 2, text: "src", yes: false },
        { id: 3, text: "link", yes: false },
        { id: 4, text: "ref", yes: false },
      ],
    },
    {
      id: 4,
      question: "Какой тег используется для создания списка с номерами?",
      otvets: [
        { id: 1, text: "<ol>", yes: true },
        { id: 2, text: "<ul>", yes: false },
        { id: 3, text: "<list>", yes: false },
        { id: 4, text: "<li>", yes: false },
      ],
    },
    {
      id: 5,
      question:
        "Какой атрибут используется для задания альтернативного текста изображения?",
      otvets: [
        { id: 1, text: "alt", yes: true },
        { id: 2, text: "title", yes: false },
        { id: 3, text: "description", yes: false },
        { id: 4, text: "src", yes: false },
      ],
    },
  ];

  const [currentQuesti, setcurrentQuesti] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);

  const handleAnswerClick = (answer: Answer) => {
    setResults((prevResults) => [
      ...prevResults,
      {
        question: questions[currentQuesti].question,
        selectedAnswer: answer.text,
        isYes: answer.yes,
        correctAnswer:
          questions[currentQuesti].otvets.find((ans) => ans.yes)?.text || "",
      },
    ]);

    if (currentQuesti < questions.length - 1) {
      setcurrentQuesti(currentQuesti + 1);
    } else {
      setFinished(true);
    }
  };

  const restartTest = () => {
    setcurrentQuesti(0);
    setResults([]);
    setFinished(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Тест</h1>
      {!finished ? (
        <>
          <p>{questions[currentQuesti].question}</p>
          <ul>
            {questions[currentQuesti].otvets.map((answer) => (
              <li
                key={answer.id}
                onClick={() => handleAnswerClick(answer)}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                {answer.text}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <h2>Результаты</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <p>
                  <strong>Вопрос:</strong> {result.question}
                </p>
                <p>
                  <strong>Ваш ответ:</strong>{" "}
                  <span style={{ color: result.isYes ? "green" : "red" }}>
                    {result.selectedAnswer}
                  </span>
                </p>
                {!result.isYes && (
                  <p>
                    <strong>Правильный ответ:</strong> {result.correctAnswer}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <button onClick={restartTest}>Пройти тест заново</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
