import React, { Component } from 'react';
import { Tooltip, Popover, Spin, Button, Input, Icon, Layout, Table, TimePicker } from 'antd';

import "antd/dist/antd.css";
import "./style.css";

class App extends Component {
  state = {
    data: null,
    courses: null,
    collapsed: true,
    selectedRowKeys: [], // Check here to configure the default column
    selectedRows: [],
    startTime: null,
    endTime: null,
    cart: [],
    loading: true,
    searchText: '',
    visible: false,
    exported: false,
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

      this.setState({ courses : data, loading : false });
    })
    .catch(() => this.setState({ loading : false }));
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

  /******************Cart methods*******************/

  onExportCart = () => {
    var query = "?";
    this.state.cart.forEach((course) => {
      query = query + "CRN=" + course.Course_Registration_Number + "&";
    });
    console.log("Export: " + query);

    fetch('http://localhost:5000/export_cart' + query)
    .then(response => {
      return response.json();
    })
    .then((values) => {
      this.setState({ exported: values.exported });
    })
    .catch(err => console.log(err));

    window.open("http://localhost:5000/export_cart" + query);

  }

  //grab content from state.cart and email it
  onEmailCart = () => {

  }

  onEmailCart2 = () => {

  }

  onAddToCart = () => {
    if(this.state.cart.length <= 5 && this.state.selectedRows.length <= 5) {
      for(var i = 0; i<this.state.selectedRows.length; i++){
        if(!this.state.cart.includes(this.state.selectedRows[i])) {
          this.state.cart.push(this.state.selectedRows[i]);
        }
      }
    }
    else {
      alert("Slow down there, hotshot.")
    }
    // if(this.state.selectedRows[i].Status == "Filled") {
    //   alert("This class is full");
    // }
    
    this.setState({ selectedRowKeys : [], visible : true });
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  handleDelete = (item) => {
    var index = this.state.cart.indexOf(item);
    this.state.cart.splice(index,1);
    this.setState({cart : this.state.cart});

    if(this.state.cart.length === 0) {
      this.setState({ visible : false});
    }

  }

  onClearCart = () => {
    this.setState({cart: []});
  }

  onClearSelection = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }

  /****************End Cart methods*******************/

  onSelectChange = (selectedRowKeys,rowInfo) => {
    this.setState({ selectedRowKeys, selectedRows : rowInfo });
  }

  convertTime = (time, modifier) => {
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'P') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}${minutes}`;
  }

  handleSelectStartTime = (value) => {
    if(value){
      if(value._d.getMinutes() === 0){
        this.setState({ startTime : value._d.getHours() + ":00" });
      } else {
        this.setState({ startTime : value._d.getHours() + ":" + value._d.getMinutes() });
      }
    }
  }

  handleSelectEndTime = (value) => {
    if(value){
      if(value._d.getMinutes() === 0){
        this.setState({ endTime : value._d.getHours() + ":00" });
      } else {
        this.setState({ endTime : value._d.getHours() + ":" + value._d.getMinutes() });
      }
    }
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>

        { dataIndex !== "Times" &&
          <Input
            ref={node => { this.searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        }
        { dataIndex === "Times" &&
          <Input.Group compact>
            <TimePicker
              style={{ width: '50%' }}
              placeholder="Start Time"
              minuteStep={5}
              format = 'hh:mm a'
              use12Hours
              onChange={this.handleSelectStartTime}
              allowClear={true}
            >
            </TimePicker>
            <TimePicker
              style={{ width: '50%' }}
              placeholder="End Time"
              minuteStep={5}
              format = 'hh:mm a'
              use12Hours
              onChange={this.handleSelectEndTime}
              allowClear={true}
            >
            </TimePicker>
          </Input.Group>

        }
    
        <Button
          type="primary"
          onClick={() => {
            if(dataIndex === "Times") {
              setSelectedKeys([this.state.startTime + "-" + this.state.endTime]);
            }
            this.handleSearch(selectedKeys, confirm)
          }
        }
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
    onFilter: (value, record) => {
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] }); 
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText : '' });
  }

  render = () => {
    const { Header, Content } = Layout;
    const { loading, selectedRowKeys } = this.state;
    //const hasFiltered = filteredInfo.length > 0;
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
        text: 'Canceled',
        value: 'Canceled',
      }],
      onFilter: (value, record) => record.Status.indexOf(value) === 0,
    }
    /* , {
      title: 'Seats',
      dataIndex: 'Seats_Available',
      key: 'Seats_Available',
    } */,
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
      title: 'Course Level',
      dataIndex: 'Course_Level',
      key: 'Course_Level',
      ...this.getColumnSearchProps('Course_Level'),
      onFilter: (value, record) => {
        if(value.includes('+')){
          value = parseInt(value.substring(0, value.length - 1));
          return record.Course_Level >= value && record.Course_Level <= ((value/100) * 100) + 99;
        } else {
          return record.Course_Level === parseInt(value);
        }
      },
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
    },
    // {
    //   title: 'Credits',
    //   dataIndex: 'Course_Credits',
    //   key: 'Course_Credits',
    // },
    {
      title: 'Time',
      dataIndex: 'Times',
      key: 'Times',
      ...this.getColumnSearchProps('Times'),
      onFilter: (value, record) => {
        var filter_times = value.split("-");
        var t = false;

        record['Times'].forEach((time) => {
          var modifier = time[time.length -1];
          time = time.slice(0, -1).split("-");
          var end = this.convertTime(time[1], modifier);
          if(end.includes("12")){
            modifier = "A"
          }
          var start = this.convertTime(time[0], modifier);
          
          if (filter_times[0] && parseInt(filter_times[1].replace(":","")) >= parseInt(end)) {
            t = true;
            console.log("1");
          }
          else if (filter_times[1] && parseInt(filter_times[0].replace(":", "")) <= parseInt(start)) {
            t = true;
            console.log("2");
          }
          else if(parseInt(filter_times[0].replace(":", "")) <= parseInt(start) && parseInt(filter_times[1].replace(":","")) >= parseInt(end)) {
              t = true;
            }          
        });

        return t;
    },
      render: (props) => <span>{ props.map(prop => <li> {prop} </li>) }</span>,
    }, {
      title: 'Days',
      dataIndex: 'Days',
      key: 'Days',
      filters: [{
        text: 'Monday',
        value: 'M',
      }, {
        text: 'Tuesday',
        value: 'T',
      }, {
        text: 'Wednesday',
        value: 'W',
      }, {
        text: 'Thursday',
        value: 'Tr',
      }, {
        text: 'Friday',
        value: 'F',
      }],
      onFilter: (value, record) => record.Days.includes(value),
      render: (props) => <span>{ props.map(prop => <li> {prop} </li>) }</span>,
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
            <Popover
              placement="bottom"
              content={
                <div>
                {this.state.cart.map(item => (
                    <li key={item._id}>{item.Course_Title}
                    <Button onClick = {() => this.handleDelete(item)} className = "miniButton"> X </Button>
                    </li>
                ))}
                <Button onClick={this.onExportCart}>Export</Button>
                <Popover
                  placement="bottom"
                  content={
                    <Input 
                      placeholder="Enter email address"
                      addonAfter={
                      <Button onClick ={this.onEmailCart} type="primary">Send</Button>}
                      />
                  }
                >
                  <Button>Email</Button>
                </Popover>
                <Button onClick={this.onClearCart} type="danger">Clear Cart</Button>
                </div>
              }
              title="Course Cart"
              trigger="click"
              style={{ width: 500 }}
              visible={this.state.visible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Button className="shoppingcart" id="shoppingCart">Shopping Cart</Button>
            </Popover>

          </Header>
          <Layout className="sider-and-content-container">
            <Layout className="content-container" style={{ padding: '0 24px 24px' }}>
            <Content style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,}}
            >
              <Tooltip title="Clear your current selection">
                <Button
                  type="primary"
                  onClick={this.onClearSelection}
                  disabled={!hasSelected}
                  loading={loading}
                >
                  Clear
                </Button>
              </Tooltip>
              <Tooltip title="Add your current selection to cart. You can then send this cart to your advisor or to youself with one click!">
                <Button
                  type="primary"
                  onClick={this.onAddToCart}
                  disabled={!hasSelected}
                  loading={loading}
                >
                  Add to Cart
                </Button>
              </Tooltip>
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
                    expandedRowRender={record =>
                      <p style={{ margin: 0 }}>
                      Credits: {record.Course_Credits} <br />
                      CRN: {record.Course_Registration_Number} <br />
                      Seats: {record.Seats_Available} <br />
                      Prereqs/Comments:{record.Comments}
                      </p>}
                    expandRowByClick={true}
                    expandIconAsCell={false}
                    pagination={false}
                    size={"medium"}
                    rowKey = "_id"
                    />
              </Spin>
              : <div>{ this.state.courses &&
                  <div className='table' >
                    <Table
                    dataSource={ this.state.courses }
                    columns={ columns }
                    rowSelection={ rowSelection }
                    hideDefaultSelections= {true}
                    expandedRowRender={record =>
                      <p style={{ margin: 0 }}>
                      Credits: {record.Course_Credits} <br />
                      CRN: {record.Course_Registration_Number} <br />
                      Seats: {record.Seats_Available} <br />
                      Prereqs/Comments:{record.Comments}
                      </p>}
                    expandRowByClick={true}
                    expandIconAsCell={false}
                    pagination={false}
                    size={"medium"}
                    rowKey = "_id"
                    />
                  </div>}
                </div>
            }
            </Content>
          </Layout>
        </Layout>
      </Layout>
     </div>
    );
  }
}

export default App;
