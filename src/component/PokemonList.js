import React, { useState, useEffect } from "react";
import "./PokemonList.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PokemonList() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=104");
    const pokemonData = await res.json();

    const pokemonWithImages = await Promise.all(
      pokemonData.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const pokemonInfo = await res.json();
        return {
          name: pokemon.name,
          image: pokemonInfo.sprites.front_default,
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
    <div className="pokemon">
      {isLoading
        ? Array.from({ length: 104 }, (_, index) => (
            <div key={index}>
              <h3>
                <Skeleton />
              </h3>
              <Skeleton count={3} />
              <img src={<Skeleton />} alt="" />
            </div>
          ))
        : data &&
          data.map((pokemon, index) => (
            <div key={index}>
              <h3>{pokemon.name || <Skeleton />}</h3>
              <img src={pokemon.image || <Skeleton />} alt={pokemon.name} />
            </div>
          ))}
    </div>
  );
}

export default PokemonList;
