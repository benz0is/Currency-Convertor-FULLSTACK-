import React, { useEffect, useState, useCallback } from "react";
import DatabaseApi from "./api/DatabaseApi";

const App = () => {
  const [Currency, setCurrency] = useState([]); //fetched currencies array
  const [rate, setRate] = useState([]); // fetched currency rates array
  const [afterPost, setAfterPost] = useState([]); //Notify useEffect that currencies have been posted to DB;
  const [databaseInfo, setDatabaseInfo] = useState([]); //fetched DB info
  const [euro, ToEuro] = useState(); //Current euro textContent
  const [otherCurrency, setOtherCurrency] = useState(); //Selected currency rate
  const [calculation, setCalculation] = useState(); //Calculated amount
  const [history, setHistory] = useState([]); //Fetched DB info about the history

  //fetch data from lb.lt/webservices api and post it to Currency and rate.
  useEffect(() => {
    const CORSURL = "https://cors-anywhere.herokuapp.com/";
    const BASEURL =
      "https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=EU";
    const fecthData = async () => {
      try {
        const response = await fetch(CORSURL + BASEURL, {
          headers: { "Content-Type": "text/xml; charset=utf-8 " },
        })
          .then((res) => res.text())
          .then((data) => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "text/xml");
            console.log(xml.getElementsByTagName("Ccy")[0].textContent);
            console.log(xml.getElementsByTagName("Amt")[0].textContent);
            for (
              let i = 1;
              i < xml.getElementsByTagName("Ccy").length;
              i += 2
            ) {
              setCurrency((Currency) => [
                ...Currency,
                String(xml.getElementsByTagName("Ccy")[i].textContent),
              ]);
            }
            for (
              let i = 1;
              i < xml.getElementsByTagName("Amt").length;
              i += 2
            ) {
              setRate((rate) => [
                ...rate,
                String(xml.getElementsByTagName("Amt")[i].textContent),
              ]);
            }
          });
      } catch (err) {
        console.log(err);
      }
    };
    fecthData();
    //Deletes currencies DB column and history DB column so that it 1.Gets the latest rates and doesnt throw errors for
    //duplicates in the DB 2.Doesnt show previous sessions history.
    DatabaseApi.delete("/DeleteCurrencies");
    DatabaseApi.delete("/DeleteHistory");
  }, []);
  //Posts all currencies to DB
  useEffect(() => {
    if (Currency.length === 87 && rate.length === 87) {
      for (var i = 0; i < Currency.length; i++) {
        DatabaseApi.post("/PostCurrencies", {
          currency: Currency[i],
          rate: rate[i],
        });
      }
      setAfterPost(["it is set"]);
    }
  }, [rate]);
  //Gets all currencies that were posted to DB from DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DatabaseApi.get("/AllCurrencies");
        setDatabaseInfo(response.data.data);
      } catch (err) {}
    };
    fetchData();
  }, [afterPost]);
  //Calculates amount to display properly/Post the history to DB/Retrieves the info from DB
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otherCurrency == undefined) {
      setCalculation(euro);
    } else setCalculation(euro * otherCurrency);
    await DatabaseApi.post("/PostHistory", {
      from_num: euro,
      to_cur: otherCurrency,
    });
    const response = await DatabaseApi.get("/GetHistory");
    setHistory(response.data);
  };

  return (
    <div className="card">
      <div className="display-1 mx-auto">Currency Converter</div>
      <div className="row mx-auto mt-4 mb-4">
        <input
          type="text"
          onChange={(e) => {
            ToEuro(e.target.value);
          }}
        />
        <select>
          <option>EUR</option>
        </select>
        <input
          type="button"
          className="btn btn-primary"
          style={{ width: "100px" }}
          value="="
          onClick={(e) => {
            handleSubmit(e);
          }}
        />
        <input type="text" value={calculation} disabled />
        <select
          onChange={(e) => {
            setOtherCurrency(e.target.value);
          }}
        >
          <option key={0} value={1}>
            EUR
          </option>
          {databaseInfo !== undefined &&
            databaseInfo.map((res) => {
              return (
                <option key={res.id} value={res.rate}>
                  {res.currency}
                </option>
              );
            })}
        </select>
      </div>
      <div className="mx-auto ">
        <div className=" container-fluid">
          <h1 className="card-title">History:</h1>
          <ul>
            {history.data != undefined &&
              history.data.map((res) => {
                return (
                  <li key={res.id}>{`The number ${
                    res.from_num
                  } was converted to ${res.from_num * res.to_cur} `}</li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
