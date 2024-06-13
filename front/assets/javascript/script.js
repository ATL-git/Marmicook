
import { Toast } from "toaster-js";
import "toaster-js/default.scss";

const containerRecettes = document.querySelector("#recettes > div");
containerRecettes.classList.add("containerRecettes");
let savePutRecette = [];
let saveAddRecette = [];

const recettesDb = async () => {
    const response = await fetch("http://127.0.0.1:3000/recettes");
    return response.json();
};

const ingredientsDb = async () => {
    const response = await fetch("http://127.0.0.1:3000/ingredients");
    return response.json();
};

function affichRecette(promise) {
    promise().then((res) => {
        const containerRecettes = document.querySelector(".containerRecettes");
        containerRecettes.innerHTML = ""; 
        res.forEach(element => {
            let container = document.createElement("div");
            container.classList.add("recette");
            container.addEventListener('click', function () {
                openModal(element);
            });
            let title = document.createElement("h3");
            title.innerText = element.titre;
            let categorie = document.createElement("p");
            categorie.innerText = element.categorie;
            container.appendChild(title);
            container.appendChild(categorie);
            containerRecettes.appendChild(container);
        });
    });
}
affichRecette(recettesDb);

function openModal(recette) {
    const modalBody = document.querySelector('.modal_body');
    modalBody.innerHTML = `
        <h3 id="modalTitle"></h3>
        <p id="modalCategorie"></p> 
        <p id="modalIngredients"></p>
        <p id="modalDifficulte"></p> 
        <p id="modalInstruction"></p>
        <p id="modalTempsCui"></p>
        <p id="modalTempsPrep"></p>
        <div class="buttonModal">
            <button id="recetteDelete">supprimer</button>
            <button id="recetteModif">modifier</button>
        </div>
    `;

    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.modal').classList.add('modalOpen');
    document.querySelector('#modalTitle').innerText = recette.titre;
    document.querySelector('#modalCategorie').innerText = "Catégorie: " + recette.categorie;
    document.querySelector('#modalIngredients').innerText = "Ingrédients: " + recette.ingredients.map(ing => ing.nom).join(', ');
    document.querySelector('#modalDifficulte').innerText = "Difficulté: " + recette.difficulte;
    document.querySelector('#modalInstruction').innerText = "Instructions: " + recette.instruction;
    document.querySelector('#modalTempsCui').innerText = "Temps de cuisson: " + recette.tempsCuisson;
    document.querySelector('#modalTempsPrep').innerText = "Temps de préparation: " + recette.tempsPrepa;

    document.querySelector("#recetteDelete").addEventListener('click', function () {
        deleteRecette(recette._id);
    });

    document.querySelector("#recetteModif").addEventListener('click', function () {
        modifShow(recette);
    });
}

function closeModal() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.modal').classList.remove('modalOpen');
}

async function deleteRecette(recetteId) {
    await fetch("http://127.0.0.1:3000/recettes/" + recetteId, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    location.reload();
}

async function searchRecette() {
    let checkInput = document.querySelector("input[name='searchOption']:checked").value;
    let searchInput = document.querySelector("#searchBar").value;

    if (!searchInput.trim()) {
        
        affichRecette(recettesDb);
        return;
    }

    const getPromise = async () => {
        const response = await fetch("http://127.0.0.1:3000/recettes?" + checkInput + "=" + encodeURIComponent(searchInput), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    };

    containerRecettes.innerHTML = "";
    affichRecette(getPromise);
}

const searchBar = document.querySelector("#searchBar");

let debounceTimer;
searchBar.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchRecette, 300); // délai de 300ms
});

async function saveRecette(recetteId) {
    const body = {
        "titre": document.querySelector("#modalTitleInput").value,
        "ingredients": savePutRecette,
        "instruction": document.querySelector("#modalInstructionInput").value,
        "tempsPrepa": document.querySelector("#modalTempsPrepInput").value,
        "tempsCuisson": document.querySelector("#modalTempsCuiInput").value,
        "difficulte": document.querySelector("#modalDifficulteInput").value,
        "categorie": document.querySelector("#modalCategorieInput").value
    };

    await fetch("http://127.0.0.1:3000/recettes/" + recetteId, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    closeModal();
    location.reload();
}

async function addSaveRecette(ingredients) {
    const body = {
        "titre": document.querySelector("#titre").value,
        "ingredients": ingredients,
        "instruction": document.querySelector("#instructions").value,
        "tempsPrepa": document.querySelector("#tempsPrepa").value,
        "tempsCuisson": document.querySelector("#tempsCuisson").value,
        "difficulte": document.querySelector("#difficulte").value,
        "categorie": document.querySelector("#categorie").value
    };

    await fetch("http://127.0.0.1:3000/recettes/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    location.reload();
}

function modifShow(recette) {
    const modalBody = document.querySelector('.modal_body');

    modalBody.innerHTML = `
        <input type="text" id="modalTitleInput" value="${recette.titre}">
        <input type="text" id="modalCategorieInput" value="${recette.categorie}">
        <div class="clickIngredients"></div>
        <div class="ingrDB"></div>
        <input type="text" id="modalDifficulteInput" value="${recette.difficulte}">
        <textarea id="modalInstructionInput">${recette.instruction}</textarea>
        <input type="text" id="modalTempsCuiInput" value="${recette.tempsCuisson}">
        <input type="text" id="modalTempsPrepInput" value="${recette.tempsPrepa}">
        <div class="buttonModal">
            <button id="recetteSave">Sauvegarder</button>
            <button id="recetteCancel">Annuler</button>
        </div>
    `;

    affichIngredients(true, recette);

    document.querySelector('#recetteSave').addEventListener('click', function () {
        const selectedIngredients = document.querySelectorAll(".ingrDB .styled");
        savePutRecette = [];
        selectedIngredients.forEach(element => {
            const idattribute = element.getAttribute("data");
            savePutRecette.push(idattribute);
        });

        saveRecette(recette._id);
    });

    document.querySelector('#recetteCancel').addEventListener('click', function () {
        openModal(recette);
    });
}

function affichIngredients(param, recette) {
    ingredientsDb().then((res) => {
        res.forEach(element => {
            const ingrAdd = document.querySelector('.ingrAdd');
            const ingrDB = document.querySelector('.ingrDB');
            let containeringred = document.createElement("p");
            containeringred.innerHTML = element.nom;
            if (param == true) {
                if (recette.ingredients.some(ing => ing._id == element._id)) {
                    containeringred.classList.add("styled");
                    containeringred.setAttribute("data", element._id);
                }
                ingrDB.appendChild(containeringred);
            } else if (param == false) {
                containeringred.classList.add("addIngr");
                ingrAdd.appendChild(containeringred);
            }
            containeringred.classList.add("ingredients");

            containeringred.addEventListener('click', function () {
                containeringred.classList.toggle('styled');
                containeringred.setAttribute("data", element._id);
            });
        });
    });
}

affichIngredients(false);

function addRecette() {
    const datattribute = document.querySelectorAll(".ingrAdd .styled");
    datattribute.forEach(element => {
        const idattribute = element.getAttribute("data");
        saveAddRecette.push(idattribute);
    });

    addSaveRecette(saveAddRecette);
}
