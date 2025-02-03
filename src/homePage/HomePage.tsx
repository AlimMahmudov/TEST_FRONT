"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import scss from "./HomePage.module.scss";

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
  const questions: Question[] = useMemo(
    () => [
      {
        id: 1,
        question: "Что означает аббревиатура CSS?",
        otvets: [
          { id: 1, text: "Cascading Style Sheets", yes: true },
          { id: 2, text: "Computer Style Sheets", yes: false },
          { id: 3, text: "Creative Style Sheets", yes: false },
          { id: 4, text: "Colorful Style Sheets", yes: false },
        ],
      },
      {
        id: 2,
        question: "Что означает аббревиатура HTML?",
        otvets: [
          { id: 1, text: "HyperText Markup Language", yes: true },
          { id: 2, text: "HyperText Markdown Language", yes: false },
          { id: 3, text: "HighText Markup Language", yes: false },
          { id: 4, text: "HomeText Markup Language", yes: false },
        ],
      },

      {
        id: 3,
        question: "Что означает аббревиатура JS?",
        otvets: [
          { id: 1, text: "JavaScript", yes: true },
          { id: 2, text: "JavaSource", yes: false },
          { id: 3, text: "JustScript", yes: false },
          { id: 4, text: "Java", yes: false },
        ],
      },
      {
        id: 4,
        question: "Какой тег используется для создания ссылки в HTML?",
        otvets: [
          { id: 1, text: "<a>", yes: true },
          { id: 2, text: "<link>", yes: false },
          { id: 3, text: "<href>", yes: false },
          { id: 4, text: "<url>", yes: false },
        ],
      },
      {
        id: 5,
        question:
          "Какой метод используется для добавления элемента в конец массива в JavaScript?",
        otvets: [
          { id: 1, text: "push()", yes: true },
          { id: 2, text: "pop()", yes: false },
          { id: 3, text: "unshift()", yes: false },
          { id: 4, text: "shift()", yes: false },
        ],
      },
      {
        id: 6,
        question: "Какой селектор CSS выбирает все элементы?",
        otvets: [
          { id: 1, text: "*", yes: true },
          { id: 2, text: "#", yes: false },
          { id: 3, text: ".", yes: false },
          { id: 4, text: "all", yes: false },
        ],
      },
      {
        id: 7,
        question:
          "Какой оператор используется для строгого сравнения в JavaScript?",
        otvets: [
          { id: 1, text: "===", yes: true },
          { id: 2, text: "==", yes: false },
          { id: 3, text: "=", yes: false },
          { id: 4, text: "!=", yes: false },
        ],
      },
      {
        id: 8,
        question:
          "Какой способ объявления функции в JavaScript является устаревшим?",
        otvets: [
          { id: 1, text: "function expression", yes: false },
          { id: 2, text: "arrow function", yes: false },
          { id: 3, text: "function declaration", yes: false },
          { id: 4, text: "var function", yes: true },
        ],
      },
      {
        id: 9,
        question:
          "Какой метод используется для преобразования JSON в объект JavaScript?",
        otvets: [
          { id: 1, text: "JSON.parse()", yes: true },
          { id: 2, text: "JSON.stringify()", yes: false },
          { id: 3, text: "parseJSON()", yes: false },
          { id: 4, text: "toObject()", yes: false },
        ],
      },
    ],
    []
  );

  const [currentQuesti, setcurrentQuesti] = useState(0);
  const [results, setResults] = useState<
    {
      question: string;
      selectedAnswer: string;
      isYes: boolean;
      correctAnswer: string;
    }[]
  >([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [testStarted, setTestStarted] = useState(false);

  const nextQuestion = useCallback(() => {
    if (currentQuesti < questions.length - 1) {
      setcurrentQuesti((prev) => prev + 1);
      setTimeLeft(5);
    } else {
      setFinished(true);
    }
  }, [currentQuesti, questions.length]);

  const skipQuestion = useCallback(() => {
    setResults((prevResults) => [
      ...prevResults,
      {
        question: questions[currentQuesti].question,
        selectedAnswer: "Пропущено",
        isYes: false,
        correctAnswer:
          questions[currentQuesti].otvets.find((ans) => ans.yes)?.text || "",
      },
    ]);
    nextQuestion();
  }, [currentQuesti, questions, nextQuestion]);

  useEffect(() => {
    if (testStarted && !finished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (testStarted && !finished && timeLeft === 0) {
      skipQuestion();
    }
  }, [timeLeft, testStarted, skipQuestion, finished]);

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
    nextQuestion();
  };

  const restartTest = () => {
    setcurrentQuesti(0);
    setResults([]);
    setFinished(false);
    setTimeLeft(5);
    setTestStarted(false);
  };

  return (
    <div id={scss.Home}>
      <div className="container">
        <div className={scss.home}>
          <h1>Тест</h1>
          {!testStarted ? (
            <button onClick={() => setTestStarted(true)}>Начать тест</button>
          ) : !finished ? (
            <>
              <p>{questions[currentQuesti].question}</p>
              <p>Осталось времени: {timeLeft} сек.</p>
              <ul>
                {questions[currentQuesti].otvets.map((answer) => (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerClick(answer)}
                  >
                    {answer.text}
                  </button>
                ))}
              </ul>
            </>
          ) : (
            <div className={scss.end}>
              <h2>Результаты</h2>
              <ul>
                {results.map((result, index) => (
                  <button key={index}>
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
                        <strong>Правильный ответ:</strong>{" "}
                        {result.correctAnswer}
                      </p>
                    )}
                  </button>
                ))}
              </ul>
              <button onClick={restartTest}>Пройти тест заново</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
