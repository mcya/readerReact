import React from 'react'
import {Layout, Menu, Dropdown, Icon, Spin, BackTop} from 'antd'
import { Link } from 'react-router-dom'
import BookItem from './bookItem'
import styles from '../styles/main.less'
import template from './template'
import ReactPullToRefresh from 'react-pull-to-refresh'
import 'whatwg-fetch';

let menuPng = require('../images/menu.png');

const { Header, Content, Footer } = Layout

class AppComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bookList: this.props.bookList.list,
      refresh: false,
      moshi: false
    }
    this.menuClick = (item) => {
      console.log('item', item)
      const key = item.key
      if (key == 2) {
        console.log('item九宫格', item)
        this.setState({
         moshi: true
        })
      } else if (key == 3) {
        console.log('item列表', item)
        this.setState({
         moshi: false
        })
      }
    }
    this.menu = (
      <Menu onClick={::this.menuClick} className={styles.xiala}>
        <Menu.Item key="2">
          <a href="#"><Icon type="appstore-o" style={{ marginRight: '0.3rem' }} />宫格展示</a>
        </Menu.Item>
        <Menu.Item key="3">
          <a href="#"><Icon type="book" style={{ marginRight: '0.3rem' }} />列表展示</a>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/about"><Icon style={{ marginRight: '0.3rem' }} type="question-circle-o"/>关于</Link>
        </Menu.Item>
      </Menu>
    )

    this.handleRefresh = (resolve) => {
      resolve();
      this.setState({refresh: true});
      this.props.refreshBook();
    }

  }





  componentWillMount() {
  }

  componentWillReceiveProps(nextProps){
    this.setState({bookList: nextProps.bookList.list, refresh: false})
  }


  render() {
    return (
      <div className="page" ref="main">
        <Layout>
          <Header className={styles.header}>
            <span className={styles.title}>移动阅读APP</span>
            <Dropdown
              overlay={this.menu}
              placement="bottomRight"
              trigger={['click']}
              >
              {/* appstore-o */}
              <Icon type='bars' className={styles.dropdown}/>
            </Dropdown>
            <Link to="/search"><Icon type="search" className={styles.search}/></Link>
          </Header>

          <Content className={styles.content}>
          { this.state.refresh ? (<Spin/>) : ''}
          <ReactPullToRefresh
            onRefresh={this.handleRefresh}
          >
            {
              this.state.bookList.length === 0 ?
              (
                <div className={styles.null}>
                  书架空空的！快去添加点书吧！
                </div>
              )
              : this.state.bookList.map((item, index) => <Link to={`/read/${index}`} key={index}>
                <BookItem moshi={this.state.moshi} data={item} deleteBook={this.props.deleteBook} key={index} />
              </Link>)
            }
          </ReactPullToRefresh>
          <BackTop />
          </Content>
        </Layout>
        {/* <div>
        </div> */}
      </div>
    )
  }
}

AppComponent.defaultProps = {
}

export default template(AppComponent)
