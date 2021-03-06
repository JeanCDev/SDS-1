import React, {useState, useEffect} from 'react';
import Filters from '../../Components/Filters';
import './styles.css';
import Chart from 'react-apexcharts';
import { barOptions, pieOptions } from './chart-options';
import axios from 'axios';
import { buildBarSeries, getGenderChartData, getPlatformChartData } from './helpers'

type PieChartData = {
    labels: string[];
    series: number[];
}

type BarChartData ={
    x: string;
    y: number;
}

const initialPieData ={
    labels: [], 
    series: []
}

const BASE_URL = 'https://sds1-jean.herokuapp.com';

const Charts = () =>{

    const [ barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [ barPlatformChartData, setBarPlatformChartData] = useState<PieChartData>(initialPieData);
    const [ barGenderChartData, setBarGenderChartData] = useState<PieChartData>(initialPieData);

    useEffect(() =>{

        async function getData(){

            const recordsResponse = await axios.get(`${BASE_URL}/records`);
            const gamesResponse = await axios.get(`${BASE_URL}/games`);

            const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content);
            setBarChartData(barData);

            const platformChartData = getPlatformChartData(recordsResponse.data.content);
            setBarPlatformChartData(platformChartData);

            const genderChartData = getGenderChartData(recordsResponse.data.content);
            setBarGenderChartData(genderChartData);

        }

        getData();

    }, []);

    return (
        <div className="page-container">
            <Filters  
                link="records"
                linkText="VER TABELA"/>

            <div className="chart-container">
                <div className="top-related">
                    <h1 className="top-related-title">Jogos Mais Votados</h1>

                    <div className="games-container">
                        <Chart 
                            options={barOptions}
                            type="bar"
                            width='350'
                            height='250'
                            series={[{data: barChartData}]}
                            />
                    </div>
                </div>

                <div className="charts">
                    <div className="platform-chart">
                        <h2 className="chart-title">Plataformas</h2>

                        <Chart 
                            options={{...pieOptions, labels: barPlatformChartData?.labels}}
                            type="donut"
                            series={barPlatformChartData?.series}
                            width="350"
                            />
                    </div>

                    <div className="gender-chart">
                        <h2 className="chart-title">Gêneros</h2>

                        <Chart 
                            options={{...pieOptions, labels: barGenderChartData?.labels}}
                            type="donut"
                            series={barGenderChartData?.series}
                            width="350"
                            />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Charts;