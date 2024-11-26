import { element } from "prop-types";
import React, { useEffect, useState } from "react";


//create your first component
const Home = () => {

	//Declaración de algunas variables
	const [tarea, setTarea] = useState("");
	const [tareas, setTareas] = useState([]);
	const urlUsuario = "https://playground.4geeks.com/todo/users/Alejandro";
	
	const traerUsuario = () => {
		//fetch con un condicional el cual comprueba si el usuario "Alejandro" existe y si no, lo crea
		fetch(urlUsuario)
			.then(response => {
				if (response.status === 404) {
					return fetch(urlUsuario, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						}
					});
				} else {
					return response.json();
				}
			})
			.then(data => {
				setTareas(data.todos)
			})
			.catch(error => {
				console.error("Error:", error);
			});
	}

	useEffect(() => {
		traerUsuario()
	}, [])

	//Función flecha para añadir tareas implementando el método POST
	const addTarea = (newTask) => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const raw = JSON.stringify({
			"label": newTask,
			"is_done": false
		});
		fetch("https://playground.4geeks.com/todo/todos/Alejandro", {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				setTareas([...tareas, newTask])
				traerUsuario()
			})
			.catch((error) => console.error(error));

	}

	//Función flecha para eliminar tareas implementando el método DELETE
	const deleteTarea = (id) => {
		const newTasks = tareas.filter((task) => task.id !== id);
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE"
		})
			.then(() => setTareas(newTasks))
			.catch((error) => console.error(error));
	}

	return (
		<div className="App">
			<div>
				<h1>Lista de tareas Fetch:</h1>
				<input className="escribir" type="text" placeholder="Añadir una nueva tarea..."
					onChange={(e) => { setTarea(e.target.value) }}
					value={tarea} onKeyDown={(e) => {
						if (e.key === "Enter") {
							addTarea(tarea);
							setTarea("");
						}
					}}
				/>
			</div>
			<div className="lista">
				<ul>
					{tareas.map((element) => {
						return (
							<li key={element.id} className="task-item">
								<div>
									• {element.label}
								</div>
								<div>
									<button className="delete-btn"
										onClick={() =>
											deleteTarea(element.id)}>X
									</button>
								</div>
							</li>
						);
					})}
					<li className="contarTareas">
						{tareas.length === 0 ? "No hay tareas pendientes" :
							`Tienes ${tareas.length} tarea${tareas.length > 1 ? 's' : ''}
                        pendiente${tareas.length > 1 ? 's' : ''}`}
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Home;