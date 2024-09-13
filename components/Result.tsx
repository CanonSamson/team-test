import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
// Import Firestore methods
import {
  collection,
  query,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase"; // Make sure your Firebase config is set up

// Define the structure of answers and teammates
interface Answers {
  [key: string]: any; // Adjust the type based on your answers structure
}

interface Teammate {
  name: string;
  answers: Answers;
}

interface ResultProps {
  answers: Answers;
  name: string;
}

const Result = ({ answers, name }: ResultProps) => {
  const [teamMates, setTeamMates] = useState<Teammate[]>([]);
  const [response, setResponse] = useState<string>("");
  const KEY = "AIzaSyBijzbIDro8hpQHSfxC5BWSCS8Fl4Qn3So";

  // Initialize GoogleGenerativeAI with API key
  const genAI = new GoogleGenerativeAI(KEY);

  // Fetch answers from Firebase Firestore
  const getAnswers = async () => {
    try {
      const collectionRef = collection(db, "answers");
      const q = query(
        collectionRef,
        where("name", "!=", name) // Fetch answers that don't belong to the user
      );
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      const teamAnswers: Teammate[] = querySnapshot.docs.map(
        (doc) => doc.data() as Teammate
      );
      setTeamMates(teamAnswers);
    } catch (error) {
      console.error("Error fetching team mates:", error);
    }
  };

  const text = `
  Here is the game we are playing: 

  I want to create a question game for my team, focusing on both work-related questions and fun, personal ones—such as the type of people
  they’d enjoy working with. After everyone answers the questions, I’d like to compare the responses and reveal to each team member who, based on the answers, would be their ideal colleague in the team. 

  Who is ${name} likely to love working with the most?

  Here are ${name}'s answers: ${Object.values(answers)}

  Here are other teammates' answers: ${teamMates
    .map(
      (teammate) =>
        `Teammate Name: ${teammate.name}, answers: ${Object.values(
          teammate.answers
        )}`
    )
    .join(", ")}

  Return teammate names and tell me if they are a good fit.
  `;

  // Generate AI response
  const getResponseForGivenPrompt = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(text);
      const responseText = result.response.text();
      setResponse(responseText);
      console.log("Generated response:", responseText);
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  return (
    <div className="grid gap-2">
      <pre>{text}</pre>
      <br />
      <button onClick={getAnswers}>Get Team Answers</button>
      <button onClick={getResponseForGivenPrompt}>Submit</button>
      <div>{response}</div>
    </div>
  );
};

export default Result;
