import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardMedia } from "@mui/material";

export const RickMortyDetailPage: React.FC = () => {
  const { id } = useParams();
  const [character, setCharacter] = React.useState<any>(null);

  React.useEffect(() => {
    if (!id) return;
    fetch(`https://rickandmortyapi.com/api/character/${id}`)
      .then((res) => res.json())
      .then((data) => setCharacter(data))
      .catch(() => setCharacter(null));
  }, [id]);

  if (!character) return <div>Loading...</div>;

  return (
    <div>
      <h2>{character.name}</h2>
      <Card style={{ maxWidth: 400 }}>
        <CardMedia
          component="img"
          image={character.image}
          alt={character.name}
        />
        <CardContent>
          <div>Status: {character.status}</div>
          <div>Species: {character.species}</div>
          <div>Gender: {character.gender}</div>
          <div>Origin: {character.origin?.name}</div>
        </CardContent>
      </Card>
      <div style={{ marginTop: 12 }}>
        <Link to="/rickmorty">Back to list</Link>
      </div>
    </div>
  );
};
