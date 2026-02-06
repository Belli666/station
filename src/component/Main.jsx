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
    const desc = longDesc.toLowerCase();
    const types = [
      { key: "STATE OF SKY ON THE WHOLE UNCHANGED", short: props.lang?'Өзгөрсүз':'Неизменно' },
      { key: "mist", short:'Туман'},
      { key: "continuous fall of snowflakes", short: props.lang?'Кар жааш':'Снегопад' },
      { key: "fog or ice fog, sky invisible", short: props.lang?'Суук туман':'Холодный туман' },
      { key: "", short: "" },
    ];
    const foundTypes = types.filter(t => desc.includes(t.key)).map(t => t.short);
    const type = foundTypes.length ? foundTypes.join("") : desc;
    return `${type}`;
  }
  //scroll------------------------------------------------------------
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);
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
            </select>{props.lang?',':'за'}
            <Input value={props.date} onChange={(e) => props.dateChange(e.target.value)} type="date"/>{props.lang?'-жылдагы учур аба ырай.':'г.'}
          </b>
          <b>{props.lang?'Кабыл алды:':'Принял(а):'}<Input type='text'/></b>
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
                <th>{props.lang?'Көрүү алыст':'Гориз види'}</th>
                <th>{props.lang?'Учур аба ырай':'Погода в срок'}</th>
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
                        <td>{values['3hour_pressure_change']?Number(Math.round(values['3hour_pressure_change']?.value)):null}</td>
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
                          <td colSpan={13}></td>
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
