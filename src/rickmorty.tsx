import React from "react";
import { Link } from "react-router-dom";
import { TextField, CircularProgress, Pagination } from "@mui/material";
import { useDebounce } from "./hooks/useDebounce";

interface Character {
  id: number;
  name: string;
  image: string;
  status: string;
  species: string;
}

export const RickMortyPage: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [characters, setCharacters] = React.useState<Character[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchChars = (name: string, pageNum = 1) => {
    setLoading(true);
    const url = new URL("https://rickandmortyapi.com/api/character");
    if (name) url.searchParams.set("name", name);
    url.searchParams.set("page", String(pageNum));

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.results || []);
        setTotalPages(data.info?.pages || 1);
      })
      .catch(() => {
        setCharacters([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    setPage(1);
    fetchChars(debouncedQuery, 1);
  }, [debouncedQuery]);

  React.useEffect(() => {
    fetchChars(debouncedQuery, page);
  }, [page]);

  return (
    <div>
      <h2>Rick & Morty Characters</h2>
      <div style={{ marginBottom: 12 }}>
        <TextField
          label="Buscar personaje"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: 8,
            }}
          >
            {characters.map((c) => (
              <React.Fragment key={c.id}>
                <img src={c.image} alt={c.name} width={100} />
                <div>
                  <Link to={`/rickmorty/${c.id}`}>{c.name}</Link>
                  <div>
                    {c.species} - {c.status}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
            />
          </div>
        </>
      )}
    </div>
  );
};
