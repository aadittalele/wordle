"use client";
import { useEffect, useRef, useState } from "react";
import { generate } from "random-words";
import { useCookies } from "react-cookie";
import EndScreen from "@/components/EndScreen";

export default function Home({ initialGrid }: { initialGrid?: [string, string][][] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["answer"]);
  const [answer, setAnswer] = useState("blank");
  const [grid, setGrid] = useState(initialGrid || Array.from({ length: 6 }, () => Array(5).fill(["", ""]))); // [letter, status]
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [endScreenProps, setEndScreenProps] = useState({ grid: grid, status: "", answer: "" });
  const [animation, setAnimate] = useState(false);

  const focusOnGrid = () => {
    if (gridRef.current) {
      gridRef.current.focus();
    }
  }

  const keyPress = async (e: React.KeyboardEvent) => {
    e.preventDefault();

    if (e.key == "Enter") {
      await submitWord();
      return;
    }

    const newGrid = [...grid];
    if (e.key == "Backspace") {
      if (xPos > 0) {
        newGrid[yPos][xPos - 1] = ["", ""];
        if (xPos == 0 && grid[yPos][xPos][0] != "") {
          setGrid(newGrid);
          return;
        }
        setXPos(xPos - 1);
        return;
      } else {
        return;
      }
    }

    const isLetter = /^[a-zA-Z]$/.test(e.key);
    if (!isLetter) return;

    if (xPos < 5) {
      newGrid[yPos][xPos] = [(e.key).toUpperCase(), ""];
      setGrid(newGrid);
      setXPos(xPos + 1);
      return;
    }
  }

  const chooseBackground = (color: string) => {
    if (color == "") {
      return "";
    }
    if (color == "g") {
      return "#579949";
    }
    if (color == "y") {
      return "#b0982c";
    }
    if (color == "n") {
      return "gray";
    }
  }

  const submitWord = async () => {
    const curWord = grid[yPos][0][0] + grid[yPos][1][0] + grid[yPos][2][0] + grid[yPos][3][0] + grid[yPos][4][0];
    if (curWord.length != 5) {
      return;
    }

    const newGrid = [...grid];

    const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + curWord).then((data) => {
      return data;
    });
    
    if (res.status == 200) {
      for (let i = 0; i < 5; i++) {
        const indexOfChar = answer.indexOf(curWord[i]);
        if (indexOfChar == -1) {
          newGrid[yPos][i] = [curWord[i], "n"];
        } else if (answer[i] == curWord[i]) {
          newGrid[yPos][i] = [curWord[i], "g"];
        } else {
          newGrid[yPos][i] = [curWord[i], "y"];
        }
      }
      setGrid(newGrid);
      setYPos(yPos + 1);
      setXPos(0);

      if (answer === curWord) {
        setEndScreenProps({ grid: newGrid, status: "w", answer: answer });
        setShowEndScreen(true);
        removeCookie("answer");
        return;
      }
      if (yPos === 5) {
        setEndScreenProps({ grid: newGrid, status: "l", answer: answer });
        setShowEndScreen(true);
        removeCookie("answer");
        return;
      }
    } else {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }
  }

  useEffect(() => {
    const cookieAnswer = cookies.answer;
    if (!cookieAnswer) {
      const toBeAnswer = generate({ exactly: 1, wordsPerString: 1, minLength: 5, maxLength: 5, formatter: (word) => word.toUpperCase() })[0];
      setCookie("answer", toBeAnswer, { path: "/" });
      setAnswer(toBeAnswer);
    } else {
      setAnswer(cookieAnswer);
    }
  }, [cookies]);

  return (<>
    { showEndScreen ? 
      <EndScreen grid={endScreenProps.grid} status={endScreenProps.status} answer={endScreenProps.answer} />
    :
      <div className="flex flex-col items-center outline-none min-h-screen px-6 pt-6 bg-black text-white" tabIndex={0} onClick={focusOnGrid} onKeyDown={keyPress}>
        <p className="text-5xl font-bold py-5">A Wordle Clone</p>
        <div className="text-4xl p-6">
          {grid.map((v_, y) => (
            <div className={`flex my-3 ${animation && y == yPos ? "animate-wiggle" : ""}`} key={y}>
              {v_.map((v, x) => (
                <div className="mx-1.5 w-20 h-20" key={x}>
                  <p className="transition flex justify-center items-center border w-20 h-20 rounded-xl caret-transparent cursor-default" style={{ background: chooseBackground(v[1]), borderColor: chooseBackground(v[1]) }}>{v[0]}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <button onClick={submitWord} className="px-4 py-2 rounded-xl bg-green-600 font-semibold text-3xl border-2 border-green-700 transition hover:bg-green-700">TRY IT!</button>
      </div>
    }
  </>);
}
