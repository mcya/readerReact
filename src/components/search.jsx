import React from 'react';
import {Layout, Icon, Input, Spin, Tag, message} from 'antd';
import { Link } from 'react-router-dom';
import ResultBookItem from './resultBookItem';
import styles from '../styles/search.less';
import template from './template';
import storejs from 'store/dist/store.legacy';
import randomcolor from 'randomcolor';

const { Header, Content } = Layout

class Search extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      searchValue: this.props.fetchBookList.name,
      bookList: this.props.fetchBookList.books,
      loading: false,
      searchHistory: storejs.get('searchHistory') || []
    };
    this.flag = this.state.searchValue.length ? false : true;
// 随机生成颜色
    this.tagColorArr = this.state.searchHistory.map(item => randomcolor({luminosity: 'dark'}));
    console.log(this.tagColorArr)
    // 清空历史
    this.clearHistory = () => {
      let searchHistory = [];
      this.setState({searchHistory});
      storejs.set('searchHistory', searchHistory);
    }
// 搜索的时候
    this.searchBook = (value) => {
      this.flag = false;
      value = value === undefined ? this.state.searchValue : value;
      if (new Set(value).has(' ') || value === '') {
        message.info('亲爱的读者！别输入空格或者空哦！');
        return;
      }
      //搜索后，即更新搜索历史
      let searchHistory = new Set(this.state.searchHistory);
      searchHistory = Array.from(searchHistory.add(value));
      storejs.set('searchHistory', searchHistory);

      this.tagColorArr.push(randomcolor({luminosity: 'dark'}));

      this.setState({loading: true, searchHistory});
      // 启用搜索方法
      this.props.getBookList(value);
    }
// 清空
    this.clearInput = () => {
      this.flag = true;
      this.setState({searchValue:''});
    }
// 历史搜索标签
    this.wordSearch = (e) => {
      let word = e.target.textContent;
      this.setState({searchValue: word});
      this.searchBook(word);
    }

    this.handleChange = (e) => {
      this.setState({searchValue:e.target.value});
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({bookList: nextProps.fetchBookList.books, searchValue: nextProps.fetchBookList.name, loading: false});
  }

  render() {
    console.log('搜索历史this', this);
    return (
      <div className="page" ref="search">
        <Layout >
          <Header className={styles.header}>
            <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
            <Input
              ref="search"
              placeholder="请输入搜索的书名"
              className={styles.searchInput}
              value={this.state.searchValue}
              onChange={this.handleChange}
              onPressEnter={ () => this.searchBook()}
              suffix={<Icon style={{ color: '#000' }} type="close-circle" onClick={this.clearInput} />}
            />
            <Icon type='search' className={styles.search} onClick={() => this.searchBook()}/>
          </Header>
          <Spin className='loading' spinning={this.state.loading} tip="书籍搜索中...">
          <Content className={styles.content}>
            {
              this.flag ? (
                <div className={styles.tagBox}>
                  <h1>最近搜索历史</h1>
                    <div className={styles.tags}>
                      {
                        this.state.searchHistory.map((item, index) =>
                          <Tag onClick={this.wordSearch} className={styles.tag} color={this.tagColorArr[index]} key={index}>{item}</Tag>
                        )
                      }
                    </div>
                  <div className={styles.clear} onClick={this.clearHistory}><Icon type="delete" />清空搜索历史</div>
                </div>
              )
              :
              (
                this.state.bookList.length !== 0 ?
                this.state.bookList.map((item, index) => <ResultBookItem data={item} key={index}/>)
                : (<div className={styles.noResult}>没有找到搜索结果</div>)
              )
            }
          </Content>
          </Spin>
        </Layout>
      </div>
    )
  }
}

export default template(Search);
