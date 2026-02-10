import React, {useEffect, useRef } from "react";
import classes from './Main.module.css';
import Input from './UI/Input';
let Main = (props) => {
  //data-----------------------------------------------------------------
  const stationList = props.station || [];
  const STATIONS = props.STATIONS
  const allowedStations = [...STATIONS.keys()];
  const groupedStations = allowedStations.reduce((acc, stationId) => {
    const stationData = stationList.filter(
      row => row.id.split('-')[3] === stationId
    );
    acc[stationId] = {};
    stationData.forEach(row => {
      if (row.name === 'cloud_type') {
        if (!acc[stationId].cloud_type) {
          acc[stationId].cloud_type = [];
        }

        acc[stationId].cloud_type.push({
          id_5: row.id.split('-')[5],
          description: row.description,
        });
      } else {
        acc[stationId][row.name] = {
          value: row.value,
          description: row.description,
          id_5: row.id.split('-')[5],
        };
      }
    });
    return acc;
  }, {});
//cloud-------------------------------------------------------------
  function shortenCloudType(longDesc) {
    if (!longDesc) return '';
    const firstWord = longDesc
      .toLowerCase()
      .split(/\s+/)[0];
    if (firstWord === 'no') return '-';
    const map = {
      cirrus: 'Ci',
      cirrocumulus: 'Cc',
      cirrostratus: 'Cs',
      altocumulus: 'Ac',
      altostratus: 'As',
      nimbostratus: 'Ns',
      stratocumulus: 'Sc',
      stratus: 'St',
      cumulus: 'Cu',
      cumulonimbus: 'Cb',
    };
    return map[firstWord] ?? '';
  }
//weather----------------------------------------------------------
  function shortenWeather(longDesc) {
    if (!longDesc) return;
    const desc = longDesc.trim().toLowerCase();
    const types = [
      { key: "THUNDERSTORM, SLIGHT OR MODERATE, WITHOUT HAIL*, BUT WITH RAIN AND/OR SNOW AT TIME OF OBSERVATION", 
        short: props.lang?'Учурда күн-күрк жаан/кар  - 95':'Гроза сл в срок с дождь/снег - 95' },

      { key: "THUNDERSTORM, BUT NO PRECIPITATION AT THE TIME OF OBSERVATION", 
        short: props.lang?'Учурда күн-күрк жаансыз ':'Гроза в срок без ос' },

      { key: "STATE OF SKY ON THE WHOLE UNCHANGED", 
        short: props.lang?'Асм өзгрсз':'Небо неизм' },

      { key: "SLIGHT OR MODERATE DUSTSTORM OR SANDSTORM", 
        short: props.lang?'Буран кич':'Буря сл' },

      { key: "SHOWER(S) OF RAIN", 
        short: props.lang?'Нөшөр жаан':'Ливень' },

      { key: "RAIN, NOT FREEZING, CONTINUOUS", 
        short: props.lang?'Үзгсз тоңсуз жаан':'Непрер дождь не замер' },

      { key: "RAIN SHOWER(S), SLIGHT", 
        short: props.lang?'Кич нөшөр жаан - 80':'ливень сл - 80' },

      { key: "RAIN (NOT FREEZING)", 
        short: props.lang?'Тоңсуз жаан':'Дождь не замер' },

      { key: "PRECIPITATION WITHIN SIGHT, REACHING THE GROUND OR THE SURFACE OF THE SEA, BUT DISTANT, I.E. ESTIMATED TO BE MORE THAN 5 KM FROM THE STATION", 
        short: props.lang?'Ж-ч алыс':'Ос в/з - 15' },//

      { key: "PRECIPITATION WITHIN SIGHT, NOT REACHING THE GROUND OR THE SURFACE OF THE SEA", 
        short: props.lang?'Ж-ч жерге жетпей - 14':'Ос не дос земли - 14' },

      { key: "NO SIGNIFICANT PHENOMENON TO REPORT, PRESENT AND PAST WEATHER OMITTED", 
        short: props.lang?'Маани көр жок':'Знач явл нет' },

      { key: "NO OBSERVATION, DATA NOT AVAILABLE, PRESENT AND PAST WEATHER OMITTED", 
        short: props.lang?'Байкоо жок':'Нет набл' },

      { key: "CLOUDS GENERALLY DISSOLVING OR BECOMING LESS DEVELOPED", 
        short: props.lang?'Блт тароо - 1':'Обл расс - 1' },

      { key: "CLOUD DEVELOPMENT NOT OBSERVED OR NOT OBSERVABLE", 
        short: props.lang?'Блт өнүгпөс - 1':'Обл не разв - 1' },

      { key: "VISIBILITY REDUCED BY SMOKE E.G. VELDT OR FOREST FIRES INDUSTRIAL SMOKE OR VOLCANIC ASHES", 
        short: 'Туман - 4' },

      { key: "THUNDERSTORM COMBINED WITH DUSTSTORM OR SANDSTORM AT TIME OF OBSERVATION", 
        short: props.lang?'Учурда күн күрк буран - 98':'Гроза в срок с бурей - 98' },

      { key: "THUNDERSTORM (WITH OR WITHOUT PRECIPITATION)", 
        short: props.lang?'Күн күрк':'Гроза' },

      { key: "RAIN SHOWER(S) MODERATE OR HEAVY", 
        short: props.lang?'Нөшөр жаан орт/күч - 81':'Ливн ум/сил - 81' },

      { key: "CLOUDS GENERALLY FORMING OR DEVELOPING", 
        short: props.lang?'Блт өнүгүү - 3':'Обл разв - 3' },

      { key: "ISOLATED STAR-LIKE SNOW CRYSTALS (WITH OR WITHOUT FOG", 
        short: props.lang?'Жылдз кар крист':'Снеж крист как звезд' },
        
      { key: "SLIGHT OR MODERATE DRIFTING SNOW", 
        short: props.lang?'Кар кич/орт':'Снег сл/ум' },

      { key: "FOG OR ICE FOG, SKY INVISIBLE", 
        short: props.lang?'Муз кою тум ':'Хол тум сплш' },

      { key: "FOG, DEPOSITING RIME, SKY INVISIBLE", 
        short: props.lang?'Аяз кою тум':'Измор тум сплш' },

      { key: "MIST", 
        short: props.lang?'Мунарык - 10':'Дымка - 10' },

      { key: "CONTINUOUS FALL OF SNOWFLAKES", 
        short: props.lang?'Токтбз кар':'Снег непрер' },

      { key: "SNOW", short: props.lang?'Кар':'Снег' },

      { key: "SNOW SHOWER(S), SLIGHT", 
        short: props.lang?'Нөшөр кар - 85':'Ливн снег сл - 85' },

      { key: "intermittent fall of snowflakes", 
        short: props.lang?'Маал-маал кар':'Снег с перер' },

      { key: "rain, not freezing, intermittent", 
        short: props.lang?'маал-маал жаан':'Дождь с перер' },

      { key: "drizzle, freezing, slight", 
        short: props.lang?'Тоң кич майда жаан - 56':'Морось сл замер - 56' },

      { key: "snow grains (with or without fog)", 
        short: props.lang?'Майда кар - 77':'Снеж зёрна - 77' },

      { key: "fog or ice fog, sky visible", 
        short: props.lang?'Асм көр туман':'Туман небо вид' },

      { key: "drizzle, not freezing, continuous", 
        short: props.lang?'Майда жаан тотобз':'Морось непрер' },

      { key: "snow shower(s), moderate or heavy", 
        short: props.lang?'Нөшөр кар арт/күч - 86':'Ливн снег ум/сил - 86' },

      { key: "shower(s) of snow, or of rain and snow", 
        short: props.lang?'Нөшөр кар же карсыз':'Ливн снег или без' },

      { key: "isolated star-like snow crystals (with or without fog)", 
        short: props.lang?'Жылдз кар крист':'Снеж крист как звезд' },

      { key: "", 
        short: props.lang?'':'' },

      { key: "", 
        short: props.lang?'':'' },

      { key: "", 
        short: props.lang?'':'' },

      { key: "", 
        short: props.lang?'':'' },

      { key: "", 
        short: props.lang?'':'' },

      { key: "", 
        short: props.lang?'':'' },

      { key: "", 
        short: props.lang?'':'' },

      { key: "", 
        short: props.lang?'':'' },
    ];
    const found = types.find(
      t => t.key.toLowerCase() == desc
    );
    //console.log(types.map(item => item.short));
    return found ? found.short : alert(desc);
  }
  //HTML-----------------------------------------------------------------
  return (
      <div className={classes.main}>
        <header className={classes.header}>
          <b>{props.lang?'Саат':'Фактическая погода за срок'} <select value={props.hour} onChange={e => props.hourChange(e.target.value)}>
              <option value="00">00:00</option>
              <option value="03">03:00</option>
              <option value="06">06:00</option>
              <option value="09">09:00</option>
              <option value="12">12:00</option>
              <option value="15">15:00</option>
              <option value="18">18:00</option>
              <option value="21">21:00</option>
            </select>{props.lang?', ':'от'}
            <Input className={classes.dateInput} value={props.date} onChange={(e) => props.dateChange(e.target.value)} type="date"/>{props.lang?'-жылдагы учур аба ырай.':'г.'}
          </b><b>{props.lang?'Кабыл алды: ':'Принял(а): '}<Input className={classes.textInput} type='text'/></b>
        </header>
        <div className={classes.station}>
          <table >
            <thead>
              <tr>
                <th>Станция</th>
                <th>Темп</th>
                {props.hour==='15'||props.hour==='18'?<th>Макс темп</th>:null}
                {props.hour==='03'||props.hour==='06'?<th>Мин темп</th>:null}
                <th>{props.lang?'Жаан':'Осад'}</th>
                <th>{props.lang?'Басым өзг':'Бар тнд'} </th>
                {props.hour==='03'?<th>{props.lang?'Кар':'Снег'}</th>:null}
                <th>{props.lang?'Шамал':'Ветер'}</th>
                <th>{props.lang?'МКА':'МДВ'}</th>
                <th>{props.lang?'Өтк жн учур аба ырай':'Погода в срок и мжд'}</th>
                <th>{props.lang?'Булут-тулук':'Облачн'}</th>
                <th>{props.lang?'Ылды чеги':'Ниж грц'}</th>
                <th>{props.lang?'Булут түрү':'Вид обл'}</th>
              </tr>
            </thead>
           <tbody>
              {Object.entries(groupedStations).filter(([stationId]) =>
                allowedStations.includes(stationId)).sort(
                  ([a], [b]) => allowedStations.indexOf(a) - allowedStations.indexOf(b)
                ).map(([stationId, values], index, arr) => {
                  const currentGroup = STATIONS.get(stationId)?.group;
                  const nextGroup = arr[index + 1]?STATIONS.get(arr[index + 1][0])?.group:null;
                  return (
                    <>
                      <tr key={stationId}>
                      {/*Станция*/}
                        <td><b>{STATIONS.get(stationId)?.name ?? stationId}</b></td>
                      {/*Темп*/}
                        <td>{values.air_temperature?Number(Math.round(values.air_temperature?.value)):null}</td>
                      {/*Макс темп*/}
                        {props.hour==='15'||props.hour==='18'?
                          <td>{values.maximum_temperature_at_height_and_over_period_specified?Number(Math.round(values.maximum_temperature_at_height_and_over_period_specified?.value)):null}</td>
                        :null}
                      {/*Мин темп*/}
                        {props.hour==='03'||props.hour==='06'?
                          <td>{values.minimum_temperature_at_height_and_over_period_specified?Number(Math.round(values.minimum_temperature_at_height_and_over_period_specified?.value)):null}</td>
                        :null}
                      {/*Жаан*/}
                        <td>{values.total_precipitation_or_total_water_equivalent?Number(Math.round((values.total_precipitation_or_total_water_equivalent?.value).toFixed(1))):null}</td>
                      {/*Басым*/}
                        <td>{values['3hour_pressure_change']?values['3hour_pressure_change']?.value:null}</td>
                      {/*Кар*/}
                        {props.hour==='03'?
                        <td>{values.total_snow_depth?Number(Math.round((values.total_snow_depth?.value)?.toFixed(2))):null}</td>
                        :null}
                      {/*Шамал*/}
                        <td>
                          {values.wind_direction?values.wind_direction?.value+"-":null}
                          {values.wind_speed?Number((values.wind_speed?.value)?.toFixed(1)):null}
                        </td>
                      {/*Көрүү алыст*/}
                        <td>{values.horizontal_visibility?Number(Math.round(values.horizontal_visibility?.value/1000)):null}</td>
                      {/*Учур аба ырайк*/}
                        <td className={classes.weathertd}>{values.present_weather?shortenWeather(values.present_weather?.description):null}</td>
                      {/*Булут-тулук*/}
                        <td>{values.cloud_cover_total?Number(Math.round(values.cloud_cover_total.value/10)):null}</td>
                      {/*Ылды чеги*/}
                        <td>{values.height_of_base_of_cloud?values.height_of_base_of_cloud?.value:null}</td>
                      {/*Булут түрү*/}
                        <td>
                          {values.cloud_amount && values.cloud_amount?.description!=='0'?values.cloud_amount?.description.split(' ')[0]:null} {}
                          {values.cloud_type?values.cloud_type?.slice(0,3).map(c=>shortenCloudType(c.description)).join(' '):null}
                        </td>
                      </tr>
                    {/*разделитель*/}
                      {currentGroup !== nextGroup && (
                        <tr className={classes.boldBorder}>
                          <td colSpan={100}></td>
                        </tr>
                      )}
                    </>
              );})}
            </tbody>
          </table>
        </div>
      </div>
  );
};
export default Main;
