import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import {useAppDispatch,useAppSelector} from './app/hooksDemo'

import {incremented, amountAdded} from './features/counter/counterslice'
import { addTitle } from './features/counter/titleSlicse'
import {useFetchBreedsQuery} from './features/dogs/dogsSlice'
import {useFetcAllMembersQuery} from './features/dogs/dogsSlice'
function App() {
  //const [count, setCount] = useState(0)
  const count = useAppSelector((state) => state.counter.value);
  const title = useAppSelector((state) => state.title.title)
  const dispatch = useAppDispatch();

  const {data ,isFetching} = useFetchBreedsQuery();
  const {data: members, isFetching: isFetchingMembers} = useFetcAllMembersQuery();
  function handleClick(){
    dispatch(incremented());
    dispatch(amountAdded(2));
  }
  function handleTitleClick(){
    dispatch(addTitle("Moshe"))
  }
  if(members)
    console.log("members", members )
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={handleTitleClick}>Hello Vite + React!  {title}</p>
        <p>
          <button type="button" onClick={handleClick}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <div>
          is fetching Members: {isFetchingMembers ? "yes" : "No"}
          
        </div>
        <div>{isFetchingMembers ? "yes" : `Fetch ${members?.data?.length} members`}</div>
        <div>
          <p>Number of dogs fetch: {data?.data?.length}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Picture</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((breed) => (
                <tr key={breed._id}>
                  <td>
                    {breed.title}
                  </td>
                  <td>
                    {breed.description}
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
