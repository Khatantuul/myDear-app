import { useReducer } from "react"

export default function MyTestComponent(){

    // const State = {
    //     count: 0,
    //     error: ''
    // }

    // const Action = {
    //     type: 'increment' | 'decrement',

    // }

    function reducer(state, action){
        const {type} = action;

        switch(type){
            case "increment": {
                const newcount =  state.count + 1;
                const hasError = newcount >5;
                return {...state, count: hasError ? state.count : newcount, error: hasError ? " Max reached" : null};
            }
            case "decrement": {
                const newcount =  state.count - 1;
                const hasError = newcount < 0;
                return {...state, count: hasError ? state.count : newcount, error: hasError ? "Min reached": null};
            }
            default: 
            return state;
        }
    }

    const [state, dispatch] = useReducer(reducer,{
        count: 0,
        error: null
    });

    return (
    <div>
        <h1>Test</h1>
        <p>{state.count}</p>
        {state.error && <div style={{backgroundColor: 'blue'}}>{state.error}</div>}
        <button onClick={()=>dispatch({type: 'increment'})}>Increment</button>
        <button onClick={()=>dispatch({type: 'decrement'})}>Decrement</button>
    </div>
    )
}