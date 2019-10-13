import React, { useState, useEffect } from "react";
import "./App.css";

const systemList = data => {
  let systems = data.entities.filter(entities => entities.type === "System");

  return systems;
};

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

function Details({ data }) {
  let systems = systemList(data);

  const renderedSystem = systems.map(system => {
    let systemOwner = system_owner(data, system.id);
    let systemsDepartment = system_department(data, system.id);
    let systemDevelopers = system_developer(data, system.id);

    return (
      <tr key={system.id}>
        <td>{system.name}</td>
        <td>{systemOwner.name}</td>
        <td>{systemOwner.email}</td>
        <td>{systemsDepartment.name}</td>
        <td>{systemsDepartment.email}</td>
        <td>{systemDevelopers.map(x => x.name).join(", ")}</td>
      </tr>
    );
  });

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
      <tbody>{renderedSystem}</tbody>
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
