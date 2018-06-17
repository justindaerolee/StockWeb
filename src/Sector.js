import React, { Component } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Home.css';
var data = require('./example.json');

const today = new Date();
const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.

const Industrials = {codes:['ARCB','YRCW','KSC'], names:['ArcBest Corp','YRC Worldwide Inc','Jazeera Airways']};
const Health_Care = {codes:['AAC','BKD','CSU'], names:['AAC Holdings Inc','Brookdale Senior Living Inc','Capital Senior Living Corp']};
const Materials = {codes:['SXC','TG','MERC'], names:['SunCoke Energy Inc','Tredegar Corp','Mercer Intl Inc']};
const Real_Estate = {codes:['ARCB','YRCW','JAZK'], names:['ArcBest Corp','YRC Worldwide Inc','Jazeera Airways']};
const Telecommunication_Services = {codes:['ALSK','T','ATNI'], names:['Alaska Communications Systems Group Inc','AT&T','ATN International Inc']};
const Consumer_Discretionary = {codes:['ASNA','APRN','TCS'], names:['Ascena Retail Group Inc','Blue Apron Holdings','Container Store Group Inc']};
const Utilities = {codes:['GNE','EE','SJW'], names:['Genie Energy Ltd','El Paso Electric Co','SJW Group']};
const Information_Technology = {codes:['XOXO','P','TTD'], names:['XO Group Inc','Pandora Media Inc','Trade Desk Inc']};
const Consumer_Staples = {codes:['NGVC','CHEF','WMK'], names:['Natural Grocers by Vitamin Cottage Inc','Chefs Warehouse Inc','Weis Markets Inc']};
const Energy = {codes:['EPE','PES','CLNE'], names:['EP Energy Corp','Pioneer Energy Services Corp','Clean Energy Fuels Corp']};
const Financials = {codes:['BAC','BMO','BNS'], names:['Bank of America','Bank of Montreal','Bank of Nova Scotia']};

const allSectors = {Telecommunication_Services:Telecommunication_Services, Health_Care:Health_Care, Financials:Financials, Consumer_Discretionary:Consumer_Discretionary, Consumer_Staples:Consumer_Staples, Energy:Energy, Industrials:Industrials, Information_Technology:Information_Technology, Materials:Materials, Real_Estate:Real_Estate, Utilities:Utilities};
const alphaKey = 'PGGPOZTWY4TIMSYY';


class Sector extends Component {
	constructor (props) {
		super(props)
	    this.state = {
	      sectors: []
	    }
		this.handleDateChange = this.handleDateChange.bind(this);
	}

  	handleComSearch (e) {
	  	this.setState({ currencyCode: e.target.value});
  	}
    handleUsdChange (e) {
      this.setState({ usdValue: e.target.value });
    }
  	handleDateChange(date) {
	  	this.setState({
			startDate: date
	  	});
	  	// might not send the date pressed, but the previously pressed date.
  	}

	handleGoClick () {
    this.getSectorData();
	}

	func_Telecommunication_Services() {
		for (var c=0; c < allSectors['Telecommunication_Services']['codes'].length; c++) {
			var retHtml = '';
			var code =  allSectors['Telecommunication_Services']['codes'][c];
			var name = allSectors['Telecommunication_Services']['names'][c];
			var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+code+'&apikey='+alphaKey;
			axios.get(url).then(function (response) {
					var body = response.data['Time Series (Daily)'];
					for (var b in body) {
						var price = body[b]['1. open'];
						var ret = body[b]['4. close'] - body[b]['1. open'];
						ret = (ret/body[b]['1. open'])*100;
						//ret = ret.replace(/(-*.*\.[0-9]{4})(.*)/,"$1");

						retHtml = '<td>'+code+'</td>' + '<td>'+name+'</td>' + '<td>'+price+'</td>'+ '<td>'+ret+'</td>';
						var row = 'row'+'c';
						document.getElementById(row).innerHTML = retHtml;
						break;
						//return retHtml;
					}
				})
		}
	}

	getSectorData() {
			let chart1 = this.refs.chart1.getChart();
			var sectorName = [];
			var sectorVal = [];
			var sectors = [];
			var url = 'https://www.alphavantage.co/query?function=SECTOR&apikey='+alphaKey;
			axios.get(url)
				.then(function (response) {
					var body = response.data['Rank A: Real-Time Performance'];
					for (var key in body) {
						sectorName.push(key);
						var val = body[key].replace(/-/,'');
						val = val.replace(/%/,'');
						sectorVal.push(parseFloat(val));
					}

					for(var i=0; i < sectorName.length; i++) {
			    	sectors.push({
			            name: sectorName[i],
			            y: sectorVal[i]
			        });
			    }

					chart1.series[0].update({
						data: sectors
					});

					return sectors;
			})
	}



