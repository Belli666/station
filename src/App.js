import './App.css';
import Main from './component/Main';
import { useState, useEffect } from 'react';
import Button from './component/UI/Button';

function App() {
  const [hour, setHour] = useState();
  const [date, setDate] = useState();
  const [station, setStation] = useState([]);
  const [empty, setEmpty] = useState();
  const [load, setLoad] = useState(false);
  const [lang, setLang] = useState(true)
//base list station-----------------------------------------
    const STATIONS = new Map([
    ['38353', { name: 'Бишкек', group: 'Чуй' }],
    ['38228', { name: 'Жаңы-жер', group: 'Чуй' }],
    ['38224', { name: 'Кара-Балта', group: 'Чуй' }],
    ['36911', { name: 'Токмок', group: 'Чуй' }],
    ['36914', { name: 'Ыссык-Ата', group: 'Чуй' }],
    ['38102', { name: 'Жээк AWS', group: 'Чуй' }],
    ['36921', { name: 'Шабдан AWS', group: 'Чуй' }],
    ['38355', { name: 'Байтик', group: 'Чуй' }],
    ['38486', { name: 'Ала-Арча', group: 'Чуй' }],
    ['38358', { name: 'Суусамыр', group: 'Чуй' }],
    ['38359', { name: 'Төө-Ашуу', group: 'Чуй' }],

    ['38342', { name: 'Кызыл-Адыр', group: 'Талас' }],
    ['38345', { name: 'Талас', group: 'Талас' }],
    ['38095', { name: 'Бакай-Ата AWS', group: 'Талас' }],

    ['38608', { name: 'Баткен', group: 'Баткен' }],
    ['38722', { name: 'Исфана', group: 'Баткен' }],
    ['38720', { name: 'Кулунду AWS', group: 'Баткен' }],
    ['38619', { name: 'Марказ AWS', group: 'Баткен' }],
    ['38870', { name: 'Исфайрам AWS', group: 'Баткен' }],
    ['38739', { name: 'Чек AWS', group: 'Баткен' }],
    ['38863', { name: 'Ак-Турпак AWS', group: 'Баткен' }],

    ['38615', { name: 'Ош', group: 'Ош' }],
    ['38866', { name: 'Ош Жетиген', group: 'Ош' }],
    ['38616', { name: 'Кара-Суу', group: 'Ош' }],
    ['38610', { name: 'Ноокат', group: 'Ош' }],
    ['38874', { name: 'Тоо-Моюн', group: 'Ош' }],
    ['38621', { name: 'Узген', group: 'Ош' }],
    ['38627', { name: 'Гульча', group: 'Ош' }],
    ['38628', { name: 'Кызыл-жар', group: 'Ош' }],
    ['38871', { name: 'Сары-Таш', group: 'Ош' }],

    ['38613', { name: 'Жалал-Абад', group: 'Жалал-Абад' }],
    ['38211', { name: 'Ала-Бука AWS', group: 'Жалал-Абад' }],
    ['38470', { name: 'Сары-Челек', group: 'Жалал-Абад' }],
    ['38476', { name: 'Ак-Терек', group: 'Жалал-Абад' }],
    ['38472', { name: 'Пача-Ата', group: 'Жалал-Абад' }],
    ['38473', { name: 'Токтогул', group: 'Жалал-Абад' }],
    ['38349', { name: 'Ит-Агар', group: 'Жалал-Абад' }],
    ['38471', { name: 'Чаткал', group: 'Жалал-Абад' }],
    ['38466', { name: 'Чапчыма', group: 'Жалал-Абад' }],

    ['36927', { name: 'Балыкчы', group: 'Ыссык-Көл' }],
    ['36941', { name: 'Балбай AWS', group: 'Ыссык-Көл' }],
    ['36948', { name: 'Каракол', group: 'Ыссык-Көл' }],
    ['36944', { name: 'Кызыл-Суу', group: 'Ыссык-Көл' }],
    ['36934', { name: 'Чолпон-Ата', group: 'Ыссык-Көл' }],
    ['36954', { name: 'Чоң-Ашуу', group: 'Ыссык-Көл' }],
    ['36982', { name: 'Тянь-Шань', group: 'Ыссык-Көл' }],

    ['38963', { name: 'Ат-Башы AWS', group: 'Нарын' }],
    ['36974', { name: 'Нарын', group: 'Нарын' }],
    ['38482', { name: 'Чаек', group: 'Нарын' }],
    ['38489', { name: 'Баетово AWS', group: 'Нарын' }],
    ['36918', { name: 'Кочкор', group: 'Нарын' }],
    ['36963', { name: 'Долон', group: 'Нарын' }], 
    ['36971', { name: 'Кара-Кужур', group: 'Нарын' }],
  ]);
//api------------------------------------------------------------------
  useEffect(() => {
    if (!date || !hour) return;
    setEmpty();
    setLoad(true);

    const baseUrl = '/oapi/collections/urn:wmo:md:kg-kyrgyzhydromet:core.surface-based-observations.synop/items';

    const requests = [...STATIONS.keys()].map(stationId => {
      const url =
        `${baseUrl}?f=json` +
        `&lang=en-US` +
        `&properties=description,name,units,value` +
        `&skipGeometry=false` +
        `&offset=0` +
        `&datetime=${date}T${hour}:00:00Z` +
        `&wigos_station_identifier=${stationId}`;

      return fetch(url)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null);
    });
    Promise.all(requests)
      .then(responses => {
        const merged = responses
          .filter(Boolean)
          .flatMap(data =>
            data.features.map(item => ({
              id: item.id,
              name: item.properties.name,
              units: item.properties.units,
              value: item.properties.value,
              description: item.properties.description
            }))
          );
        setStation(merged);
        if (!merged.length) {
          setEmpty("Нет данных!")
        }
        console.log(merged);
        setLoad(false)
      })
      .catch(err => console.error(err));
  }, [date, hour]);
  
