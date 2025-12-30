import './App.css';
import Main from './component/Main';
import { useState, useEffect } from 'react';

function App() {
  const [hour, setHour] = useState();
  const [date, setDate] = useState();
  const [stantion, setStantion] = useState([]);//stantion
  useEffect(() => {
    if (!date || !hour) return;
    fetch(`/oapi/collections/urn:wmo:md:kg-kyrgyzhydromet:core.surface-based-observations.synop/items?f=json&lang=en-US&properties=description,name,units,value&skipGeometry=false&offset=0&datetime=${date}T${hour}%3A00%3A00Z&wigos_station_identifier=0-417-0`)
    .then(res => res.json())
      .then(data => {
        const filtStantion = data.features.map(item => ({
          id: item.id,
          name: item.properties.name,
          units: item.properties.units,
          value: item.properties.value,
          description: item.properties.description
        }));

        setStantion(filtStantion);
      })
      .catch(err => console.error(err));
  }, [date, hour]);

  console.log(stantion); 

  //html---------------------------------------------------
  return (
    <div className="App">
      <Main 
        stantion={stantion}
        date={date}
        hour={hour}
        dateChange={setDate}
        hourChange={setHour}
      />
    </div>
  );
}

export default App;
