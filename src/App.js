import { useReducer } from "react";
import {DigitButton} from "./DigitButton";
import { OperationButton } from "./OperationButton";


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION:'choose-operation',
  CLEAR:'clear',
  DELETE_DIGIT:'delete-digit',
  EVALUATE:'evalute'
}

function reducer(state , {type , payload})
{
  // eslint-disable-next-line default-case
  switch(type){

    case ACTIONS.CLEAR:
      return {}
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite){
          return{
            ...state,
            overwrite: false,
            currentop : null
          }
        }

        if(state.currentop == null) return state
        if(state.currentop.lenght === 1) {
          return { 
            ...state , currentop : null
          }
        }
          return{
            ...state,
            currentop : state.currentop.slice(0, -1)
          }
        


      case ACTIONS.EVALUATE:
        if (state.operation == null || state.currentop == null || state.prevop == null){
          return state
        }
        return {
          ...state,
          overwrite: true,
          prevop: null,
          operation:null,
          currentop : evaluate(state)
        }

      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentop == null && state.prevop == null){
          return state
        }
        if(state.currentop == null) {
          return{
            ...state,
            operation:payload.operation
          }
        }
        if(state.prevop == null) {
          return{
            ...state,
            operation : payload.operation,
            prevop: state.currentop,
            currentop : null,
          }
        }

        return {
          ...state,
          // eslint-disable-next-line no-undef
          prevop : evaluate(state),
          operation: payload.operation,
          currentop: null
        }


    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          currentop: payload.digit,
          overwrite : false,
        }
      }
      if(payload.digit === "0" && state.currentop === "0"){
         return  state 
      }
      if(payload.digit === "." && state.currentop === "."){ 
        return state
      }
      return {
        ...state,
        currentop:`${state.currentop || ""}${payload.digit}`,
      }
  }
}

function evaluate({currentop , prevop , operation}) {
          const prev = parseFloat(prevop)
          const current = parseFloat(currentop)
          if(isNaN(prev) || isNaN(current)) return ""
          let computation = ""
          // eslint-disable-next-line default-case
          switch (operation) {
          case"+":
          computation = prev + current
          break
          case"-":
          computation = prev - current
          break
          case"*":
          computation = prev * current
          break
          case"/":
          computation = prev / current
          break
          }
          return computation.toString()
        }

const INTEGER_FORMATER = new Intl.NumberFormat("en-us" , {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if(operand == null) return
  const [integer , decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATER.format(integer)
  return `${INTEGER_FORMATER.format(integer)}.${decimal} `
}

function App() {

  const [{prevop ,currentop , operation } , dispatch] = useReducer(reducer , {})


  return (
    <div className="calculator-grid">
          <div className="output">
            <div className="prevop">{formatOperand(prevop)} {operation}</div>
            <div className="currentop">{formatOperand(currentop)}</div>
          </div>
          <button className="span-two" onClick={()=> dispatch({type : ACTIONS.CLEAR})}>AC</button>
          <button onClick={()=> dispatch({type : ACTIONS.DELETE_DIGIT})}>DEL</button>
          <OperationButton operation="/" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton operation="*" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button className="span-two" onClick={()=> dispatch({type : ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
