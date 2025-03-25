import React, { useEffect, useState } from "react";
import "./styles.css";
import { tenureData } from "./utils/constants";

const App = () => {
  const [cost, setCost] = useState(0);
  const [interest, setInterest] = useState(10);
  const [fee, setFee] = useState(1);
  const [downPayment, setDownPayement] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);

  const calculateEMI = (downPayment) => {
    if (!cost) return;
    const loanAmount = cost - downPayment; // p
    const rateOfInterest = interest / 100; // r
    const numberOfYears = tenure / 12;

    const emi =
      (loanAmount * rateOfInterest * (1 + rateOfInterest) ** numberOfYears) /
      ((1 + rateOfInterest) ** numberOfYears - 1);
    return Number(emi / 12).toFixed(0); // yearly emi to monthly emi
  };

  const calculateDP = (emi) => {
    if (!cost) return;
    const downPaymentPercent = 100 - (emi / calculateEMI(0)) * 100;

    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  };

  useEffect(() => {
    if (!(cost > 0)) {
      setDownPayement(0);
      setEmi(0);
    }
    const emi = calculateEMI(downPayment);
    setEmi(emi);
  }, [tenure]);

  const updateEMI = (e) => {
    if (!cost) return;
    const dp = Number(e.target.value);
    setDownPayement(dp.toFixed(0));

    const emi = calculateEMI(dp);
    setEmi(emi);
  };
  const updateDownPayment = (e) => {
    if (!cost) return;
    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));

    const dp = calculateDP(emi);
    setDownPayement(dp);
  };

  return (
    <div className="App">
      <div className="header">
        <span className="title" style={{ fontSize: 30, marginTop: 10 }}>
          EMI Calculator
        </span>
      </div>

      <span className="title">Total Cost of assets</span>
      <input
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        placeholder="Total Cost of Assets"
      />
      <span className="title">Interest Rate in %</span>
      <input
        type="number"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        placeholder="Interest Rate in %"
      />
      <span className="title">Processing Fee in %</span>
      <input
        type="number"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
        placeholder="Processing Fee in %"
      />

      <span className="title flexer">
        <span>Down Payment :</span>
        <span className="title" style={{ textDecoration: "underline" }}>
          Total Down Payment -
          {(Number(downPayment) + (cost - downPayment) * (fee / 100)).toFixed(
            0
          )}
        </span>
      </span>
      <div>
        <input
          type="range"
          min={0}
          max={cost}
          className="slider"
          value={downPayment}
          onChange={updateEMI}
        />
        <div className="labels">
          <label>0%</label>
          <b>{downPayment}</b>
          <label>100%</label>
        </div>
      </div>

      <span className="title flexer">
        <span>Loan per Month :</span>
        <span className="title" style={{ textDecoration: "underline" }}>
          Total Loan Amount - {(emi * tenure).toFixed(0)}
        </span>
      </span>

      <div>
        <input
          type="range"
          min={calculateEMI(cost)}
          max={calculateEMI(0)}
          className="slider"
          value={emi}
          onChange={updateDownPayment}
        />
        <div className="labels">
          <label>{calculateEMI(cost)}</label>
          <b>{emi}</b>
          <label>{calculateEMI(0)}</label>
        </div>
      </div>

      <span className="title">Tenure</span>
      <div className="tenureContainer">
        {tenureData.map((t) => {
          return (
            <button
              className={`tenure ${t === tenure ? "selected" : ""}`}
              onClick={() => setTenure(t)}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default App;
