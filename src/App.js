import React, { Component } from 'react';
import { Table } from 'antd';

import "antd/dist/antd.css";
//import "./index.css";

class App extends Component {
  state = {
    data: null
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/index');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };
  
  render() {
    //dataSource for table - currently only has dummy data
    //when the server is finished, delete the dummy data here and the line below should be all that is needed
    //const { data } = this.state;
    const data = [{
      key: '1',
      status: 'Open',
      seats: 3,
      course: '10102 CMS 167 1',
      title: 'Problem Solving I: with Java',
      credits:'4',
      time:'1 :00-2 :15P',
      days:'MW',
      location:'BUSH 201',
      instructor:'D Myers',
      gened:'',
      comments:'Co-requisite: CMS 167L'
    }, {
      key: '2',
      status: 'Open',
      seats: 3,
      course: '10103 CMS 167L 1',
      title: 'Problem Solving I Lab',
      credits:'1',
      time:'11:00-12:15P',
      days:'F',
      location:'BUSH 164',
      instructor:'D Myers',
      gened:'',
      comments:'Co-requisite: CMS 167'
    }, {
      key: '3',
      status: 'Filled',
      seats: 0,
      course: '10095 CMC 110 1',
      title: 'Digital Storytelling',
      credits:'4',
      time:'2 :00-3 :15P',
      days:'TR',
      location:'OLIN 220',
      instructor:'S Schoen',
      gened:'',
      comments:'FIL elective. SI Skills course.'
    }];
    //columns for table
    const columns = [{
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [{
        text: 'Open',
        value: 'Open',
      }, {
        text: 'Filled',
        value: 'Filled',
      }],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    }, {
      title: 'Seats Available',
      dataIndex: 'seats',
      key: 'seats',
    }, {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    }, {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
    }, {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: 'Days',
      dataIndex: 'days',
      key: 'days',
    }, {
      title: 'Location',
      dataIndex: 'Location',
      key: 'Location',
    }, {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    }, {
      title: 'Competency/GenEd',
      dataIndex: 'gened',
      key: 'gened',
    }, {
      title: 'Pre-Reqs/Comments',
      dataIndex: 'comments',
      key: 'comments',
    }];

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Rollins Course Schedule</h1>
          <Table dataSource={data} columns={columns} />
        </header>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
