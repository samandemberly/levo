import { useState, useEffect } from 'react'
import axios from 'axios'
import { TextField, Autocomplete, Button } from '@mui/material';
import './App.css'

interface Country {
  name: string;
  region?: string | null;
  population?: number | null;
  area?: number | null;
  density?: number | null;
  languages?: string[] | null;
}

interface CountrySummaryData {
  name: string;
  region?: string | null;
  population?: number | null;
}

function App() {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState()
  const [selectedCountryData, setSelectedCountryData] = useState<Country>()
  const [allCountryData, setAllCountryData] = useState<CountrySummaryData[]>()

  const getCountryNames = async () => {
    const countryNamesResponse = await fetch('http://localhost:3000/countryNames')
    const data = await countryNamesResponse.json()
    setCountries(data)
  }

  const getCountryDetails = async () => {
    setAllCountryData(undefined)
    const countryResponse = await fetch(`http://localhost:3000/summary/${selectedCountry}`)
    const data = await countryResponse.json()
    setSelectedCountryData(data)
  }

  const getAllCountries = async () => {
    setSelectedCountry(undefined)
    setSelectedCountryData(undefined)
    const countriesResponse = await fetch(`http://localhost:3000/summary`)
    const data = await countriesResponse.json()
    setAllCountryData(data)
  }

  useEffect(() => {
    getCountryNames()
  }, []);

  useEffect(() => {
    if(selectedCountry){
      getCountryDetails()
    }
  }, [selectedCountry]);

  return (
    <div>
      <h1>Countries</h1>
      <div className="search">
      <Autocomplete
        value={selectedCountry}
        onChange={(event, newValue) => {
          if(newValue){
            setSelectedCountry(newValue);
          }
        }}
        options={countries}
        renderInput={(params) => (
          <TextField {...params} label="Search Countries" variant="outlined" />
        )}
      />
      <Button
      onClick={getAllCountries}
      >
      Get All Countries
      </Button>
      </div>
      <div>
      {selectedCountryData ? (
        <div>
          <h3>{selectedCountryData.name}</h3>
          <p>Population: {selectedCountryData.population}</p>
          <p>Region: {selectedCountryData.region}</p>
          <p>Languages: {selectedCountryData.languages}</p>
          <p>Area: {selectedCountryData.area}</p>
          <p>Density: {selectedCountryData.density}</p>
        </div>
      ) : null}
      </div>
      <div>
      {allCountryData ? (
        <ul>
          {allCountryData.map((cntry)=>(
            <li>Name: {cntry.name} Region: {cntry.region} Population: {cntry.population}</li>
          ))}
        </ul>
      ) : null}
      </div>
    </div>
  )
}

export default App
