import React, { useState, useEffect } from "react";
import "./App.css";

const system_owner = (data, id) => {
  let owner = data.relationships.find(
    relations => relations.type === "owns" && relations.end === id
  );

  return data.entities.find(entities => entities.id === owner.start);
};

const system_department = (data, id) => {
  let department = data.relationships.find(
    relations => relations.type === "belongs_to" && relations.start === id
  );

  return data.entities.find(entities => entities.id === department.end);
};

const system_developer = (data, id) => {
  let developers = data.relationships.filter(
    relations => relations.type === "develops" && relations.end === id
  );

  return developers.flatMap(developer =>
    data.entities.filter(entities => entities.id === developer.start)
  );
};

const systemList = data => {
  const systems = data.entities.filter(entities => entities.type === "System");
  const index = {};

  systems.forEach(system => {
    console.log(index);
    if (!(system.id in index)) {
      index[system.id] = {};
    }
    console.log("indeeex", index);
    index[system.id].system = system;
    index[system.id].owner = system_owner(data, system.id);
    index[system.id].department = system_department(data, system.id);
    index[system.id].developers = system_developer(data, system.id);
    console.log("indeeex2", index);
  });

  return index;
};

function Details({ data }) {
  const index = systemList(data);

  return (
    <table className="table">
      <thead>
        <tr>
          <td>System Name</td>
          <td>System Owner</td>
          <td>Owner Contact Info</td>
          <td>System Department</td>
          <td>Department Contact Info</td>
          <td>Developers</td>
        </tr>
      </thead>
      <tbody>
        {Object.entries(index).map(
          ([systemId, { system, owner, department, developers }]) => (
            <tr key={systemId}>
              <td>{system.name}</td>
              <td>{owner.name}</td>
              <td>{owner.email}</td>
              <td>{department.name}</td>
              <td>{department.email}</td>
              <td>{developers.map(x => x.name).join(", ")}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

const fetchData = async setData => {
  try {
    const result = await fetch("/data.json");
    setData(await result.json());
  } catch (err) {
    console.error(err.message);
  }
};

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(setData);
  }, []);

  if (data === null) {
    return "Fetching data...";
  }

  return <Details data={data} />;
}

export default App;
