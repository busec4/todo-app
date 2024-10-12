import React, {act, useEffect, useReducer,useRef} from 'react';
import { v4 as uuidv4 } from 'uuid';


/*
    yapılacaklar:tasks {
        text
        id
        done
        edited
    }
*/ 
function tasksReducer(tasks, action){

    switch(action.type) {
        case "added": {
            return [...tasks,action.payload];
            
        }
        case "deleted": {
            return tasks.filter((_,index) => index !== action.id);
        }
        case "changeEdit": {
            return tasks.map((task,index) =>{
                index === action.id ? {...task, edited: !task.edited} : task
            })
        }
        case "edited": {
            return tasks.map((task,index) =>{
                index === action.id ? {...task, text: action.text} : task
            })
        }
        case "completed": {
            return tasks.map((task,index) => 
                index === action.id ? {...task, done: !task.done} : task
            )
        }
        default: {
            throw Error('Unknown Action' + action.type);
        }
    }
}

function ToDoApp(){

    const [tasks, dispatch] = useReducer(tasksReducer,[], () => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    })

    useEffect(() =>{
        localStorage.setItem("tasks",JSON.stringify(tasks))
    },[tasks]);
    const inputRef = useRef(null);
    // const editRef = useRef(null);
    function handleAddedTask(){
        const text = inputRef.current.value;
        if (text.trim() !== "") {
            dispatch({
                type: 'added',
                payload:{text: text.trim(),id:uuidv4(),done:false,edited:false}
            });
            inputRef.current.value = '';
        }
        
    }
    function handleDeleteTask(index){
        dispatch({
            type:'deleted',
            id:index,
        })
    }
    function handleEditChange(index){
        dispatch({
            type:'changeEdit',
            id:index,
        })
    }
    function handleEditTask(e,index){
        const editedText = e.target.value;
        dispatch({
            type:'edited',
            payload:{id:index,text:editedText.trim()}
        });
    }
    function handleCompleteTasks(index){
        dispatch({
            type:'completed',
            id:index,
        })
    }
    return(
        <div className="todo-container">
                <h2>TODO LIST</h2>
                <h3>Add Item</h3>
                <p>
                    <input ref={inputRef} placeholder="Enter New Task"  />
                    <button id='add-btn' onClick={handleAddedTask}>Add</button>
                </p>
                <h3>TODO</h3>
                <ul className="incomplete-tasks">
                    {tasks.map((task, index) =>(!task.done && 
                    <>
                        <div>
                            <input type="checkbox"  checked={task.done} onClick={() => handleCompleteTasks(index)} />
                            {task.edited ? (<input type="text" defaultValue={task.text} onChange={(e) => handleEditTask(e,index)}/>):(
                            <li  key={task.id}>{task.text}</li>
                            )}

                            <button id="edit-btn" onClick={() => handleEditChange(index)}>Edit</button>
                            <button id="delete-btn" onClick={() => handleDeleteTask(index)}>Delete</button>
                        </div>
                        </>
                    )
                    )}
                </ul>
                <h3>COMPLETE</h3>
                <ul className="complete-tasks">
                    {tasks.map((task, index) =>(task.done && 
                    <>
                        <div>
                            <input type="checkbox"  checked={task.done} onClick={() => handleCompleteTasks(index)} />
                            {task.edited ? (<input type="text" defaultValue={task.text} onChange={(e) => handleEditTask(e,index)}/>):(
                            <li  key={task.id}>{task.text}</li>
                            )}

                            <button id="edit-btn" onClick={() => handleEditChange(index)}>{task.edited ? "Save" : "Edit"}</button>
                            <button id="delete-btn" onClick={() => handleDeleteTask(index)}>Delete</button>
                        </div>
                        </>
                    )
                    )}
                </ul>
            </div>
        );
}


export default ToDoApp