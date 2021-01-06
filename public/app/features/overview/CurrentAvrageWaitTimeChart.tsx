import * as React from 'react';
// import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { RestService } from './RestService';
import { config } from './config';

export class CurrentAvrageWaitTimeChart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      datasets: [
        {},
        {
          label: 'Line Dataset',
          lineTension: 0.2,
          fill: false,
          borderColor: 'rgba(255,255,255,0.5)',
          data: [],
          borderWidth: 2,
          type: 'line',
        },
      ],
      labels: [],
    };
  }
  componentDidMount() {
    try {
      this.fetchData();
    } catch (err) {
      console.log('Avarage response time data load failed. Error: ', err);
    }
  }
  fetchData = () => {
    RestService.getData(config.GET_AVG_WAIT_TIME_DATA, null, null).then((response: any) => {
      this.setState({
        datasets: [
          {},
          {
            label: 'Line Dataset',
            lineTension: 0.2,
            fill: false,
            borderColor: 'rgba(255,255,255,0.5)',
            data: response.lineDataSetList,
            borderWidth: 2,
            type: 'line',
          },
        ],
        labels: response.daysList,
      });
    });
  };
  render() {
    return (
      <div className="" style={{ width: '100%', height: '100%' }}>
        <Bar
          data={this.state}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    fontColor: 'white',
                    stepSize: 10,
                    beginAtZero: true,
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    fontColor: 'white',
                    stepSize: 10,
                  },
                },
              ],
            },
            legend: {
              display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    );
  }
}
