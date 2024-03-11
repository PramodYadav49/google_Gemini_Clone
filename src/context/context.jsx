import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
  const newChat =()=>{
    setLoading(false);
    setShowResult(false);

  }

  const onSend = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if(prompt !== undefined){
        response =await runChat(prompt);
        setRecentPrompt(prompt)
    }
    else{
        setPrevPrompts(prev=>[...prev,input]);
        setRecentPrompt(input);
        response =await runChat(input);
    }
   
    let responseArray = response.split("**");
    let newResonse="";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResonse += responseArray[i];
      } else {
        newResonse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResonse.split("*").join("</br>");
    let newResoponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResoponseArray.length; i++) {
      const nextWord = newResoponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSend,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
