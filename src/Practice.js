import React, { Component } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


class Practice extends Component {
	constructor (props) {
		super(props)
	    this.state = {
			companyCode: '',
			startDate: null,
			endDate: null,
			legitStart: null,
			legitEnd: null,
			upper: '10',
			lower: '0',
			credit: '',
			legitCredit: '',
			volume: 0,
			loading: false,
			data: [],
			table: {
				data:[],
			  	columns: [{
				  	Header: 'Company Code',
				  	accessor: 'code' // String-based value accessors!
				}, {
				  	Header: 'Credit',
				  	accessor: 'credit',
				  	Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
				}, {
				  	id: 'retPercent', // Required because our accessor is not a string
				  	Header: 'Return percentage',
				  	accessor: d => d.ret.percent // Custom value accessors!
				}, {
				  	Header: props => <span>Net Return</span>, // Custom header components!
				  	accessor: 'ret.return'
			  }]
			}
	    }
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
	}
/*
  	handleExSearch (e) {
    	this.setState({ stockEx: e.target.value });
  	}
*/
	handleCreditSearch (e) {
		this.setState({ credit: e.target.value});
	}

  	handleComSearch (e) {
	  	this.setState({ companyCode: e.target.value});
  	}
  	handleDateChange(date) {
	  	this.setState({
			startDate: date
	  	});
		console.log(this.state.startDate);
	  	// might not send the date pressed, but the previously pressed date.
  	}
	handleEndDateChange(date) {
	  	this.setState({
			endDate: date
	  	});
		console.log(this.state.endDate);
	  	// might not send the date pressed, but the previously pressed date.
  	}


	handleSliderChange(e) {
		var credit = parseFloat(this.state.legitCredit);
		var totRet = 0;
		for (var i = 0; i < this.state.data.length; i++) {
			for (var j = 0; j < e; j ++) {
				totRet += parseFloat(this.state.data[i][j]['Return(%)']);
			}
			var number = (totRet * 0.01 + 1) * credit;
			var parString = totRet.toString() + '%';
			this.tableChange(i, parString, number.toFixed(2));
			//change the table date.
		}

		/*var newBody = this.state.data;
		newBody.push(body);
		this.setState({data: newBody});
		var totRet = 0; // in percentage.
		for (var i = 0; i < body.length; i ++) {
			totRet += parseFloat(body[i]['Return(%)']);
		}
		//var num_inc = (cumRet * 0.001) * credit;
		var number = (totRet * 0.01 + 1) * credit;
		var parString = totRet.toString() + '%';
		//go through the data make changes*/
	}

	tableChange (row, percent, net) {
		let table = this.state.table;
		console.log(table)
		table.data[row].ret["percent"] = percent;
		table.data[row].ret["return"] = net;

		// remove all data from table and add it back after it is done.
		this.setState({
		  table: {
			data: [],
			columns: table.columns
		  }
	  }, () => this.setState({ table }));
	}

	handleGoSetClick () {
		var credit_valid = true;
		var date_valid1 = true;
		var endDate_valid = true;
		if (! this.state.credit.match(/^[1-9][0-9]*$/)) {
			credit_valid = false;
			this.unhide("credit_error");
		}
		var dateStr = "";
		if (this.state.startDate != null) {
			dateStr = this.state.startDate._d.getFullYear().toString()
						+this.addZero(this.state.startDate._d.getMonth()+1)
						+this.addZero(this.state.startDate._d.getDate());
		}
		var endDateStr = "";
		if (this.state.endDate != null && this.state.endDate._d.getTime() > this.state.startDate._d.getTime()) {
			endDateStr = this.state.endDate._d.getFullYear().toString()
						+this.addZero(this.state.endDate._d.getMonth()+1)
						+this.addZero(this.state.endDate._d.getDate());
		}
		if (! dateStr.match(/^[0-3][0-9][01][0-9][0-9]{4}$/)) {
			//console.log(dateStr);
			date_valid1 = false;
			this.unhide("date_error2");
		}
		if (! endDateStr.match(/^[0-3][0-9][01][0-9][0-9]{4}$/)) {
			endDate_valid = false;
			this.unhide("endDate_error");
		}
		if (date_valid1 && endDate_valid && credit_valid) {
			let table = this.state.table;
			this.hide("date_error2");
			this.hide("endDate_error");
			this.hide("credit_error");
			this.setState({
				legitStart: this.state.startDate,
				legitEnd: this.state.endDate,
				legitCredit: this.state.credit
			})
			this.setState({
			  table: {
				data: [],
				columns: table.columns
			  }
		  });
		}
	}

