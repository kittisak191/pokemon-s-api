import React, { useState, useEffect } from "react";
import "./PokemonList.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PokemonList() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredType, setFilteredType] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilteredType(e.target.value);
  };

  const fetchData = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=180");
    const pokemonData = await res.json();

    const pokemonWithImages = await Promise.all(
      pokemonData.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const pokemonInfo = await res.json();
        return {
          name: pokemon.name,
          image: pokemonInfo.sprites.front_default,
          type: pokemonInfo.types.map((type) => type.type.name),
        };
      })
    );

    setData(pokemonWithImages);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {" "}
      <div className="filters">
        <input
          type="text"
          placeholder="Search Pokemon"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={filteredType} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="normal">Normal</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="electric">Electric</option>
          <option value="grass">Grass</option>
          <option value="ice">Ice</option>
          <option value="fighting">Fighting</option>
          <option value="poison">Poison</option>
          <option value="ground">Ground</option>
          <option value="flying">Flying</option>
          <option value="psychic">Psychic</option>
          <option value="bug">Bug</option>
          <option value="rock">Rock</option>
          <option value="ghost">Ghost</option>
          <option value="dragon">Dragon</option>
          <option value="dark">Dark</option>
          <option value="steel">Steel</option>
          <option value="fairy">Fairy</option>
        </select>
      </div>
      <div className="pokemon">
        {isLoading
          ? Array.from({ length: 180 }, (_, index) => (
              <div key={index}>
                <h3>
                  <Skeleton />
                </h3>
                <Skeleton count={3} />
                <img src={<Skeleton />} alt="" />
              </div>
            ))
          : data &&
            data
              .filter((pokemon) => {
                if (filteredType === "") {
                  return true;
                }
                return pokemon.type.includes(filteredType);
              })
              .filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((pokemon, index) => (
                <div key={index}>
                  <h3>{pokemon.name}</h3>
                  <img src={pokemon.image} alt={pokemon.name} />
                </div>
              ))}
      </div>
    </div>
  );
}

export default PokemonList;
