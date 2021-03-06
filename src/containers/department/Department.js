
import React, { Component, PropTypes  } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { SegmentedControl, WingBlank ,  Picker, List, WhiteSpace } from 'antd-mobile';
import Header from '../../components/common/header/Header.js'

import NormalCardBox from '../../components/department/normalCardBox/NormalCardBox.js'
import ContrastCardBox from '../../components/department/contrastCardBox/ContrastCardBox.js'
import URLS from '../../constants/URLS';
import Constants from '../../constants/department';
import global from '../../common/global';
import util from '../../common/util';
class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeType:"month",
      isEasyType:true,
      selectedIndex:0,
      quota:[1],
      value: null,
      chooseData:[
          {
            label: '收益额',
            value: 1,
          },
          {
            label: '收益额完成率',
            value: 2,
          },
      ],
      queryParams:{
        dateType:1,
        nowDate:"",
      }
    }
    this.onTimeChange = this.onTimeChange.bind(this);
    this.queryData = this.queryData.bind(this);
    this.handleQuotaChange = this.handleQuotaChange.bind(this);
    this.onShowTypeChange = this.onShowTypeChange.bind(this);
  }

  componentDidMount(){
    //获取时间参数并发出请求
    const nowDate = global.nowDate();
    const code = util.getURLParams().code || '';
    const state = util.getURLParams().state || '';
    this.setState({
      queryParams:Object.assign(this.state.queryParams,{nowDate,code,state})
    },function(){
      this.queryData();
    });

  }
  queryData(){
    const { dispatch } = this.props;
    dispatch({ type: Constants.BUSINESS_DEPART_REPORT_REQUESTED,queryParams:this.state.queryParams});
  }
  handleQuotaChange(val){
    this.setState({
      quota:val
    });

  }
  onTimeChange(value){
    //时间变化函数  (1 月 , 2 周);
    let timeType = value==1 ? "month" : "week";
    this.setState({
        queryParams:Object.assign(this.state.queryParams,{dateType:value}),
        selectedIndex:value-1,
        timeType:timeType,
        quota:[1]
    },function(){
      this.queryData();
    });
  }
  onShowTypeChange(isEasyType){
    //指标变化函数
    this.setState({
      isEasyType:isEasyType
    });
  }
  render() {
    const  {departmentData} = this.props;
    let carBox = '';
    if(this.state.isEasyType){
      carBox = <NormalCardBox
                  departmentData={departmentData}
                  handleQuotaChange={this.handleQuotaChange}
                  quota={this.state.quota}
                  timeType={this.state.timeType}
                />
    }else{
      //重装数组 添加是否被选中
      let dataList = departmentData.businessDepartList.concat();
      dataList.map((item)=>{
        item.chooseFlag = false;
      });
      carBox = <ContrastCardBox
                  dataList={dataList}
                  quotaType={this.state.quota[0]}
                />
    }
    return (
      <div style={{paddingBottom:100}}>
        <Header
          onTimeChange={this.onTimeChange}
          selectedIndex={this.state.selectedIndex}
          onShowTypeChange={this.onShowTypeChange}
          showImgFlag={true}
          quotaType={this.state.quota[0]}
        />
      {carBox}
      </div>
    );
  }
}

const getDepartment = (state) => {
  return state.department;
}
const selectors = createSelector(
  [getDepartment],
  (department) => {
    return {...department};
  }
)

export default connect(selectors)(Department);
