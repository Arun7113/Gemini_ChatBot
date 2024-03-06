import { useEffect, useState } from "react"

const App=()=> {
  const [value,setValue]=useState("")
  const [error,setError]=useState("")
  const[chatHistory,setChatHistory]=useState([])
  const surpriseOptions=[
    "who won the latest Novel Peace Prize?",
    "where does pizza come from?",
    "who do you make a BLT sandwich"
  ]
  const surprise=()=>{
    const randomValue=surpriseOptions[Math.floor(Math.random()*surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse= async () => {
    if(!value){
      setError("Error! Please ask a question!")
      return
    }
    try{
      const options={
        method :"post",
        body:JSON.stringify({
          history:chatHistory,
          message:value
        }),
        headers:{
          "Content-Type":"application/json"
        }
      }
      const response =await fetch ("http://localhost:8000/gemini_chatbot",options)
      const data= await response.text()
      console.log(data)
      setChatHistory(oldChatHistory =>[...oldChatHistory,{
        role:"user",
        parts:value
      },
    {
      role:"model",
      parts:data
    }
    ])
    setValue("")

    }catch(error){
      console.error(error)
      setError("something went wrong!Please try again later")
    }
  }


  const clear= ()=>{
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
    <div className="app">
     

      <p>What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>surprise me</button>
         </p>

         <div className="input-container">
          
          <input
          value={value}
          placeholder="when is Christmas...?"
          onChange={(e) =>setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Ask me</button>}
         {error && <button onClick={clear}>Clear</button>}
         </div>

    {error && <p>{error}</p> }

    <div className="search-result">
    {chatHistory.map((chatItem, _index)=><div key={_index}>
      <p className="answer">{chatItem.role}:{chatItem.parts}</p>
    </div>)}
    </div>

    </div>
  )
}

export default App;
