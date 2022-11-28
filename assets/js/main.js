const loadMore = document.getElementById('loadMorePokemons')
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const searchField = document.getElementById('pokeSearch')

const maxRecords = 151

const limit = 12;
let offset = 0;


let count = 1;
let selectedType = '';

let aux = 0;

const loadMorePokemon = (offset, limit, type ) => {
    pokemonList.style.display = 'none';

    type = (type === 'all') ? '' : type;

    pokeApi.getPokemons(offset, limit).then((allPokemons = [] ) => {

        if(type) return allPokemons.map((p) => {if(p.type === type) return p});
        return allPokemons;

    }).then((pokemons) => {
    
        pokemons = pokemons.filter(p => {return p !== undefined})

        if (pokemons.length === 0) {
            aux += 500;
            loadPokemonItens(offset, aux, type);
            return;
        }

        pokemonList.style.display = '';

        const items = pokemons.map((pokemon) => 
            `<li class="pokemon container pokemonBg" onclick='showDetails("${pokemon.name}")'>
                <div class="container">
                <img class="container" src="${pokemon.photo}" 
                alt="${pokemon.name}">
                </div>
                <span class="number container">N°${pokemon.number}</span>
                <span class="name container">${pokemon.name}</span>
                <div class="detail container">
                    <ol class="types container">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                </div>
                </div>
            </li>`
        ).join('');
    
            if (count > 0) pokemonList.innerHTML += items;
            else pokemonList.innerHTML = items;
        }
    )}  


//Botão de Carregamento de mais itens 
loadMoreButton.addEventListener('click', () => {
    count++;
    offset += limit;
    loadMorePokemon(offset, limit, selectedType);
});

const modalToggle = () => {
    document.getElementById('modal-overlay').classList.toggle('active');
}


const showDetails = (name) => {
    pokeApi.getPokemonByName(name)
    .then((details) => {
        const modal = document.getElementById('modal');
        
        document.querySelector('#modal img').src = details.photoAnimated;

        modal.removeAttribute('class');
        modal.classList.add(details.type);
        
        
        document.getElementById('modal-overlay').classList.add('active');
        document.querySelector('#modal h2').innerHTML = details.name;
        document.querySelector('#modal #number').innerHTML = `N°${details.number}`;
        
        document.querySelector('#modal .details #abilities').innerHTML = `
        Abilities: ${details.abilities.map((ability) => `${ability}`).join(', ')}
        `;
        
        document.querySelector('#modal .details #species').innerHTML = `Species: ${details.species}`;
        document.querySelector('#modal .details #height').innerHTML = `Height: ${details.height}`;
        document.querySelector('#modal .details #weight').innerHTML = `Weight: ${details.weight}`;

        document.querySelector('#modal .details #type').innerHTML = `Type: ${details.types.map((type) => `${type}`).join(', ')}`;
    });
}

searchField.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      showDetails(searchField.value.trim().toLowerCase()); 
    }
  });

loadMorePokemon(offset, limit)