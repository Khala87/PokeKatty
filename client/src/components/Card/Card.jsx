import React from "react";
import { Link } from "react-router-dom";
import "././Card.css";

export default function Card({ name, image, types, id }) {
  return (
    <body class="bodyCard">
      <div>
        <div class="Titulo">{name}</div>
        <div class="Subtitulo">{types?.map((e)=> (
<div>
  <p>{e.name}</p>
</div>
        ))}
        </div>
        <img
          src={image}
          alt="No se encuentra imagen"
          width="150px"
          height="150px"
        />
        <nav>
          <Link to={`pokemons/${id}`}>
            <button class="buttonCard">Detalles</button>
          </Link>
        </nav>
      </div>
    </body>
  );
}
