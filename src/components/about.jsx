import React from 'react';
import {Layout, Icon} from 'antd';
import { Link } from 'react-router-dom';
import styles from '../styles/about.less';

const { Header, Content } = Layout;

class Read extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Layout >
          <Header className={styles.header}>
            <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
            <span className={styles.title}>关于</span>
          </Header>
          <Content className={styles.content}>
            <img src="../touxiang.JPG"/>
            <h1>小黄萌</h1>
            <h2><a href="http://blog.csdn.net/genius_yym/article/details/52904161">个人博客地址</a></h2>
            <h2>移动阅读APP！绿色无广告，永久免费！</h2>
            <br/>
            <h2>感谢支持</h2>
          </Content>
        </Layout>
      </div>
    )
  }
}

export default Read;
