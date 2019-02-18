import React, { Component } from 'react';
import { Button, Input, Icon, Layout, Table, Select, TimePicker, BackTop } from 'antd';
import Highlighter from 'react-highlight-words';

import "antd/dist/antd.css";
import "./style.css";

class App extends Component {
  state = {
    data: null,
    courses: null, 
    collapsed: false,
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    searchText: '',
  };

  fillDatabase = () => {
    fetch('http://localhost:5000/fill_db')
    .then(response => {
      return response.json();
    })
    .then((values) => { 
      this.setState({ data: values.express }); 
    })
    .catch(err => console.log(err));
  };

  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  queryDatabase() {
    fetch('http://localhost:5000/query_db')
    .then(response => {
      return response.json();
    })
    .then((values) => { 
      var data = [];

      Object.keys(values.express).forEach((key) => {
        data.push(values.express[key])
      })

      console.log(data);
      this.setState({ courses: data }); 
    })
    .then(() => {
      this.render()
    })
    .catch(err => console.log(err));
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleSearch(value) {
    console.log(`searched ${value}`);
  }

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

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => { this.searchInput = node; }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }
  
  render = () => {
    const { Option, OptGroup } = Select;
    const { Header, Content, Sider } = Layout;
    const Search = Input.Search;
    const { loading, selectedRowKeys } = this.state;

    //specify rowSelection behavior for table
    //this needs work - is not currently working like it's supposed to
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    if(this.state.courses === null || this.state.courses === {}) {
      this.queryDatabase();
    }

    //specify columns format/behaviors for table
    const columns = [{
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
       /* filters: [{
        text: 'Open',
        value: 'Open',
      }, {
        text: 'Filled',
        value: 'Filled',
      }],
      onFilter: (value, record) => record.status.indexOf(value) === 0, */
    }, {
      title: 'Seats Available',
      dataIndex: 'Seats_Available',
      key: 'Seats_Available',
    }, {
      title: 'CRN',
      dataIndex: 'Course_Registration_Number',
      key: 'Course_Registration_Number',
      ...this.getColumnSearchProps('Course_Registration_Number'),
    }, {
      title: 'Department',
      dataIndex: 'Course_Department',
      key: 'Course_Department',
      ...this.getColumnSearchProps('Course_Department'),
    }, {
      title: 'Level',
      dataIndex: 'Course_Level',
      key: 'Course_Level',
      ...this.getColumnSearchProps('Course_Level'),
    }, {
      title: 'Section',
      dataIndex: 'Course_Section',
      key: 'Course_Section',
      ...this.getColumnSearchProps('Course_Section'),
    }, {
      title: 'Course Title',
      dataIndex: 'Course_Title',
      key: 'Course_Title',
      ...this.getColumnSearchProps('Course_Title'),
    }, {
      title: 'Credits',
      dataIndex: 'Course_Credits',
      key: 'Course_Credits',
      ...this.getColumnSearchProps('Course_Credits'),
    }, {
      title: 'Time',
      dataIndex: 'Times',
      key: 'Times',
      ...this.getColumnSearchProps('Times'),
    }, {
      title: 'Days',
      dataIndex: 'Days',
      key: 'Days',
      ...this.getColumnSearchProps('Days'),
    }, {
      title: 'Location',
      dataIndex: 'Location',
      key: 'Location',
      ...this.getColumnSearchProps('Location'),
    }, {
      title: 'Instructor',
      dataIndex: 'Instructor',
      key: 'Instructor',
      ...this.getColumnSearchProps('Instructor'),
    }, {
      title: 'Competency/GenEd',
      dataIndex: 'Competency',
      key: 'Competency',
      ...this.getColumnSearchProps('Competency'),
    }, {
      title: 'Pre-Reqs/Comments',
      dataIndex: 'Comments',
      key: 'Comments',
      ...this.getColumnSearchProps('Comments'),
    }];
    
    
    return (
      <div className="app-container">
        <Layout className="app">
          <Header className="header">
            <div className="logo" />
            <Search
            placeholder="input search text"
            onSearch={this.handleSearch}
            style={{ width: 200 }}
            />
          </Header>
          <Layout>
            <Sider 
            width={200} 
            style={{ background: '#fff' }} 
            position='fixed' 
            overflow='auto'
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            >
              <div className="logo" />
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
                </div>
                <div className='go-button-container'>
                  <Button type="primary">See Courses!</Button>
                  <Button type="secondary">Clear Filters</Button>
                </div>
                <div className='toggle-button-container'>
                  <Icon
                    className="sider-toggle"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleSider}
                  />
                </div>
            </Sider>
          <Layout className="content-container" style={{ padding: '0 24px 24px' }}>
            <Content style={{
              background: '#fff', 
              padding: 24, 
              margin: 0,
              minHeight: 280,}}
            >
            <Button
              type="primary"
              onClick={this.start}
              disabled={!hasSelected}
              loading={loading}
            >
              Reload
            </Button>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
            { this.state.courses &&
              <div className='table'>
                <Table 
                dataSource={ this.state.courses } 
                columns={ columns }
                rowSelection={ rowSelection }
                expandedRowRender={record => <p style={{ margin: 0 }}>{record.Comments} Add course description here</p>}
                expandRowByClick={true}
                //expandIconColumnIndex = { "5" }
                expandIconAsCell={false}
                //pagination = { false }
                //scroll={{y:5000}}
                />
              </div>
            }

            </Content>
          </Layout>
        </Layout>
      </Layout>
      <div>
        <button onClick={this.fillDatabase}> Fill Database </button>
        <div>{this.state.data}</div>
        <br></br>
        <button onClick={this.queryDatabase}> Query Database </button>
      </div>
     </div>
    );
  }
}

export default App;