  	render () {
			const config1 = {
			chart: {
				type: 'pie'
			},
			title: {
				text: ''
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					point: {
                    events: {
                        click: clickEvent
                    }
                },
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					}
				}
			},
			series: [{
				name: 'Sectors',
				colorByPoint: true,
				//data array each to contian name and value
				data: []
			}]
			};

			function getSectorData() {
					let chart1 = this.refs.chart1.getChart();
					var sectorName = [];
					var sectorVal = [];
					var sectors = [];
					var url = 'https://www.alphavantage.co/query?function=SECTOR&apikey='+alphaKey;
					axios.get(url)
						.then(function (response) {
							var body = response.data['Rank A: Real-Time Performance'];
							for (var key in body) {
								sectorName.push(key);
								var val = body[key].replace(/-/,'');
								val = val.replace(/%/,'');
								sectorVal.push(parseFloat(val));
							}

							for(var i=0; i < sectorName.length; i++) {
								sectors.push({
											name: sectorName[i],
											y: sectorVal[i]
									});
							}
							console.log(sectors);
							return sectors;
					})

			}

			function clickEvent(e) {
				var sec = e.point.name;
					document.getElementById("click-sector").innerHTML = 'Major '+sec+' Companies';
					sec = sec.replace(/ /,'_');
					document.getElementById("rowhead").innerHTML = '<th scope="col">Company Code</th><th scope="col">Company Name</th><th scope="col">Price</th><th scope="col">Volume</th>';
					/*
					var url = "https://cors.io/?http://167.99.73.105:8000/?symbol="+allSectors[sec]['codes'].join(',');
					console.log(url);
					axios.get(url).then(function (response) {
						var body = response.data['CompanyReturns'];
						console.log(body);
					})
					for (var c=0; c < allSectors[sec]['codes'].length; c++) {
						//var obj = {};
						var code =  allSectors[sec]['codes'][c];
						var name = allSectors[sec]['names'][c];
						retHtml = retHtml+'<tr>'+ '<td>'+code+'</td>' + '<td>'+name+'</td>' + '</tr>';
					}
					document.getElementById("list-sector").innerHTML = retHtml;
					*/

					var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+allSectors[sec]['codes'][0]+'&apikey='+alphaKey;
					axios.get(url).then(function (response) {
							var body = response.data['Time Series (Daily)'];
							for (var b in body) {
								var price = body[b]['1. open'];
								var volume = body[b]['5. volume']
								//ret = ret.replace(/(-*.*\.[0-9]{4})(.*)/,"$1");

								document.getElementById("row1").innerHTML = '<td>'+allSectors[sec]['codes'][0]+'</td>' + '<td>'+allSectors[sec]['names'][0]+'</td>' + '<td>'+price+'</td>'+ '<td>'+volume+'</td>';
								//console.log(retHtml);
								return;
							}
						})
					var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+allSectors[sec]['codes'][1]+'&apikey='+alphaKey;
					axios.get(url).then(function (response) {
							var body = response.data['Time Series (Daily)'];
							for (var b in body) {
								var price = body[b]['1. open'];
								var volume = body[b]['5. volume']
								//ret = parseFloat(ret)/parseFloat(body[b]['1. open']);
								//ret = ret.replace(/(-*.*\.[0-9]{4})(.*)/,"$1");

								document.getElementById("row2").innerHTML = '<td>'+allSectors[sec]['codes'][1]+'</td>' + '<td>'+allSectors[sec]['names'][1]+'</td>' + '<td>'+price+'</td>'+ '<td>'+volume+'</td>';
								//console.log(retHtml);
								return;
							}
						})
					var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+allSectors[sec]['codes'][2]+'&apikey='+alphaKey;
					axios.get(url).then(function (response) {
							var body = response.data['Time Series (Daily)'];
							for (var b in body) {
								var price = body[b]['1. open'];
								var volume = body[b]['5. volume']
								//ret = ret.replace(/(-*.*\.[0-9]{4})(.*)/,"$1");

								document.getElementById("row3").innerHTML = '<td>'+allSectors[sec]['codes'][2]+'</td>' + '<td>'+allSectors[sec]['names'][2]+'</td>' + '<td>'+price+'</td>'+ '<td>'+volume+'</td>';
								//console.log(retHtml);
								return;
							}
						})
			}

			function getRow(code,name) {
				var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+code+'&apikey='+alphaKey;
				axios.get(url).then(function (response) {
						var body = response.data['Time Series (Daily)'];
						for (var b in body) {
							var price = body[b]['1. open'];
							var ret = body[b]['4. close'] - body[b]['1. open'];
							ret = (ret/body[b]['1. open'])*100;
							//ret = ret.replace(/(-*.*\.[0-9]{4})(.*)/,"$1");

							var retHtml = '<tr>'+ '<td>'+code+'</td>' + '<td>'+name+'</td>' + '<td>'+price+'</td>'+ '<td>'+ret+'</td>'+ '</tr>';
							//console.log(retHtml);
							return retHtml;
						}
					})
			}

    	return (
      	<div className='searchbar-container'>
          <form onSubmit={e => e.preventDefault()} encType="multipart/form-data">
					<br />
          <div id="button-div">
    				<button class="btn btn-primary" type='submit' onClick={this.handleGoClick.bind(this)}>
    				  Click to Refresh
    				</button>
          </div>
					<br />

					<div class="card">
					  <div class="card-header">
					    Real Time Market Sector
					  </div>
					  <div class="card-body">
							<ReactHighcharts config={config1} ref="chart1"></ReactHighcharts>
					  </div>
					</div>

					<div class="card border-0">
						<div class="card-header border-0">
							<p id="click-sector"> </p>
						</div>
						<div class="card-body" >
							<table class="table">
								<thead class="thead-dark" id="rowhead">
								</thead>
								<tbody id="list-sector">
									<tr id="row1"> </tr>
									<tr id="row2"> </tr>
									<tr id="row3"> </tr>
								</tbody>
							</table>
						</div>
					</div>
  	      </form>
      	</div>
    	)
    }
}

export default Sector;
