"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

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
        question: "Что означает аббревиатура CSS?",
        otvets: [
          { id: 1, text: "Cascading Style Sheets", yes: true },
          { id: 2, text: "Computer Style Sheets", yes: false },
          { id: 3, text: "Creative Style Sheets", yes: false },
          { id: 4, text: "Colorful Style Sheets", yes: false },
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
        question: "Что означает аббревиатура JS?",
        otvets: [
          { id: 1, text: "Medina", yes: true },
          { id: 2, text: "Alim", yes: false },
          { id: 3, text: "Asim", yes: false },
          { id: 4, text: "Mariyam", yes: false },
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
  const [finished, setFinished] = useState(false); // Флаг завершения теста
  const [timeLeft, setTimeLeft] = useState(5); // Таймер для ответа
  const [testStarted, setTestStarted] = useState(false); // Флаг начала теста

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
    <div style={{ padding: "20px" }}>
      <h1>Тест</h1>
      {!testStarted ? (
        <button
          onClick={() => setTestStarted(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Начать тест
        </button>
      ) : !finished ? (
        <>
          <p>{questions[currentQuesti].question}</p>
          <p>Осталось времени: {timeLeft} сек.</p>
          <ul>
            {questions[currentQuesti].otvets.map((answer) => (
              <li
                key={answer.id}
                onClick={() => handleAnswerClick(answer)}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  backgroundColor: "#000",
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
          <button onClick={restartTest} style={{ marginTop: "20px" }}>
            Пройти тест заново
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
