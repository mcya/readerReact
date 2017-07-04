import React from 'react';
import { Link } from 'react-router-dom'
import {Layout, Spin, message, Icon, Modal} from 'antd';
import styles from '../styles/read.less';
import template from './template';
import 'whatwg-fetch';
import _isEmpty from '_isEmpty/lodash';
import storejs from 'store/dist/store.legacy';

const { Header, Footer } = Layout;
var _ = require('underscore')
class Read extends React.Component{
  constructor(props) {
    super(props);
    this.flag = true; //标记第一次进入， 判断是否读取上一次阅读的scrollTop
    this.pos = this.props.match.params.id; //书籍在列表的序号
    this.index = storejs.get('bookList')[this.pos].readIndex || 0; //章节号
    this.chapterList = storejs.get('bookList')[this.pos].list.chapters;
    this.readSetting = storejs.get('readSetting') || {fontSize: '12', backgroundColor: 'rgb(196, 196 ,196)'};
    this.state = {
      loading: true,
      chapter: '',
      yejianStatus: false,
      backgroundColorStatus: [],
      fontColorStatus: [],
      show: false,
      readSetting: this.readSetting,
      chapterListShow: false,
      readSettingShow: false,
      readZhangjieShow: false
    }

    this.getChapter = (index) => {
      if (index < 0) {
        message.info('已经是第一章了！');
        this.index = 0;
        return;
      }
      else if(index >= this.chapterList.length) {
        message.info('已经是最新的一章了！');
        this.index = this.chapterList.length - 1;
        return;
      }
      this.setState({loading: true});
      fetch(`/chapter/${encodeURIComponent(this.chapterList[index].link)}?k=2124b73d7e2e1945&t=1468223717`)
      .then(res => res.json())
      .then( data => {
        if (!data.ok) {
          message.info('章节内容丢失！');
          return this.setState({loading: false});
        }
        let bookList = storejs.get('bookList');
        bookList[this.pos].readIndex = index;
        storejs.set('bookList', bookList);
        let content = _.has(data.chapter, 'cpContent') ?  data.chapter.cpContent :  data.chapter.body;
        data.chapter.cpContent =  '   ' + content.replace(/\n/g, "\n   ");
        this.setState({loading: false, chapter: data.chapter})
      })
      .catch(error => message.info(error))
    }

    this.nextChapter = (e) => {
      e.stopPropagation();
      this.getChapter(++this.index);
    }
    this.preChapter = (e) => {
      e.stopPropagation();
      this.getChapter(--this.index);
    }

    this.targetChapter = (e) => {
      e.stopPropagation();
      this.index = e.target.id
      this.getChapter(this.index);
      this.setState({chapterListShow: false});
    }

    this.shwoSetting = () => {
      this.setState({show: !this.state.show});
    }
    // 字体
    this.fontUp = () => {
      this.readSetting.fontSize++
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }
    this.fontDown = () => {
      if (this.readSetting.fontSize <=12) {
        return;
      }
      this.readSetting.fontSize--
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }
    // 肤色
    this.changeBackgroudnColor = (e) => {
      console.log('e.target.style.backgroundColor', e.target.style.backgroundColor);
      this.readSetting.backgroundColor = e.target.style.backgroundColor;
      if (e.target.style.backgroundColor == '#000000' || e.target.style.backgroundColor == 'rgb(0, 0, 0)') {
        this.readSetting.color = '#fff'
      } else {
        this.readSetting.color = '#000'
      }

      this.setState({
        readSetting: this.readSetting,
        backgroundColorStatus: e.target.style.backgroundColor,
        fontColorStatus: this.readSetting.color
      });
      storejs.set('readSetting', this.readSetting);
    }
    this.yejianmoshi = () => {
      // 日变夜间
      // 第一次进入的时候肯定是false
      console.log('this.state.yejianStatus', this.state.yejianStatus);
      if (this.state.yejianStatus === true) {
        this.readSetting.backgroundColor = _isEmpty(this.state.backgroundColorStatus) ? "#BEECBD" : this.state.backgroundColorStatus;
        this.readSetting.color = _isEmpty(this.state.backgroundColorStatus) ? "#BEECBD" : this.state.fontColorStatus;
        this.setState({
          readSetting: this.readSetting,
          readSettingShow: false,
          yejianStatus: false
        });
        storejs.set('readSetting', this.readSetting);
      } else {
        // 夜间模式转换到日间模式
        this.readSetting.color = '#95938E'
        this.readSetting.backgroundColor = '#363230';
        this.setState({
          readSetting: this.readSetting,
          readSettingShow: false,
          yejianStatus: true
        });
        storejs.set('readSetting', this.readSetting);
      }
    }

    this.readScroll = () => {
      let bookList = storejs.get('bookList');
      bookList[this.pos].readScroll = this.refs.box.scrollTop;
      storejs.set('bookList', bookList);
    }

    this.showChapterList = (chapterListShow) => {
      this.setState({ chapterListShow });
    }



    this.readSettingShowControl = (e) => {
      e.stopPropagation();
      let value = !this.state.readSettingShow;
      this.setState({readSettingShow: value, readZhangjieShow: false});
    }

    this.readZhangjieShowControl = (e) => {
      e.stopPropagation();
      let value = !this.state.readZhangjieShow;
      this.setState({readZhangjieShow: value, readSettingShow: false});
    }
  }


