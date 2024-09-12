"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { db } from "../firebase";
import { questions } from "@/content/questions";
import { collection, doc, setDoc } from "firebase/firestore";

// types/models.ts
export interface Question {
  question: string;
  options: string[];
}

export interface Answers {
  [key: number]: string;
}

export default function Home() {
  const [answers, setAnswers] = useState<Answers>({});
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    setAnswers({ ...answers, [index]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const docRef = doc(db, "answers", userName);
      await setDoc(docRef, answers);
      alert("Your answers have been submitted!");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("There was an error submitting your answers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <main className=" flex-col flex items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold">Team Question Game</h1>
          <p>Get to Know you will Love Working with</p>
          {questions.length}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4  p-4">
          <div className=" grid">
            <label className="text-lg font-semibold">User Name</label>
            <input
              placeholder="User Name"
              className=" h-[45px] border rounded-lg bg-white p-2 "
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              value={userName}
            />
          </div>
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex border rounded-xl p-4  bg-white shadow-lg flex-col"
            >
              <label className="text-lg font-semibold">
                {question.question}
              </label>
              <div className="space-y-2">
                {question.options.map((option, i) => (
                  <div key={i} className="flex items-center">
                    <input
                      type="radio"
                      id={`q${index}_o${i}`}
                      name={`q${index}`}
                      value={option}
                      onChange={(e) => handleChange(e, index)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor={`q${index}_o${i}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
