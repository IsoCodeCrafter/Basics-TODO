
import axios from "axios"
import { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from "./Components/Loading";
import ListItem from "./Components/ListItem";
//Base URL
axios.defaults.baseURL = "http://localhost:3040";
//Unique ID
import { v4 as uuidv4 } from 'uuid';

import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"

function App() {
  const [todos, setTodos] = useState([])
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage]=useState()
  const [totalItem, setTotalItem]=useState()


  const options = {
    params: {
      _limit: 5,
      _page: page
    },

  }


  useEffect(() => {
    axios.get('http://localhost:3040/todos', options)
      .then((res) => {

        const itemCount = Number(res.headers['x-total-count'])


        const totalPage= Math.ceil(itemCount/options.params._limit)
        setTotalItem(itemCount)
        setMaxPage(totalPage)

        setTodos(res.data)


      });

  }, [page])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!e.target[0].value) {
      alert('Please enter a value!')
      return
    }

    const newTodo = {
      id: uuidv4(),
      title: e.target[0].value,
      date: new Date().toLocaleString(),
      isDone: false
    }



    axios.post("/todos", newTodo)
      .then(() => {
        if(todos.length === options.params._limit){
          setPage(totalItem % options.params._limit === 0 ? maxPage +1 : maxPage)
          const newPage = page +1;
          setPage(newPage)
        } else {
          setTodos([...todos, newTodo])
        }
        

      
      
      })
      .catch((err) => alert('FATAL ERROR '))

    e.target[0].value = ""

  }

  return (

    <div className="container my-4 border shadow">
      <h2 className="my-3 text-center">TESTING</h2>
      <form onSubmit={handleSubmit} className="d-flex gap-3 p-2 my-3">
        <input className="form-control shadow" type="text" />
        <button className="btn btn-success">Send</button>
      </form>
      <div className="my-5 d-flex flex-column gap-2">
        {todos === null && <Loading />}
        {todos?.map((todo) => (
          <ListItem page={page} maxPage={maxPage} setPage={setPage} allTodos={todos} setTodos={setTodos} todo={todo} key={todo.id} />

        ))}
      </div>

      <div className=" py-1 mb-2 d-flex justify-content-between align-items-center">
        <button
          disabled={page === 1}
          className="btn btn-dark d-flex align-items-center gap-2"
          onClick={() => setPage(page - 1)}> <AiFillCaretLeft />  Previous</button>
        <p className="fs-5 fw-bold border  py-1 px-3 rounded bg-dark text-light">{page}</p>
        <button
          disabled={page === maxPage}
          className="btn btn-dark d-flex align-items-center gap-2"
          onClick={() => setPage(page + 1)}> Next <AiFillCaretRight /></button>
      </div>

    </div>
  )
}

export default App
