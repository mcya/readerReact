import React from 'react';
import styles from '../styles/bookItem.less';
import Tappable from 'react-tappable/lib/Tappable';
import { Modal, BackTop } from 'antd';

const confirm = Modal.confirm;

let errorLoading = require('../images/error.jpg')

class BookItem extends React.Component{
  constructor(props) {
    super(props);
    this.showConfirm = () => {
    confirm({
      title: '删除本书',
      content: `确认删除本书《${this.props.data.title}》吗？` ,
      onOk: () => {
        this.props.deleteBook(this.props.data);
      },
      onCancel() {}
    });
  }
  }

  handleImageErrored(e) {
    e.target.src = errorLoading;
  }

  render() {
    console.log('首页书籍列表this.props.data', this.props.data)
  console.log('首页书籍列表this.props', this.props)
  // console.log('document.body.scrollWidth', document.body.scrollWidth)
  // console.log('document.body.offsetWidth', document.body.offsetWidth)

  let jiuValue;
  let lieValue
  if (this.props.moshi === true) {
    jiuValue = 'block'
    lieValue = 'none'
  } else {
    jiuValue = 'none'
    lieValue = 'block'
  }

  const geziWidth = (document.body.offsetWidth / 3)-23
  const geziHeight = geziWidth * 1.5
  const jianjuzhi = (document.body.offsetWidth - (geziWidth * 3))/2
  console.log('(document.body.offsetWidth - (geziWidth * 3))/2', (document.body.offsetWidth - (geziWidth * 3))/2)
    return (
      <Tappable
        onPress ={this.showConfirm}
      >

        <div style={{ display: lieValue }} className={styles.box}>
          <img src={this.props.data.cover} onError={this.handleImageErrored} />
          <p>
            <span>{this.props.data.title}</span><br/>
            <span style={{ color: '#888484' }}>连载至：{this.props.data.lastChapter}</span>
          </p>
        </div>

        <div style={{ display: jiuValue, float: 'left', padding: '10px', boxShadow: '4px 3px 10px 0px #d5d6d8' }}>
          <div>
            <img width={geziWidth} height={geziHeight} src={this.props.data.cover} onError={this.handleImageErrored} />
            <p style={{ color: '#000', fontSize: '1rem' }}><span>{this.props.data.title}</span></p>
          </div>
        </div>
      </Tappable>
    )
  }
}

export default BookItem;
