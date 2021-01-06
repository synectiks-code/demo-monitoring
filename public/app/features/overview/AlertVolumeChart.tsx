import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { RestService } from './RestService';
import { config } from './config';

export class AlertVolumeChart extends React.Component<any, any> {
  chart: any;
  constructor(props: any) {
    super(props);
    this.state = {
      datasets: [
        {
          label: 'New',
          lineTension: 0.1,
          fill: false,
          borderColor: 'rgba(252, 203, 80, 1)',
          data: [],
        },
        {
          label: 'Resolved 75',
          lineTension: 0.1,
          fill: false,
          borderColor: 'rgba(73, 183, 234, 1)',
          data: [],
        },
      ],
      labels: ['', '', '', '', '', ''],
      legends: [],
    };
    this.chart = null;
  }

  componentDidMount() {
    if (this.chart) {
      this.setState({
        legends: this.chart.chartInstance.legend.legendItems,
      });
    }
    try {
      this.fetchData();
    } catch (err) {
      console.log('Alert Volume data load failed. Error: ', err);
    }
  }
  fetchData = () => {
    RestService.getData(config.GET_ALERT_VOLUME_DATA, null, null).then((response: any) => {
      this.setState({
        datasets: [
          {
            label: 'New',
            lineTension: 0.1,
            fill: false,
            borderColor: 'rgba(252, 203, 80, 1)',
            data: response.newAlertList,
          },
          {
            label: 'Resolved',
            lineTension: 0.1,
            fill: false,
            borderColor: 'rgba(73, 183, 234, 1)',
            data: response.closedAlertList,
          },
        ],
        labels: response.daysList,
      });
    });
  };
  createLegend = () => {
    const text = [];
    const { legends } = this.state;
    if (legends && legends.length > 0) {
      for (var i = 0; i < legends.length; i++) {
        text.push(
          <li>
            <div className="chart-legend">
              <span className="legend-background" style={{ backgroundColor: legends[i].fillStyle }}></span>
              <span className="legend-label">{legends[i].text}</span>
            </div>
          </li>
        );
      }
    }
    return text;
  };

  render() {
    return (
      <div className="row" style={{ width: '100%', height: '100%', marginLeft: '0px', marginRight: '0px' }}>
        <Line
          //ref={ref => (this.chart = ref)}
          data={this.state}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    stepSize: 10,
                    beginAtZero: true,
                  },
                },
              ],
            },
            legend: {
              display: false,
              position: 'bottom',
            },
          }}
        />
        <div className="legend-container">
          <ul className="custom-chart-legends">{this.createLegend()}</ul>
        </div>
      </div>
    );
  }
}
