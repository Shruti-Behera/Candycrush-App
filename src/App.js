import React, { useEffect, useState } from "react";
import "./style.css";
import blueCandy from "./images/blue-candy.png"
import blank from "./images/blank.png"
import orangeCandy from "./images/orange-candy.png"
import greenCandy from "./images/green-candy.png"
import purpleCandy from "./images/purple-candy.png"
import redCandy from "./images/red-candy.png"
import yellowCandy from "./images/yellow-candy.png"

const width = 8;
const candycolors = [blueCandy, orangeCandy,greenCandy, purpleCandy,redCandy,yellowCandy];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const[squareBeingDragged,setSquareBeingDragged]=useState(null)
  const[squareBeingReplaced,setSquareBeingReplaced]=useState(null)

  const checkForColoumnsofFour = () => {
    for (let i = 0; i <= 39; i++) {
      const coloumnOfFour = [i, i + width, i + width * 2,i+width*3];
      const decidedColor = currentColorArrangement[i];

      if (
        coloumnOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        coloumnOfFour.forEach(
          (square) => (currentColorArrangement[square] =blank)
        );
        return true;
      }
    }
  };

  const checkForColoumnsofThree = () => {
    for (let i = 0; i <= 47; i++) {
      const coloumnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];

      if (
        coloumnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        coloumnOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };
  const checkForRowsofFour = () => {
    for (let i = 0; i <= 64; i++) {
      const rowOfFour = [i, i + 1, i + 2,i+3];
      const decidedColor = currentColorArrangement[i];
      const notValid=[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]
      if(notValid.includes(i)) continue
      if (
        rowOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        rowOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };
  const checkForRowsofThree = () => {
    for (let i = 0; i <= 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
      if(notValid.includes(i)) continue
      if (
        rowOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        rowOfThree.forEach(
          (square) => (currentColorArrangement[square] =blank)
        );
        return true;
      }
    }
  };
  const moveIntoSquareBelow=()=>{
    for(let i=0;i<=55;i++){
      const firstRow=[0,1,2,3,4,5,6,7]
      const isFirstRow=firstRow.includes(i)

      if(isFirstRow && currentColorArrangement[i]===blank){
      let randomNumber=Math.floor(Math.random()  *  candycolors.length)
      currentColorArrangement[i]=candycolors[randomNumber]        
      }
      if((currentColorArrangement[i+width])===blank){
        currentColorArrangement[i+width]=currentColorArrangement[i]
        currentColorArrangement[i]=blank
      }
    }
  }

  const dragStart=(e)=>{
  setSquareBeingDragged(e.target);
  }
  const dragDrop=(e)=>{
    setSquareBeingReplaced(e.target)
  }
  const dragEnd=(e)=>{
    const squareBeingDraggedId=parseInt(squareBeingDragged.getAttribute('data-id')) 
    const squareBeingReplacedId=parseInt(squareBeingReplaced.getAttribute('data-id'))  
   currentColorArrangement[squareBeingReplacedId]=squareBeingDragged.getAttribute('src')
   currentColorArrangement[squareBeingDraggedId]=squareBeingReplaced.getAttribute('src')

   const validMoves=[
    squareBeingDragged -1,
    squareBeingDragged -width,
    squareBeingDragged +1,
    squareBeingDragged + width
   ]
   const validMove=validMoves.includes(squareBeingReplacedId)
    const isColoumnOfFour  =  checkForColoumnsofFour()
    const isColoumnOfThree =  checkForColoumnsofThree()
    const isRowOfFour      =  checkForRowsofFour()
    const isRowOfThree     =  checkForRowsofThree()

    if(squareBeingReplaced 
      && validMove 
      && (isColoumnOfFour || isColoumnOfThree || isRowOfFour || isRowOfThree) ){
     setSquareBeingDragged(null)
     setSquareBeingReplaced(null)
    }else{
      currentColorArrangement[squareBeingReplacedId]=squareBeingReplaced.getAttribute('src')
      currentColorArrangement[squareBeingDraggedId]=squareBeingDragged.getAttribute('src')
     }
     setCurrentColorArrangement([...currentColorArrangement])
  }
  

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candycolors[Math.floor(Math.random() * candycolors.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };
  useEffect(() => {
    createBoard();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColoumnsofFour();
      checkForColoumnsofThree();
      checkForRowsofFour();
      checkForRowsofThree();
      moveIntoSquareBelow();
     
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [checkForColoumnsofThree,currentColorArrangement,checkForColoumnsofFour,checkForRowsofThree,checkForRowsofFour,moveIntoSquareBelow]);

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e)=>e.preventDefault()}
            onDragEnter={(e)=>e.preventDefault()}
            onDragLeave={(e)=>e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
