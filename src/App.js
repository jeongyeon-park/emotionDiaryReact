import React, { useRef, useReducer, useEffect } from 'react';

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home'
import New from './pages/New'
import Edit from './pages/Edit'
import Diary from './pages/Diary';

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      newState = [action.data, ...state];
      break;
    }
    case 'REMOVE': {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case 'EDIT': {
      newState = state.map((it) => it.id === action.data.id ? { ...action.data } : it);
      console.log(newState);
      break;
    }
    default:
      return state;
  }
  localStorage.setItem('diary', JSON.stringify(newState));
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();


function App() {

  useEffect(() => {
    const localData = localStorage.getItem('diary');
    if (localData) {
      if (localData.length) {
        const diaryList = JSON.parse(localData).sort((a, b) => parseInt(b.id) - parseInt(a.id));
        dataId.current = parseInt(diaryList[0].id) + 1;

        dispatch({ type: "INIT", data: diaryList });
      }
    }
  }, []);

  const [data, dispatch] = useReducer(reducer, []);

  console.log(new Date().getTime());

  const dataId = useRef(0);
  //CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion
      }
    });
    dataId.current += 1;
  }
  //REMOVE
  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }
  //EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        emotion,
        content,
        date: new Date(date).getTime(),
      }
    })
  }

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider
        value={{
          onCreate,
          onRemove,
          onEdit
        }}
      >
        <BrowserRouter>
          <div className="App">

            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/new" element={<New />}></Route>
              <Route path="/edit/:id" element={<Edit />}></Route>
              <Route path="/diary/:id" element={<Diary />}></Route>
            </Routes>

          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>

    </DiaryStateContext.Provider>

  );
}

export default App;