	handleGoClick () {
		var code_valid1 = true;
		var credit_valid = true;
		var date_valid1 = true;
		var endDate_valid = true;

		if (! this.state.credit.match(/^[1-9][0-9]*$/)) {
			credit_valid = false;
			this.unhide("credit_error");
		}
		var dateStr = "";
		if (this.state.legitStart != null) {
			dateStr = this.state.legitStart._d.getFullYear().toString()
						+this.addZero(this.state.legitStart._d.getMonth()+1)
						+this.addZero(this.state.legitStart._d.getDate());
		}
		var endDateStr = "";
		if (this.state.legitEnd != null && this.state.legitEnd._d.getTime() > this.state.legitStart._d.getTime()) {
			endDateStr = this.state.legitEnd._d.getFullYear().toString()
						+this.addZero(this.state.legitEnd._d.getMonth()+1)
						+this.addZero(this.state.legitEnd._d.getDate());
		}

		if (! this.state.companyCode.match(/^[A-Za-z]+$/)) {

			code_valid1 = false;
			this.unhide("code_error");
		}
		if (! dateStr.match(/^[0-3][0-9][01][0-9][0-9]{4}$/)) {
			//console.log(dateStr);
			date_valid1 = false;
			this.unhide("date_error2");
		}
		if (! endDateStr.match(/^[0-3][0-9][01][0-9][0-9]{4}$/)) {
			endDate_valid = false;
			this.unhide("endDate_error");
		}

		if (code_valid1 && date_valid1 && endDate_valid && credit_valid) {
			this.hide("code_error");
			this.hide("date_error2");
			this.hide("endDate_error");
			this.hide("credit_error");

			var timeDiff = Math.abs(this.state.legitEnd._d.getTime() - this.state.legitStart._d.getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			console.log(diffDays);
			var diffStr = diffDays.toString();
			this.setState({upper: diffStr}, function () {
				this.getData();
			});

		}
	}
	// change the error messages.

	getData() {
		var url = "";
		var companyCode = "";
		//var retTable = this.ref.retTable.getProps('data');

		if (this.state.companyCode !== "") {
    		companyCode = this.state.companyCode;
    		url = "https://cors.io/?http://167.99.73.105:8000/stock?symbol=".concat(this.state.companyCode);
    	}
		if (this.state.legitStart !== null) {
    		var dateStr = this.state.legitStart._d.getFullYear().toString()
						+this.addZero(this.state.legitStart._d.getMonth()+1)
						+this.addZero(this.state.legitStart._d.getDate());
			var urlDatePart = "&date=".concat(dateStr);
			url = url.concat(urlDatePart);
    	}
    	if (this.state.upper !== "") {
    		var urlUpperPart = "&upper=".concat(this.state.upper);
    		url = url.concat(urlUpperPart);
    	}
    	if (this.state.lower !== "") {
    		var urlLowerPart = "&lower=".concat(this.state.lower);
    		url = url.concat(urlLowerPart);
    	}
		var credit = parseFloat(this.state.legitCredit);
		axios.get(url)
		  .then((response) => {
			  var body = response.data['CompanyReturns'][0]['Data'];
			  var newBody = this.state.data;
			  newBody.push(body);
			  this.setState({data: newBody});
			  var totRet = 0; // in percentage.
			  for (var i = 0; i < body.length; i ++) {
				  totRet += parseFloat(body[i]['Return(%)']);
			  }

			  //var num_inc = (cumRet * 0.001) * credit;
			  var number = (totRet * 0.01 + 1) * credit;
			  var parString = totRet.toString() + '%';
			  this.addToTable(companyCode, credit, parString, number.toFixed(2));
			  console.log(this.state.data);

			  //document.getElementById("prac").innerHTML = "Profit: " + (number).toFixed(2).toString() + ", Percentage Change: " + totRet + "%";
		}).catch( ( err ) => {console.log("ERRRORRR")} );
  }


	addToTable(code, credit, percent, num) {
		let table = this.state.table;
		table.data.push({
			code: code,
			credit: credit,
			ret: {
				percent: percent,
				return: num,
		}});

		// remove all data from table and add it back after it is done.
		this.setState({
		  table: {
			data: [],
			columns: table.columns
		  }
		 }, () => this.setState({ table }));
	}

	addZero(num) {
		let str = num.toString();
		if (num < 10) {
			str = "0" + str;
		}
		return str;
	}

	unhide(name) {
	    var item = document.getElementById(name);
	    if (item) {
	      //item.className=(item.className==='error_hide')?'error_appear':'error_hide';
		  if (item.className === 'error_hide') {
			  item.className = 'error_appear';
		  }
	    }
	}
	hide(name) {
		var item = document.getElementById(name);
	    if (item) {
			if (item.className==='error_appear') {
				item.className = 'error_hide';
			}
	    }
	}
  	render () {
    	return (
      		<div className='searchbar-container'>
        		<form onSubmit={e => e.preventDefault()} encType="multipart/form-data">
				<br /><label>Credit</label><br/>
				<input
			  		type='text'
			  		size='45'
			  		placeholder='Enter Credit'
			  		onChange={this.handleCreditSearch.bind(this)}
			  		value={this.state.Credit} />
				<div id="credit_error" className="error_hide">Input valid Credit amount</div>
				<br /><label>Start Date</label>
				<br/>
				<DatePicker
					dateFormat="DD-MM-YYYY"
					selected={this.state.startDate}
					onChange={this.handleDateChange.bind(this)}
					placeholderText="Click to select a date"
					showMonthDropdown
    				showYearDropdown
    				dropdownMode="select"
					selectsStart
					startDate={this.state.startDate}
    				endDate={this.state.endDate}
				/>
				<div id="date_error2" className="error_hide">Input valid Date</div>
				<br /><label>End Date</label><br/>
				<DatePicker
					dateFormat="DD-MM-YYYY"
					selected={this.state.endDate}
					onChange={this.handleEndDateChange.bind(this)}
					placeholderText="Click to select a date"
					showMonthDropdown
    				showYearDropdown
    				dropdownMode="select"
					selectsEnd
					startDate={this.state.startDate}
    				endDate={this.state.endDate}
				/>
				<div id="endDate_error" className="error_hide">Input valid Date</div>
				<button
					type='submit'
					onClick={this.handleGoSetClick.bind(this)}>
				Set
				</button>
				<br/>
				<br/><label>Company Code</label><br/>
				<input
				  	type='text'
				  	size='45'
				  	placeholder='Enter Company Code'
				  	onChange={this.handleComSearch.bind(this)}
				  	value={this.state.companyCode} />
				<br />
				<div id="code_error" className="error_hide">Input valid Company Code</div>
				<button
					type='submit'
					onClick={this.handleGoClick.bind(this)}>
				Add
				</button>
				<br />
				<br />
				<ReactTable
  				showPagination={false}
  				defaultPageSize={10}
				  className="-highlight"
				  data={this.state.table.data}
				  columns={this.state.table.columns}
				  loading={this.state.loading}
				  minRows={5}
				/>
				<br />
				<label>Slide to Vary End Date</label>
				<Slider
					defaultValue={100}
					step={1}
					max={parseInt(this.state.upper, 10) + 1}
					onChange={this.handleSliderChange.bind(this)}

				/>
	      	</form>
      	</div>
    	)
    }
}

export default Practice;

// https://www.npmjs.com/package/react-rangeslider
