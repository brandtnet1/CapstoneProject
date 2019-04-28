import React, { Component } from 'react';
import { message, List, Form, Tooltip, Popover, Spin, Button, Input, Icon, Layout, Table, TimePicker } from 'antd';

import "antd/dist/antd.css";
import "./style.css";

class App extends Component {
  state = {
    courses: null,       // Contains all courses in the query from database
    selectedRowKeys: [], // Check here to configure the default column
    selectedRows: [],    // Contains all selected rows when you click the check box
    cart: [],            // Contains all courses added to cart
    startTime: null,     // Time filter beginning time
    endTime: null,       // Time filter ending time
    loading: true,       // Check if query of courses has been received yet
    visible: false,      //
    exported: false,     // Course Schedule successfully exporter
    searchText: '',      // Used for adding/checking filters
  };

  // Fetches our GET route from the Node/Express server.
  // (Note the route we are fetching matches the GET route from server.js
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
      // Set courses state to hold all data from query
      this.setState({ courses : data, loading : false });
    })
    .catch(() => this.setState({ loading : false }));
  };

  /******************Cart methods*******************/

  handleExportCart = () => {
    // Get all the Course Registration Numbers from the cart and add them
    // to a query so we can search the database so we can search database
    var query = "?";
    this.state.cart.forEach((course) => {
      query = query + "CRN=" + course.Course_Registration_Number + "&";
    });

    fetch('http://localhost:5000/export_cart' + query)
    .then(response => {
      return response.json();
    })
    .then((values) => {
      this.setState({ exported: values.exported });
    })
    .catch(err => console.log(err));

    // Open additional window to display exported course schedule
    window.open("http://localhost:5000/export_cart" + query);
  }

  handleAddToCart = () => {
    if (this.state.cart.length <= 5 && this.state.selectedRows.length <= 5) {
        for (var i = 0; i<this.state.selectedRows.length; i++){
          if (this.state.selectedRows[i].Status === 'Open') {
            if (!this.state.cart.includes(this.state.selectedRows[i])) {
              this.state.cart.push(this.state.selectedRows[i]);
            }
          } else if (this.state.selectedRows[i].Status === 'Filled') {
            alert("One or more of your selected courses is filled :(");
          } else if (this.state.selectedRows[i].Status === 'Canceled') {
            alert("One or more of your selected classes has been canceled :(");
          }
        }
    } else {
      alert("Slow down there, hotshot. Please only add 5 classes or fewer.")
    }
    this.setState({ selectedRowKeys : [], visible : true });
  }

  // Changes the visibility of the loading wheel
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  handleDelete = (item) => {
    var index = this.state.cart.indexOf(item);
    this.state.cart.splice(index,1);
    this.setState({cart : this.state.cart});
    if (this.state.cart.length === 0) {
      this.setState({ visible : false});
    }
  }

  // Resets the state value of cart to empty
  handleClearCart = () => {
    this.setState({cart: []});
  }

  // Removes checked classes
  handleClearSelection = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }

  /****************End Cart methods*******************/

  // Select more row/s or unselected row/s
  handleSelectChange = (selectedRowKeys,rowInfo) => {
    this.setState({ selectedRowKeys, selectedRows : rowInfo });
  }

  // Used to convert hr:min string time format to military time
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

  // Changes start time state variable to match military time
  handleSelectStartTime = (value) => {
    if(value) {
      if(value._d.getMinutes() === 0) {
        this.setState({ startTime : value._d.getHours() + ":00" });
      } else {
        this.setState({ startTime : value._d.getHours() + ":" + value._d.getMinutes() });
      }
    }
  }

  // Changes end time state variable to match military time
  handleSelectEndTime = (value) => {
    if(value) {
      if(value._d.getMinutes() === 0) {
        this.setState({ endTime : value._d.getHours() + ":00" });
      } else {
        this.setState({ endTime : value._d.getHours() + ":" + value._d.getMinutes() });
      }
    }
  }

  // Contains our default Search properties including a special case for our time filter
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
    onFilter: (value, record) => { // The default filter, check if value is included in text
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  })

  // React's generic filtering search
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  // Clear specific filter or all filters
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText : '' });
  }

  // Send's email containing the exported course schedule
  handleSendEmail = () => {
    // Send server query containing the email the user wants it sent too
    var query = "?Email=" + document.getElementById('userEmail1').value + "&Subscriber=False&";

    // Query also contains all the courses the user wants to sign up for
    this.state.cart.forEach((course) => {
      query = query + "CRN=" + course.Course_Registration_Number + "&";
    });

    fetch('http://localhost:5000/send_email' + query)
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
    message.success("Course cart sent to " + document.getElementById('userEmail1').value + "!");
  }

  // For future use when we set up subscriber system
  handleAddSubscriber(record) {
    if(document.getElementById('userEmail2')) {
      var query = "?Email=" + document.getElementById('userEmail2').value + "&Subscriber=True" +"&Course="+JSON.stringify(record);
      fetch('http://localhost:5000/send_email' + query)
      .then(response => {
        return response.json();
      })
      .catch(err => console.log(err));
    }
  }

  render = () => {
    // Query the database on startup to fill courses state variable
    if (this.state.courses === null || this.state.courses === {}) {
      this.queryDatabase();
    }

    const { Header, Content } = Layout;
    const { loading, selectedRowKeys, cart } = this.state;

    //specify rowSelection behavior for table
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;
    const hasItemsInCart = cart.length > 0;

    // Set the loader wheel options
    const loadWheel = React.createElement('div', {className: 'loader-wheel'});
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
    }, {
      title: 'Dept.',
      dataIndex: 'Course_Department',
      key: 'Course_Department',
      ...this.getColumnSearchProps('Course_Department'),
    }, {
      title: 'Course Level',
      dataIndex: 'Course_Level',
      key: 'Course_Level',
      ...this.getColumnSearchProps('Course_Level'),
      onFilter: (value, record) => record.Course_Level >= value && record.Course_Level <= ((parseInt(value)/100) * 100) + 99,
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
          if (end.includes("12")){
            modifier = "A"
          }
          var start = this.convertTime(time[0], modifier);
          if (filter_times[0] === 'null' && parseInt(filter_times[1].replace(":","")) >= parseInt(end)) {
            t = true;
          }
          else if (filter_times[1] === 'null' && parseInt(filter_times[0].replace(":", "")) <= parseInt(start)) {
            t = true;
          }
          else if (parseInt(filter_times[0].replace(":", "")) <= parseInt(start) && parseInt(filter_times[1].replace(":","")) >= parseInt(end)) {
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
    }];

    return (
      <div className="app-container">
        <Layout className="app">
          <Header className="header" style={{background: '#0071ba'}}>
            <img className="logo" alt="rollins-logo" src="../logo-rollins-college-nav.svg"></img>
            <Popover
              placement="bottom"
              content={
                <List
                  size="small"
                  head={<div>Course Cart</div>}
                  dataSource={this.state.cart}
                  renderItem={item => (
                  <List.Item
                    actions={[
                    <a>
                      <Icon
                        onClick={() => this.handleDelete(item)}
                        type="delete"
                        theme="twoTone"
                      />
                    </a>]}
                    key={item._id}
                  >
                    {item.Course_Title}
                  </List.Item>)}
                  footer={
                    <Button.Group>
                      <Button
                        size="small"
                        disabled={!hasItemsInCart}
                        onClick={this.handleExportCart}
                      >
                        Export
                      </Button>
                      <Popover
                        placement="bottom"
                        trigger="click"
                        content={
                          <Form layout="inline">
                            <Form.Item>
                                <Input id="userEmail1" placeholder="Enter email..."/>
                            </Form.Item>
                            <Form.Item>
                              <Tooltip title="Enter an email to receive your course cart at. You can enter your own email or your advisor's!">
                                <Button
                                  size="small"
                                  type="primary"
                                  disabled={!hasItemsInCart}
                                  htmlType="submit"
                                  onClick={this.handleSendEmail}
                                >
                                  Send
                                </Button>
                              </Tooltip>
                            </Form.Item>
                          </Form>
                        }
                      >
                        <Button
                          size="small"
                          disabled={!hasItemsInCart}
                        >
                          Email
                        </Button>
                      </Popover>
                      <Button
                        size="small"
                        type="danger"
                        disabled={!hasItemsInCart}
                        onClick={this.handleClearCart}
                      >
                        Clear
                        </Button>
                    </Button.Group>}
                />
              }
              trigger="click"
              visible={this.state.visible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Button className="shopping-cart" id="shoppingCart">Course Cart</Button>
            </Popover>
          </Header>
          <div className="header-and-content-divider">
          </div>
          <Layout className="content-container" style={{ padding: '0 24px 24px' }}>
            <Content style={{
              background: '#fff',
              padding: 15,
              margin: 0,
              minHeight: 280,}}
            >
              <Tooltip title="Add your current selection to cart. You can then send this cart to your advisor or to youself with one click!">
                <Button
                  type="primary"
                  onClick={this.handleAddToCart}
                  disabled={!hasSelected}
                  loading={loading}
                >
                  Add to Cart
                </Button>
              </Tooltip>
              <Tooltip title="Clear your current selection">
                <Button
                  type="primary"
                  onClick={this.handleClearSelection}
                  disabled={!hasSelected}
                  loading={loading}
                >
                  Clear
                </Button>
              </Tooltip>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
              </span>
              { loading ?
                <Spin>
                  {/* This is just to create the table in the background behind the loading animation */}
                    <Table
                    columns={ columns }
                    pagination={ false }
                    size={ "medium" }
                    />
              </Spin>
              : <div> { this.state.courses &&
                  <div className='table' >
                    <Table
                    dataSource={ this.state.courses }
                    columns={ columns }
                    rowSelection={ rowSelection }
                    hideDefaultSelections= { true }
                    expandedRowRender={record =>
                      <div>
                        <p style={{ margin: 0 }}>
                        Credits: {record.Course_Credits} <br />
                        CRN: {record.Course_Registration_Number} <br />
                        Section: {record.Course_Section} <br />
                        Prereqs/Comments:{record.Comments}
                        </p>
                        <Form layout="inline">
                          <Form.Item>
                            <Input id="userEmail2" placeholder="Enter email..."/>
                          </Form.Item>
                          <Form.Item>
                            <Tooltip title="Stay updated on any changes to this course!">
                              <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => this.handleAddSubscriber(record)}
                              >
                                Subscribe
                              </Button>
                            </Tooltip>
                          </Form.Item>
                        </Form>
                      </div>}
                    expandRowByClick={true}
                    expandIconAsCell={false}
                    pagination={false}
                    size={"medium"}
                    rowKey = "_id"
                    />
                  </div>}
                </div>}
            </Content>
          </Layout>
      </Layout>
     </div>
    );
  }
}

export default App;
