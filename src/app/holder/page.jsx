"use client";
import React, { useState, useEffect } from "react";
import { getIssuedVCs } from "@/lib/api";
import "../globals.css";

const HolderPage = () => {
  const [vcList, setVcList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVCs = async () => {
      try {
        const data = await getIssuedVCs();
        setVcList(data);
      } catch (err) {
        setError("Error fetching VC list");
      }
    };
    fetchVCs();
  }, []);

  return (
    <div>
      <h1>Holder - List of Verifiable Credentials</h1>
      {error && <p>{error}</p>}
      <div className="vc-list">
        {vcList.map((vc) => (
          <div key={vc.id} className="vc-card">
            <h2>{vc.schema}</h2>
            <p><strong>Subject ID:</strong> {vc.subjectId}</p>
            <p><strong>Expires at:</strong> {vc.expires}</p>
            <p><strong>Status:</strong> {vc.status}</p>
            <button onClick={() => alert(`Verifying VC with ID: ${vc.id}`)}>
              Verify VC
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolderPage;

