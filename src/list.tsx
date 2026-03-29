import React from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Pagination } from "@mui/material";

interface MemberEntity {
  id: string;
  login: string;
  avatar_url: string;
}

export const ListPage: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);
  const [org, setOrg] = React.useState(
    () => localStorage.getItem("org") || "lemoncode"
  );
  const [page, setPage] = React.useState(1);

  const fetchMembers = (organization: string) => {
    fetch(
      `https://api.github.com/orgs/${organization}/members?page=${page}&per_page=10`
    )
      .then((response) => response.json())
      .then((json) => (Array.isArray(json) ? setMembers(json) : setMembers([])))
      .catch(() => setMembers([]));
  };

  React.useEffect(() => {
    fetchMembers(org);
  }, [org, page]);

  const handleSearch = () => {
    localStorage.setItem("org", org);
    fetchMembers(org);
  };

  return (
    <>
      <h2>Hello from List page</h2>
      <div>
        <TextField
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          label="Organización"
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>
      <div className="list-user-list-container">
        <span className="list-header">Avatar</span>
        <span className="list-header">Id</span>
        <span className="list-header">Name</span>
        {members.map((member) => (
          <React.Fragment key={member.id}>
            <img src={member.avatar_url} />
            <span>{member.id}</span>
            <Link to={`/detail/${member.login}`}>{member.login}</Link>
          </React.Fragment>
        ))}
      </div>
      <div>
        <Pagination
          count={3}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Anterior
        </button>
        <button onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
      <Link to="/detail">Navigate to detail page</Link>
    </>
  );
};
