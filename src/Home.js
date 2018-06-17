import React, { Component } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Home.css';
var data = require('./example.json');

const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.


class Home extends Component {
	constructor (props) {
		super(props)
	    this.state = {
			companyCode: '',
			startDate: null,
			upper: '',
			lower: '',
			//code_valid: true,
			//date_valid: true,
			//upper_valid: true,
			//lower_valid: true


	    }
		this.handleDateChange = this.handleDateChange.bind(this);
	}

  	handleExSearch (e) {
    	this.setState({ stockEx: e.target.value });
  	}
  	handleComSearch (e) {
	  	this.setState({ companyCode: e.target.value});
  	}
  	handleDateChange(date) {
	  	this.setState({
			startDate: date
	  	});
	  	// might not send the date pressed, but the previously pressed date.
  	}
	handleUpSearch (e) {
		this.setState({ upper: e.target.value});
	}
	handleLowSearch (e) {
		this.setState({ lower: e.target.value});
	}

	handleGoClick () {
		var code_valid1 = true;
		var date_valid1 = true;
		var upper_valid1 = true;
		var lower_valid1 = true;

		var dateStr = "";
		if (this.state.startDate != null) {
			dateStr = this.state.startDate._d.getFullYear().toString()
						+this.addZero(this.state.startDate._d.getMonth()+1)
						+this.addZero(this.state.startDate._d.getDate());
		}
		if (! this.state.companyCode.match(/^[A-Za-z.]+$/)) {
			//this.setState({ code_valid: false })
			code_valid1 = false;
			this.unhide("code_error");
		}
		if (! dateStr.match(/^[0-3][0-9][01][0-9][0-9]{4}$/)) {
			//this.setState({ date_valid: false })
			date_valid1 = false;
			this.unhide("date_error");
		}
		if (! this.state.upper.match(/^[0-9]+$/)) {
			//this.setState({ upper_valid: false })
			upper_valid1 = false;
			this.unhide("upper_error");
		}
		if (! this.state.lower.match(/^[0-9]+$/)) {
			//this.setState({ lower_valid: false })
			lower_valid1 = false;
			this.unhide("lower_error");
		}
		if (code_valid1 && date_valid1 && upper_valid1 && lower_valid1) {
			this.hide("code_error");this.hide("date_error");this.hide("upper_error");this.hide("lower_error");
			this.getData();
		}
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
	getCompanyPrice(companyData){
        var companyPrice = [];
        for (var key in companyData){
            companyPrice.push(companyData[key].Data);
        }
        return companyPrice;
    }

    getCompanyDailyPrice(companyPrice){
        var companyDailyPrice = [];
        for(var key in companyPrice){
            companyDailyPrice.push(companyPrice[key].Return);
        }
    }

    getCompanyName(companyData){
        var companyName = [];
        for (var key in companyData){
            companyName.push(companyData[key].instrumentID);
        }
        return companyName;
    }

    getData() {
    	var url = "";
    	var retDates = [];
    	var retValues = [];
    	var companyCode = "";
    	let chart = this.refs.chart.getChart();
    	if (this.state.companyCode !== "") {
    		companyCode = this.state.companyCode;
    		url = "https://cors.io/?http://167.99.73.105:8000/stock?symbol=".concat(this.state.companyCode);
    	}
    	// need to fix when companyCode is empty
    	if (this.state.startDate !== null) {
    		var dateStr = this.state.startDate._d.getFullYear().toString()
						+this.addZero(this.state.startDate._d.getMonth()+1)
						+this.addZero(this.state.startDate._d.getDate());
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

    	if (url !== ""&& this.state !== null && this.state.companyCode !== "" && this.state.startDate !== null) {
			axios.get(url)
			  .then(function (response) {
			    //var body = JSON.parse(response);
			    var body = response.data['CompanyReturns'][0]['Data'];
			    var body = response.data['CompanyReturns'][0]['Data'];
			    if (body && body.length > 0) {
			    	for (var d = body.length-1; d >= 0 ; d--) {
			    		retValues.push(parseFloat(body[d]['Return(%)']));
			    		retDates.push(body[d]['Date']);
			    	}

			    	console.log(retValues);
					chart.xAxis[0].update({
						categories: retDates
					});
					chart.series[0].update({
						name: companyCode,
						data: retValues
					});
			    }
			});
    	}
		// justin's part.
		/*
		console.log(retDates);
		chart.xAxis[0].update({
				categories: retDates[0]
		});
		chart.series[0].update({
			name: companyCode,
			data: retValues[0]
		});
		*/

			// end of justin's part.
    return retValues;
    }

    createConfig(companyName, companyPrice){
        var series = [];
        for (var index in companyName){
            series.push({name: companyName[index], data: companyPrice[index]});
        }
        return series;
    }


  	render () {


	      const config = {
	        xAxis: {
	          categories: []
	        },
	        series: [{
	          //data need to be supplied here where name should be Company ID and data should be actually CV values.
	          data: []
	        }]

	      };
    	return (
      		<div className='searchbar-container'>
        		<form onSubmit={e => e.preventDefault()} encType="multipart/form-data">
				<br/><label>Company Code</label><br/>
				<input
				  	type='text'
				  	size='45'
				  	placeholder='Enter Company Code'
				  	onChange={this.handleComSearch.bind(this)}
				  	value={this.state.companyCode} />
				<br />
				<div id="code_error" className="error_hide">Input valid Company Code</div>
				<br /><label>Date</label><br/>
				<DatePicker
					dateFormat="DD-MM-YYYY"
					selected={this.state.startDate}
					onChange={this.handleDateChange.bind(this)}
					placeholderText="Click to select a date"
					//filterDate={this.isPreviousDay}
				/>
				<div id="date_error" className="error_hide">Input valid Date</div>
				<br /><label>Upper Range</label><br/>
				<input
			  		type='text'
			  		size='45'
			  		placeholder='Enter Upper Range'
			  		onChange={this.handleUpSearch.bind(this)}
			  		value={this.state.Upper} />
				<br />
				<div id="upper_error" className="error_hide">Input valid Upper Range</div>

				<br /><label>Lower Range</label><br/>
				<input
			  		type='text'
			  		size='45'
			  		placeholder='Enter Lower Range'
			  		onChange={this.handleLowSearch.bind(this)}
			  		value={this.state.Lower} />
				<br />
				<div id="lower_error" className="error_hide">Input valid Lower Range</div>
				<br />
				<button
					type='submit'
					onClick={this.handleGoClick.bind(this)}>
				Search
				</button>
				<ReactHighcharts config={config} ref="chart"></ReactHighcharts>
	      	</form>
      	</div>
    	)
    }
}

export default Home;