  componentWillMount() {
    this.getChapter(this.index);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.flag) { //加载上次阅读进度
      let bookList = storejs.get('bookList');
      this.refs.box.scrollTop = _.has(bookList[this.pos], 'readScroll') ? bookList[this.pos].readScroll : 0;
      this.flag = false;
    }
    else if(prevState.loading !== this.state.loading){
      this.refs.box.scrollTop = 0;
    }
    let list =  document.querySelector('.chapterList .ant-modal-body');
    if (list !== null) {
      list.scrollTop = 45 * (this.index - 3);
    }
  }


  render() {
    console.log('阅读页this', this);
    console.log('阅读页this.pos', this.pos);
    console.log('阅读页this.index', this.index);
    console.log('阅读页this.chapterList', this.chapterList);
    console.log('阅读页this.readSetting', this.readSetting);
    const dangqianzhangjie = Number(this.index) + 1
    const zongdezhangjie = this.chapterList.length;
    const inputLenght = (Number(document.body.offsetWidth) / 64) * 7
    const inputHi = Number(document.body.offsetWidth) / 64
    const dangqiangleft = Number(document.body.offsetWidth) / 2 - (Number(document.body.offsetWidth) / 64) * 6
    console.log('dangqiangleft', dangqiangleft);
    // console.log('书籍内容--this.state.chapter--', this.state.chapter)
    return (
      <Spin className='loading' spinning={this.state.loading} tip="章节内容加载中">
        <Layout >
          <Modal
            className="chapterList"
            title="Vertically centered modal dialog"
            visible={this.state.chapterListShow}
            onOk={() => this.showChapterList(false)}
            onCancel={() => this.showChapterList(false)}
          >
            {
              this.chapterList.map((item,index) => (<p
                id={index}
                className={parseInt(this.index, 10) == index ?  'choosed' : ''}
                onClick={this.targetChapter}
                key={index}>{item.title}</p>))
            }
          </Modal>
          {
            this.state.show ? (() => {
              return (
                <Header className={styles.header}>
                  <Link to="/"><Icon type="left" className={styles.pre}/></Link>
                  <Link to={`/changeOrigin/${this.pos}`}>
                    <span className={styles.origin}><Icon type="ellipsis" /></span>
                    </Link>
                </Header>
              )
            })() : ''
          }
          <div
            ref='box'
            className={styles.box}
            style={this.state.readSetting}
            onClick={this.shwoSetting}
            onScroll={this.readScroll}>
          {this.state.loading ? '' : (()=>{
            return (
              <div>
                <h1>{this.state.chapter.title}</h1>
                <br />
                <pre>{this.state.chapter.cpContent}</pre>
                <h1 className={styles.control}>
                  <span onClick={this.preChapter}>上一章</span>
                  <span onClick={this.nextChapter}>下一章</span>
                </h1>
              </div>
            )
          })()}
          </div>
          {
            this.state.show ?  (() => {
              return (
                <Footer className={styles.footer}>

                  <div onClick={() => this.showChapterList(true)}>
                    <Icon type="bars" style={{ border: '1px solid #000'}} />
                    <br/>目录
                  </div>

                  <div
                    className={styles.zhangjie}
                    tabIndex="100"
                    onClick={this.readZhangjieShowControl}
                    onBlur={this.readZhangjieShowControl}>
                    <Icon type="switcher" />
                      {
                        this.state.readZhangjieShow ?
                        (
                          <div onClick={(e) => e.stopPropagation()} style={{ borderBottom: '2px solid #E6E6E6'}}>
                            <div>
                              <h1 className={styles.zhangjieDj}>
                                <span onClick={this.preChapter}>上一章</span>
                                <span style={{ left: dangqiangleft}}>
                                  {dangqianzhangjie}/{zongdezhangjie}
                                  {/* <Icon type="edit" />
                                  <br/>
                                  <input style={{ width: inputLenght, height: inputHi }} /> */}
                                </span>
                                <span onClick={this.nextChapter}>下一章</span>
                              </h1>
                            </div>
                          </div>
                        ) : ''
                      }
                    <br/>章节
                  </div>
                  <div
                    className={styles.setting}
                    tabIndex="100"
                    onClick={this.readSettingShowControl}
                    onBlur={this.readSettingShowControl}>
                    <Icon type="skin" /><br/>Aa
                    {
                      this.state.readSettingShow ?
                      (
                        <div onClick={(e) => e.stopPropagation()} style={{ borderBottom: '2px solid #E6E6E6'}}>
                          <div className={styles.font}>
                            <span onClick={this.fontDown}>Aa -</span>
                            <span style={{ display: 'inline-block',borderRadius: '100%', padding: '0 5px 2px', border: '1px solid #000'}}>{this.readSetting.fontSize}</span>
                            <span onClick={this.fontUp}>Aa +</span>
                          </div>
                          <div className={styles.color}>
                            <i onClick={this.changeBackgroudnColor} style={{backgroundColor: '#BEECBD'}}></i>
                            {/* <i onClick={this.changeBackgroudnColor} style={{backgroundColor: '#EBF5FF'}}></i> */}
                            <i onClick={this.changeBackgroudnColor} style={{backgroundColor: '#E6BECC'}}></i>
                            <i onClick={this.changeBackgroudnColor} style={{backgroundColor: '#FFF2D9'}}></i>
                            <i onClick={this.changeBackgroudnColor} style={{backgroundColor: '#EBEBEB'}}></i>
                            <i onClick={this.changeBackgroudnColor} style={{backgroundColor: 'rgb(196, 196 ,196)'}}></i>
                            <i onClick={this.changeBackgroudnColor} style={{backgroundColor: '#000000'}}></i>
                          </div>
                        </div>
                      ) : ''
                    }
                  </div>
                  { this.state.yejianStatus
                    ?
                    <div onClick={() => this.yejianmoshi()}>
                      <Icon type="bulb" />
                      <br/>日间
                    </div>
                    :
                    <div onClick={() => this.yejianmoshi()}>
                      <Icon type="eye" />
                      <br/>夜间
                    </div>
                  }

                </Footer>
              )
            })() : ''
          }

        </Layout>
      </Spin>
    )
  }
}

export default template(Read);
