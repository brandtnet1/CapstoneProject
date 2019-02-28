import React, { Component } from 'react';
import { Spin, Button, Input, Icon, Layout, Table, Select, TimePicker } from 'antd';
import Highlighter from 'react-highlight-words';

import "antd/dist/antd.css";
import "./style.css";

class App extends Component {
  state = {
    data: null,
    courses: null,
    collapsed: false,
    selectedRowKeys: [], // Check here to configure the default column
    selectedRows: [],
    cart: [],
    loading: true,
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

  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js\
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

      this.setState({ courses: data, loading: false });
    })
    .catch(() => this.setState({ loading: false }));
  };

  // queryDatabaseFilters(filters) {

  // make string append { "ColumnName":"value" , ...}
  // ? Course_Department=ANT&Course_Level=200&
  // ?

  //   fetch('http://localhost:5000/query_db_filters?')
  //   .then(response => {
  //     return response.json();
  //   })
  //   .then((values) => {
  //     var data = [];

  //     Object.keys(values.express).forEach((key) => {
  //       data.push(values.express[key])
  //     })

  //     this.setState({ courses: data });
  //   })
  //   .catch(err => console.log(err));
  // };

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

  onSelectChange = (selectedRowKeys,rowInfo) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys })
    this.setState({selectedRows: rowInfo});
    console.log('selectedRows: ' + this.state.selectedRows)

  }

  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  onAddToCart = () => {
    for(var i = 0; i<this.state.selectedRows.length; i++){
      this.state.cart.push(this.state.selectedRows[i]);
    }
    console.log('Cart changed: ', this.state.cart);

    this.start();

    //document.getElementById("cart").innerHTML = this.state.cart
  }

  handleSearchTopBox(value) {
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

  handleClickSeeCoursesButton() {

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
    /* render: (text) => (
       <Highlighter
         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
         searchWords={[this.state.searchText]}
         autoEscape
         textToHighlight={text.toString()}
       />
    ), */
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
    //const Search = Input.Search;
    const { loading, selectedRowKeys } = this.state;

    //specify rowSelection behavior for table
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    if(this.state.courses === null || this.state.courses === {}) {
      this.queryDatabase();
    }

const loadWheel = React.createElement('div', {className: 'loaderWheel'});
Spin.setDefaultIndicator(loadWheel);

    //specify columns format/behaviors for table
    const columns = [{
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      filters: [{
        text: 'Open',
        value: 'Open',
      }, {
        text: 'Filled',
        value: 'Filled',
      }, {
        text: 'Cancelled',
        value: 'Cancelled',
      }],
      onFilter: (value, record) => record.Status.indexOf(value) === 0,
    }, {
      title: 'Seats',
      dataIndex: 'Seats',
      key: 'Seats',
    },
    // {
    //   title: 'CRN',
    //   dataIndex: 'Course_Registration_Number',
    //   key: 'Course_Registration_Number',
    //   ...this.getColumnSearchProps('Course_Registration_Number'),
    // },
    {
      title: 'Dept.',
      dataIndex: 'Course_Department',
      key: 'Course_Department',
      ...this.getColumnSearchProps('Course_Department'),
    }, {
      title: 'Level',
      dataIndex: 'Course_Level',
      key: 'Course_Level',
      ...this.getColumnSearchProps('Course_Level'),
    },
    // {
    //   title: 'Section',
    //   dataIndex: 'Course_Section',
    //   key: 'Course_Section',
    //   ...this.getColumnSearchProps('Course_Section'),
    // },
    {
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
    },
    //{
    //   title: 'Location',
    //   dataIndex: 'Location',
    //   key: 'Location',
    //
    //   ...this.getColumnSearchProps('Location'),
    // },
    {
      title: 'Instructor',
      dataIndex: 'Instructor',
      key: 'Instructor',
      ...this.getColumnSearchProps('Instructor'),
    },
    // {
    //   title: 'Competency/GenEd',
    //   dataIndex: 'Competency',
    //   key: 'Competency',
    //   ...this.getColumnSearchProps('Competency'),
    // }, {
    //   title: 'Pre-Reqs/Comments',
    //   dataIndex: 'Comments',
    //   key: 'Comments',
    //  }
    ];

    return (
      <div className="app-container">
        <Layout className="app">
          <Header className="header" style={{background: '#0071ba'}}>
            <img className="logo" alt="rollins-logo" src="../logo-rollins-college-nav.svg"></img>
            {/* <Search
            placeholder="Search"
            onSearch={this.handleSearchTopBox}
            style={{ width: 200 }}
            /> */}
          </Header>
          <Layout>
            <Sider
            width={200}
            style={{ background: '#fff' }}
            position='fixed'
            overflow='auto'
            trigger={null}
            collapsible
            collapsedWidth={0}
            collapsed={this.state.collapsed}
            >
              <div className="ui-selectors">
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select status..."
                    onChange={this.handleSelectStatus}
                    allowClear={true}
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
                    allowClear={true}
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
                    allowClear={true}
                  >
                  </TimePicker >
                <TimePicker
                    style={{ width: '100%' }}
                    placeholder="Select end time..."
                    minuteStep={5}
                    format = 'hh:mm a'
                    use12Hours
                    onChange={this.handleSelectDay}
                    allowClear={true}
                  >
                  </TimePicker >
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select department/major (you can also search here!)..."
                    onChange={this.handleSelectDeparment}
                    allowClear={true}
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
                    allowClear={true}
                  >
                    <Option value="100">100s</Option>
                    <Option value="200">200s</Option>
                    <Option value="300">300s</Option>
                    <Option value="400">400s</Option>
                  </Select>
                <Button
                  type="primary"
                  style={{ width: '100%' }}
                  onChange={this.handleSelectLevel}
                >See Courses!</Button>
                <Button
                  type="secondary"
                  style={{ width: '100%' }}
                  onChange={this.handleSelectLevel}
                >Clear Filters</Button>

                <div className='cart'>
                <p> Course Cart </p>

                {this.state.cart.map(function(d, idx){
                  return (<li key={idx}>{d.Course_Title}</li>)
                })}



                </div>
              </div>
            </Sider>
            <Layout className="content-container" onClick={this.toggleSider} style={{ padding: '0 24px 24px' }}>
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

              <Button
                type="primary"
                onClick={this.onAddToCart}
                disabled={!hasSelected}
                loading={loading}
              >
                Add to Cart
              </Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
              </span>
              {loading ?
                <Spin>
                    <Table
                    dataSource={ this.state.courses }
                    columns={ columns }
                    rowSelection={ rowSelection }
                    hideDefaultSelections= {true}
                    expandedRowRender={record => <p style={{ margin: 0 }}> Location: {record.Location} <br /> CRN: {record.Course_Registration_Number} <br /> Section: {record.Course_Section} <br /> Prereqs/Comments:{record.Comments}</p>}
                    expandRowByClick={true}
                    //expandIconColumnIndex = { "5" }
                    expandIconAsCell={false}
                    pagination={false}
                    //scroll={{y:600}}
                    size={"small"}
                    rowKey = "_id"
                    />
              </Spin>
              : <div>{ this.state.courses &&
                  <div className='table' >
                  {/* this is for the loading wheel */}
                  {/* <div className='loader'></div> */}
                    <Table
                    dataSource={ this.state.courses }
                    columns={ columns }
                    rowSelection={ rowSelection }
                    hideDefaultSelections= {true}
                    expandedRowRender={record => <p style={{ margin: 0 }}> Location: {record.Location} <br /> CRN: {record.Course_Registration_Number} <br /> Section: {record.Course_Section} <br /> Prereqs/Comments:{record.Comments}</p>}
                    expandRowByClick={true}
                    //expandIconColumnIndex = { "5" }
                    expandIconAsCell={false}
                    pagination={false}
                    //scroll={{y:600}}
                    size={"small"}
                    rowKey = "_id"
                    />
                  </div>}
                </div>
            }
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <div>
        {/* <button onClick={this.fillDatabase}> Fill Database </button> */}
        {/* <div>{this.state.data}</div> */}
        {/* <br></br> */}
        {/* <button onClick={this.queryDatabase}> Query Database </button> */}
      </div>
     </div>
    );
  }
}

export default App;
