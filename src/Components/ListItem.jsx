import axios from 'axios'
import React, { useState } from 'react'
import {FcCheckmark} from "react-icons/fc"
import {AiOutlineClose} from "react-icons/ai"



const ListItem = ({ todo, allTodos, setTodos,page , maxPage , setPage }) => {
    const [isEditMode, setIsEditMode] = useState(false)

    const handleDelete = () => {
        axios.delete(`/todos/${todo.id}`)
            .then(() => {
                const filtered = allTodos.filter((t) => t.id !== todo.id)
                setTodos(filtered)
                if (filtered.length % 5 === 0 && filtered.length === allTodos.length - 1) {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                  }
            })
            .catch((err) => alert('FATAL ERROR'))


    }
    const handleChange = () => {
        const updated = { ...todo, isDone: !todo.isDone }
        axios
            .put(`/todos/${updated.id}`, updated)
            .then(() => {
                const newTodos = allTodos.map((t) =>
                    t.id === updated.id ? updated : t
                );
                setTodos(newTodos)
            })
            .catch((err)=> alert('FATAL ERROR'))

    }

    const handleEdit = (e) => {
        e.preventDefault();

        const newTitle = e.target[0].value;

        const updated = {...todo, title:newTitle};


        axios.put(`/todos/${updated.id}`, updated)
        .then (()=>{
            const newTodos=allTodos.map((t)=> t.id === updated.id ? updated : t)
            setTodos(newTodos);
            setIsEditMode(false)

        })
    }


    return (
        <li className='d-flex gap-5 align-items-center justify-content-between border shadow p-2'>
            <div className='d-flex align-item-center gap-2'>
                <input checked={todo.isDone}
                    onChange={handleChange}
                    type="checkbox"
                />
                <span> {todo.isDone ? 'DONE' : 'PROCESS'}</span>
            </div>
            {!isEditMode ? <span>{todo.title}</span> :
                <form onSubmit={handleEdit} className='d-flex gap-2'>
                    <input defaultValue={todo.title} className='form-control' type="text" />
                    <button type="Submit" className='btn border bg-dark '><FcCheckmark/></button>
                    <button type="button" onClick={()=> setIsEditMode(false)} className='btn btn-warning '><AiOutlineClose/></button>
                </form>

            }

            {!isEditMode ?
                <div className='btn-group'>
                    <button
                        disabled={isEditMode}
                        className='btn btn-success'
                        onClick={() => setIsEditMode(true)}
                    >Edit</button>
                    <button
                        className='btn btn-danger'
                        onClick={handleDelete}>Delete</button>
                </div> : <div></div>}



        </li>
    )
}

export default ListItem