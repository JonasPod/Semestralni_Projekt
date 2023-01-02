//deklarování konstant, do kterých vkládáme data z html 
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoItemsList = document.querySelector('.todo-items');
let todos=[];

//event listener, který se spustí při odeslání formuláře a zapne funkci pro přidání jednoho úkolu
todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addTodo(todoInput.value);
});

// funkce pro přidání úkolu. id je v ms uplynulého počítačového času. name je vstup z input="text". completed je defaultně false.
// úkol je vložen do pole úkolů, je spuštěna funkce pro uložení do localStorage a vyprázdněn vstup
function addTodo(item) {
    if(item !== "") {
        const todo = {
            id: Date.now(),
            name: item,
            completed: false,
        };
        todos.push(todo);
        addToLocalStorage(todos);
        todoInput.value = "";
    }
}

// funkce pro výpis úkolů. vyprázdní ul ke každému prvku přiřadí hodnotu proměnné hotovo, třídu item a attribut data-key, kterým je jeho id
// vloží do ul prvek li s checkboxem a tlačítkem pro smazání
function zobrazUkoly(todos) {
    todoItemsList.innerHTML = "";
    todos.forEach(function(item){
        const hotovo = item.completed ? 'checked': null;

        const li = document.createElement('li');
        li.setAttribute('class','item');
        li.setAttribute('data-key',item.id);

        if(item.completed == true) {
            li.classList.add('checked');
        }

        li.innerHTML = `
            <input id="${item.id}" type="checkbox" class="checkbox" ${hotovo} placeholder=".">
            <label for="${item.id}"></label>
            ${item.name}
            <button class="delete-button">X</button>
        `;
        todoItemsList.append(li);
    });
}

//funkce pro vložení do localStorage. z pole todos udělá string a ten tam následně vloží. !!pole vložit nejde!!
// zapne funkci pro výpis
function addToLocalStorage(todos) {
    localStorage.setItem('todos',JSON.stringify(todos));
    zobrazUkoly(todos);
}

// funkce pro načtení dat z localStorage. vezme řetězec z localStorage a přetvoří jej na původní podobu pole. spustí funkci pro výpis
function getFromLocalStorage() {
    const reference = localStorage.getItem('todos');
    if(reference) {
        todos = JSON.parse(reference);
        zobrazUkoly(todos);
    }
}

// Funkce pro změnu hodnoty checked u checkboxu. porovná id prvků s id vstupním a u shody změný hodnotu na její opak
// spustí funkci pro vložení do localStorage
function zmena(id) {
    todos.forEach(function(item){
        if(item.id == id) {
            item.completed = !item.completed;
        }
    });
    addToLocalStorage(todos);
}

// funkce pro smazání. z pole vyfiltruje prvek s id shodným jako id vstupní. následně spustí funkci pro vložení do localStorage
function deleteTodo(id) {
    todos = todos.filter(function(item){
        return item.id != id;
    });
    addToLocalStorage(todos);
}

//spustí funkci pro získání dat z localStorage při načtění
getFromLocalStorage();

// event listener, který se spustí při kliknutí. ověří, jestli se kliklo na checkbox nebo na smazání.
// pokud je výstup pravdivý u kterékoliv z podmínek, tak se spustí příslušná funkce.
// první podmínka kontroluje jestli bylo kliknuto na element s typem "checkbox"
// druhá jestli na element s třídou "delete-button"
todoItemsList.addEventListener('click', function(event){
    if(event.target.type === 'checkbox') {
        zmena(event.target.parentElement.getAttribute('data-key'));
    }
    if(event.target.classList.contains('delete-button')) {
        deleteTodo(event.target.parentElement.getAttribute('data-key'));
    }
});
