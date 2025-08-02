import React from "react";
import { useState } from "react";
import "./test.css";
import {
  Droppable,
  Draggable,
  DragDropContext,
} from "react-beautiful-dnd";

const col = {
  todo: {
    title: "To Do",
    items: [],
  },
  inProgress: {
    title: "In Progress",
    items: [],
  },
  done: {
    title: "Done",
    items: [],
  },
};

function App() {
  const [columns, setColumns] = useState(clo);
  const [taskText, setTaskText] = useState("");

  const handleAddTask = () => {
    if (taskText.trim() === "") return;
    const newTask = {
      id: `task-${Date.now()}`,
      content: taskText,
    };

    const updateTodo = [...columns.todo.items, newTask];
    setColumns({
      ...columns,
      todo: { ...columns.todo, items: updateTodo },
    });
    setTaskText("");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.DroppableId === destination.DroppableId) {
      const items = [...columns[source.droppableId].items];
      const [recordedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, recordedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          items: items,
        },
      });
    } else {
      const sourceItems = [...columns[source.droppableId].items];
      const destinationItems = [...columns[destination.droppableId].items];
      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...columns[destination.droppableId],
          items: destinationItems,
        },
      });
    }
  };

  return (
    <div className="App">
      <h2> Drag & Drop Task</h2>
      <div className="input-container">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="column">
              <h3>{column.title}</h3>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`droppable-column${
                      snapshot.isDraggingOver ? " dragging-over" : ""
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="task"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
export default App;
