import React, { useState, useEffect, useRef } from "react";
import classes from './Main.module.css';
import Button from './UI/Button';
import Input from './UI/Input';

let Main = (props) => {

  const stantionList = props.stantion || [];
  const allowedStations = [
    '38353','38228','38224','36911','36914','38102','36921','38355','38486','38358','38359',
    '38342','38345','38095',
    '38608','38722','38720','38619','38870','38739','38863',
    '38615','38866','38616','38610','38874','38621','38627','38628','38871',
    '38613','38211','38470','38476','38472','38473','38349','38471','38466',
    '36927','36941','36948','36944','36934','36954','36982',
    '38963','36974','38482','38489','36918','36963','36971'
  ];
  const getGroup = (stationId) => {
    if(['38353','38228','38224','36911','36914','38102','36921','38355','38486','38358','38359'].includes(stationId)) return 'Чуй';
    if(['38342','38345','38095'].includes(stationId)) return 'Талас';
    if(['38608','38722','38720','38619','38870','38739','38863'].includes(stationId)) return 'Баткен';
    if(['38615','38866','38616','38610','38874','38621','38627','38628','38871'].includes(stationId)) return 'Ош';
    if(['38613','38211','38470','38476','38472','38473','38349','38471','38466'].includes(stationId)) return 'Жалал-Абад';
    if(['36927','36941','36948','36944','36934','36954','36982'].includes(stationId)) return 'Ыссык-Көл';
    if(['38963','36974','38482','38489','36918','36963','36971'].includes(stationId)) return 'Нарын';
    return 'Другое';
  };
  const groupedStations = allowedStations.reduce((acc, stationId) => {
    const stationData = stantionList.filter(row => row.id.split('-')[3] === stationId);
    acc[stationId] = {};

    stationData.forEach(row => {
      acc[stationId][row.name] = {
        value: row.value,
        description: row.description
      };
    });

    return acc;
  }, {});

function shortenCloudType(longDesc) {
  if (!longDesc) return '';
  const desc = longDesc.toLowerCase().split(';')[0];
  const types = [
    { key: /no.*clouds?/, short: "-" },
    { key: /\bcirrus\b/, short: "Ci" },
    { key: /\bcirrocumulus\b/, short: "Cc" },
    { key: /\bcirrostratus\b/, short: "Cs" },
    { key: /\baltocumulus\b/, short: "Ac" },
    { key: /\baltostratus\b/, short: "As" },
    { key: /\bnimbostratus\b/, short: "Ns" },
    { key: /\bstratocumulus\b/, short: "Sc" },
    { key: /\bstratus\b/, short: "St" },
    { key: /\bcumulus\b/, short: "Cu" },
    { key: /\bcumulonimbus\b/, short: "Cb" },
    { key: /,/, short: ", " },
    { key: /or/, short: "же " },
    { key: /and/, short: "жана " },
  ];

  const matches = [];

  types.forEach(t => {
    let match;
    if (t.key instanceof RegExp) {
      match = t.key.exec(desc);
      if (match) matches.push({ pos: match.index, short: t.short });
    } else {
      const index = desc.indexOf(t.key);
      if (index !== -1) matches.push({ pos: index, short: t.short });
    }
  });

  matches.sort((a, b) => a.pos - b.pos);

  return matches.map(m => m.short).join('');
}

    function shortenWeather(longDesc) {
      if (!longDesc) return;
      const desc = longDesc.toLowerCase();
      const types = [
        { key: "STATE OF SKY ON THE WHOLE UNCHANGED", short: "Өзгөрсүз" },
        { key: "mist", short: "Туман" },
        { key: "continuous fall of snowflakes", short: "Кар жааш" },
        { key: "fog or ice fog, sky invisible", short: "Суук туман" },
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
        <Button onClick={()=> window.print()} text='Печать'/>
        <header className={classes.header}>
          <b>Саат <select value={props.hour} onChange={e => props.hourChange(e.target.value)}>
              <option value="00">00:00</option>
              <option value="03">03:00</option>
              <option value="06">06:00</option>
              <option value="09">09:00</option>
              <option value="12">12:00</option>
              <option value="15">15:00</option>
              <option value="18">18:00</option>
              <option value="21">21:00</option>
            </select> 
            <Input className={classes.date} value={props.date} onChange={(e) => props.dateChange(e.target.value)} type="date"/>-жылдагы фактикалык аба ырай.
          </b>
          <b>Кабыл алды:<Input type='text'/></b>
        </header>
        <div className={classes.stantion}>
          <table >
            <thead>
              <tr>
                <th>Станция</th>
                <th>Темп</th>
                <th>Макс темп</th>
                <th>Басым </th>
                <th>Салышт ным</th>
                <th>Шамал багыт</th>
                <th>Шамал ылдам </th>
                <th>Жаан</th>
                <th>Көрүү алыст</th>
                <th>Учур аба ырай</th>
                <th>Балл</th>
                <th>Ылды чеги</th>
                <th>Булут түрү</th>
              </tr>
            </thead>
           <tbody>
              {Object.entries(groupedStations).filter(([stationId]) =>
                  allowedStations.includes(stationId)).sort(
                    ([a], [b]) => allowedStations.indexOf(a) - allowedStations.indexOf(b)
                  ).map(([stationId, values], index, arr) => {
                    const currentGroup = getGroup(stationId);
                    const nextGroup = arr[index + 1] ? getGroup(arr[index + 1][0]) : null;

                    return (
                      <>
                        <tr key={stationId}>
                          <td>
                            <b>{//chui
                                stationId === '38353'?'Бишкек':
                                stationId === '38228'?'Жаңы-жер':
                                stationId === '38224'?'Кара-Балта':
                                stationId === '36911'?'Токмок':
                                stationId === '36914'?'Ыссык-Ата':
                                stationId === '38102'?'Жээк AWS':
                                stationId === '36921'?'Шабдан AWS':
                                stationId === '38355'?'Байтик':
                                stationId === '38486'?'Ала-Арча':
                                stationId === '38358'?'Суусамыр':
                                stationId === '38359'?'Төө-Ашуу':
                                //talas
                                stationId === '38342'?'Кызыл-Адыр':
                                stationId === '38345'?'Талас':
                                stationId === '38095'?'Бакай-Ата AWS':
                                //batken
                                stationId === '38608'?'Баткен':
                                stationId === '38722'?'Исфана':
                                stationId === '38720'?'Кулунду AWS':
                                stationId === '38619'?'Марказ AWS':
                                stationId === '38870'?'Исфайрам AWS':
                                stationId === '38739'?'Чек AWS':
                                stationId === '38863'?'Ак-Турпак AWS':
                                //osh
                                stationId === '38615'?'Ош':
                                stationId === '38866'?'Ош Жетиген':
                                stationId === '38616'?'Кара-Суу':
                                stationId === '38610'?'Ноокат':
                                stationId === '38874'?'Тоо-Моюн':
                                stationId === '38621'?'Узген':
                                stationId === '38627'?'Гульча':
                                stationId === '38628'?'Кызыл-жар':
                                stationId === '38871'?'Сары-Таш':
                                //jalal abad
                                stationId === '38613'?'Жалал-Абад':
                                stationId === '38211'?'Ала-Бука AWS':
                                stationId === '38470'?'Сары-Челек':
                                stationId === '38476'?'Ак-Терек':
                                stationId === '38472'?'Пача-Ата':
                                stationId === '38473'?'Токтогул':
                                stationId === '38349'?'Ит-Агар':
                                stationId === '38471'?'Чаткал':
                                stationId === '38466'?'Чапчыма':
                                //yssyk kul
                                stationId === '36927'?'Балыкчы':
                                stationId === '36941'?'Балбай AWS':
                                stationId === '36948'?'Каракол':
                                stationId === '36944'?'Кызыл-Суу':
                                stationId === '36934'?'Чолпон-Ата':
                                stationId === '36954'?'Чоң-Ашуу':
                                stationId === '36982'?'Тянь-Шань':
                                //naryn
                                stationId === '38963'?'Ат-Башы AWS':
                                stationId === '36974'?'Нарын':
                                stationId === '38482'?'Чаек':
                                stationId === '38489'?'Баетово AWS':
                                stationId === '36918'?'Кочкор':
                                stationId === '36963'?'Долон':
                                stationId === '36971'?'Кара-Кужур':
                                null
                              }
                            </b>
                          </td>
                          <td>{values.air_temperature?values.air_temperature?.value+'°C':null}</td>
                          <td>{values.maximum_temperature_at_height_and_over_period_specified?values.maximum_temperature_at_height_and_over_period_specified?.value+'°C':null}</td>
                          <td>{values.non_coordinate_pressure?values.non_coordinate_pressure?.value+' hPa':null}</td>
                          <td>{values.relative_humidity?values.relative_humidity?.value+'%':null}</td>
                          <td>{values.wind_direction?values.wind_direction?.value+'°':null}</td>
                          <td>{values.wind_speed?Number((values.wind_speed?.value)?.toFixed(1))+' м/с':null}</td>
                          <td>{values.total_precipitation_or_total_water_equivalent?Number((values.total_precipitation_or_total_water_equivalent?.value).toFixed(1))+' мм':null}</td>
                          <td>{values.horizontal_visibility?values.horizontal_visibility?.value/1000+' км':null}</td>
                          <td>{shortenWeather(values.present_weather?.description)}</td>
                          <td>{values.cloud_amount?.description.split('OKTA')[0]}</td>
                          <td>{values.height_of_base_of_cloud?values.height_of_base_of_cloud?.value+' м':null}</td>
                          <td>{(values.cloud_type?.description)}</td>
                        </tr>

                        {currentGroup !== nextGroup && (
                          <tr className={classes.boldBorder}>
                            <td colSpan={13}></td>
                          </tr>
                        )}
                      </>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default Main;
