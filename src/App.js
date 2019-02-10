import React, { Component } from 'react';
import { Table, Select, TimePicker, BackTop } from 'antd';

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

  handleSelectStatus(value) {
    console.log(`selected ${value}`);
  }

  handleSelectDay(value) {
    console.log(`selected ${value}`);
  }

  handleSelectTime(value) {
    console.log(`selected ${value}`);
  }

  handleSelectDeparment(value) {
    console.log(`selected ${value}`);
  }

  handleSelectLevel(value) {
    console.log(`selected ${value}`);
  }
  
  render() {
    const { Option, OptGroup } = Select;
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
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Rollins Course Schedule</h1>
          <div className="ui-selectors">

          <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select status..."
              onChange={this.handleSelectStatus}
            >
              <Option value="open">Open</Option>
              <Option value="filled">Filled</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>

            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select day of the week..."
              onChange={this.handleSelectDay}
            >
              <Option value="monday">Monday</Option>
              <Option value="tuesday">Tuesday</Option>
              <Option value="wednesday">Wednesday</Option>
              <Option value="thursday">Thursday</Option>
              <Option value="friday">Friday</Option>
              <Option value="saturday">Saturday</Option>
            </Select>

            <TimePicker
              style={{ width: '100%' }}
              placeholder="Select start time..."
              minuteStep={5}
              format = 'hh:mm a'
              use12Hours
              onChange={this.handleSelectDay}
            >
            </TimePicker >
            <TimePicker
              style={{ width: '100%' }}
              placeholder="Select end time..."
              minuteStep={5}
              format = 'hh:mm a'
              use12Hours
              onChange={this.handleSelectDay}
            >
            </TimePicker >

            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select department/major (you can also search here!)..."
              onChange={this.handleSelectDeparment}
            >
              <Option value="american">American Studies</Option>
              <Option value="anthropology">Anthropology</Option>
              <Option value="art-histoy">Art & Art History</Option>
              <Option value="biology">Biology</Option>
              <Option value="business">Business</Option>
              <Option value="career">Career And Life Planning</Option>
              <Option value="biochemistry">Biochemistry</Option>
              <Option value="chemistry">Chemistry</Option>
              <Option value="classical-studies">Classical Studies</Option>
              <Option value="communication">Communication</Option>
              <Option value="computer-science">Computer Science</Option>
              <Option value="cricital-media-cultural">Critical Media & Cultural Studies</Option>
              <Option value="economics">Economics</Option>
              <Option value="education">Education</Option>
              <Option value="english">English</Option>
              <Option value="environmental">Environmental Studies</Option>
              <Option value="film">Film Studies</Option>
              <Option value="global-health">Global Health</Option>
              <Option value="health-professions">Health Professions Advising</Option>
              <Option value="health-phyiscal">Health and Physical Education </Option>
              <Option value="history">History</Option>
              <Option value="honors">Honors Degree Program</Option>
              <Option value="it">Information Technology</Option>
              <Option value="interdisciplinary">Interdisciplinary</Option>
              <Option value="latin-amerian-caribbean">Latin American & Caribbean</Option>
              <Option value="mathematics">Mathematics</Option>
              <Option value="middle-eastern-north-african">Middle Eastern & North African Studies</Option>
              <OptGroup label="Modern Languages & Literatures">
                <Option value="arabic">Arabic</Option>
                <Option value="chinese">Chinese</Option>
                <Option value="french">French</Option>
                <Option value="german">German</Option>
                <Option value="japanese">Japnese</Option>
                <Option value="spanish">Spanish</Option>
              </OptGroup>
              <Option value="music">Music</Option>
              <Option value="neuroscience">Neuroscience</Option>
              <Option value="off-campus">Off-Campus Program Courses</Option>
              <Option value="philosophy">Philosophy</Option>
              <Option value="religion">Religion</Option>
              <Option value="physics">Physics</Option>
              <Option value="political-science">Political Science</Option>
              <Option value="psychology">Psychology</Option>
              <Option value="rcc">Rollins Conference Courses</Option>
              <Option value="swag">Sexuality Women's & Gender Studies</Option>
              <Option value="social-entrepreneurship">Social Entrepreneurship</Option>
              <Option value="social-innovation">Social Innovation</Option>
              <Option value="sociology">Sociology</Option>
              <Option value="resource">Student Resource Center</Option>
              <Option value="theatre">Theatre Arts</Option>
              <Option value="dance">Dance</Option>
              <OptGroup label="rFLA">
                <Option value="rfla">rFLA</Option>
                <Option value="ice">ICE</Option>
                <Option value="imw">IMW</Option>
                <Option value="mm">MM</Option>
                <Option value="wcc">WCC</Option>
              </OptGroup>
            </Select>

            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select course level (100, 200, etc.)..."
              onChange={this.handleSelectLevel}
            >
              <Option value="100">100s</Option>
              <Option value="200">200s</Option>
              <Option value="300">300s</Option>
              <Option value="400">400s</Option>
            </Select>
            <BackTop />
          </div>
          <div className='table'>
            <Table dataSource={data} columns={columns} />
          </div>
        </header>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
