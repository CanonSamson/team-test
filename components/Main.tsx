"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { db } from "../firebase";
import { questions } from "@/content/questions";
import { doc, setDoc, collection, query, onSnapshot } from "firebase/firestore";


interface Answers {
  [key: string]: string; 
}

interface Teammate {
  name: string;
  answers: Answers;
}

const calculateMatchScore = (
  person1Answers: Answers,
  person2Answers: Answers
) => {
  let score = 0;

  for (const key in person1Answers) {
    if (person1Answers[key] === person2Answers[key]) {
      score++;
    }
  }

  return score;
};

const findBestMatches = (
  name: string,
  answers: Answers,
  teamMates: Teammate[]
) => {
  console.log(name);
  const scores = teamMates.map((teammate) => ({
    name: teammate.name,
    score: calculateMatchScore(answers, teammate.answers),
  }));

  const maxScore = Math.max(...scores.map((score) => score.score));

  return scores
    .filter((score) => score.score === maxScore)
    .map((score) => score.name);
};

export default function Main() {
  const [answers, setAnswers] = useState<Answers>({});
  const [userName, setUserName] = useState("");
  const [teamMates, setTeamMates] = useState<Teammate[]>([]);
  const [bestMatches, setBestMatches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    setAnswers({ ...answers, [index]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "answers", userName);
      await setDoc(docRef, { name: userName, answers });

      alert("Your answers have been submitted!");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("There was an error submitting your answers.");
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = () => {
    // Find best matches after data is fetched
    const matches = findBestMatches(userName, answers, teamMates);
    setBestMatches(matches);
  };
  useEffect(() => {
    const q = query(collection(db, "answers"));

    // Set up the real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const teamData: Teammate[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name !== userName) {
            teamData.push({ name: data.name, answers: data.answers });
          }
        });

        setTeamMates(teamData);
      },
      (error) => {
        console.error("Error fetching real-time updates:", error);
      }
    );

    // Cleanup function to unsubscribe from the real-time updates
    return () => {
      unsubscribe();
    };
  }, [userName]); // Add `userName` as a dependency if it changes and you want to re-run the effect

  return (
    <div className="container mx-auto p-4">
      <main className="flex-col  max-w-[700px] mx-auto flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">
            Discover Your Ideal Teammates LOL
          </h1>
          <p className="text-lg text-gray-700">
            {
              "  Answer these questions to find out who you'll enjoy working with the most. Dive in and get to know your future team!"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="grid">
            <label className="text-lg font-semibold">Name</label>
            <input
              placeholder="User Name"
              className="h-[45px] border rounded-lg bg-white p-2"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
          </div>
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex border rounded-xl p-4 bg-white shadow-lg flex-col"
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

          <div className="grid space-y-4 gap-2">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex border rounded-xl p-4 bg-white shadow-lg flex-col">
                <em>
                  Based on everyone&apos;s answers, the best match(es) for{" "}
                  {userName} would be: {bestMatches.join(", ")}
                </em>
              </div>
            )}
          </div>

          <div className="  inline-flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-full"
            >
              Submit Answers {Object.keys(answers).length}
            </button>
            <button
              onClick={() => handleMatch()}
              type="button"
              className="border-blue-500 rounded-full border  text-blue-500 p-2 "
            >
              Find Best Matches
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
