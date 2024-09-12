import { GoogleGenerativeAI } from "@google/generative-ai";

const Result = () => {
  const KEY = "AIzaSyBijzbIDro8hpQHSfxC5BWSCS8Fl4Qn3So";

  const genAI = new GoogleGenerativeAI(KEY);

  const getResponseForGivenPrompt = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`inputValue`);
      const response =  result.response;
      const text =  response.text();
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  return <div></div>;
};

export default Result;