//html-----------------------------------------------------
  return (
    <div className="App">
      <img className="logo-meteo" src='https://www.meteo.kg/logo-public.png'></img>
      <div className="controller">
        <Button id='print' class="btn btn-success" onClick={()=> window.print()} text='Печать'/>
        <h4 className="empty">{empty}</h4>
        {load?
          <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" class="pencil">
            <defs>
              <clipPath id="pencil-eraser">
                <rect height="30" width="30" ry="5" rx="5"></rect>
              </clipPath>
            </defs>
            <circle transform="rotate(-113,100,100)" stroke-linecap="round" stroke-dashoffset="439.82" stroke-dasharray="439.82 439.82" stroke-width="2" stroke="currentColor" fill="none" r="70" class="pencil__stroke"></circle>
            <g transform="translate(100,100)" class="pencil__rotate">
              <g fill="none">
                <circle transform="rotate(-90)" stroke-dashoffset="402" stroke-dasharray="402.12 402.12" stroke-width="30" stroke="hsl(223,90%,50%)" r="64" class="pencil__body1"></circle>
                <circle transform="rotate(-90)" stroke-dashoffset="465" stroke-dasharray="464.96 464.96" stroke-width="10" stroke="hsl(223,90%,60%)" r="74" class="pencil__body2"></circle>
                <circle transform="rotate(-90)" stroke-dashoffset="339" stroke-dasharray="339.29 339.29" stroke-width="10" stroke="hsl(223,90%,40%)" r="54" class="pencil__body3"></circle>
              </g>
              <g transform="rotate(-90) translate(49,0)" class="pencil__eraser">
                <g class="pencil__eraser-skew">
                  <rect height="30" width="30" ry="5" rx="5" fill="hsl(223,90%,70%)"></rect>
                  <rect clip-path="url(#pencil-eraser)" height="30" width="5" fill="hsl(223,90%,60%)"></rect>
                  <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
                  <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
                  <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
                  <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)"></rect>
                  <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)"></rect>
                </g>
              </g>
              <g transform="rotate(-90) translate(49,-30)" class="pencil__point">
                <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
                <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
                <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)"></polygon>
              </g>
            </g>
          </svg>
        :null}
        <Button id='lang' class="btn btn-outline-light" onClick={()=>setLang(!lang)} text={lang?'Рус':'Кыр'}/>
      </div>
      <Main
        lang={lang}
        station={station}
        date={date}
        hour={hour}
        dateChange={setDate}
        hourChange={setHour}
        STATIONS={STATIONS}
      />
    </div>
  );
}

export default App;
