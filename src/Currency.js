import React, { Component } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Home.css';
var data = require('./example.json');

const today = new Date();
const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.

const Industrials = {};
const Health_Care = {};
const Materials = {};
const Real_Estate = {};
const Telecommunication_Services = {codes:['ALSK','T','ATNI','BCE','CBB'], names:['Alaska Communications Systems Group Inc','AT&T','ATN International Inc','Bce Inc','Cincinnati Bell Inc']};
const Consumer_Discretionary = {};
const Utilities = {};
const Information_Technology = {};
const Consumer_Staples = {};
const Energy = {};
const Financials = {};

const allSectors = {Telecommunication_Services: Telecommunication_Services};
const alphaKey = 'PGGPOZTWY4TIMSYY';


class Currency extends Component {
	constructor (props) {
		super(props)
	    this.state = {
      usdValue: 1,
			currencyCode: 'AUD',
      currencyValue: 0,
			startDate: null,
			sectorClick: ''
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
    //check date
		var date_valid1 = true;
		var dateStr = "";
    var formatDate = "";
		if (this.state.startDate != null) {
			formatDate = this.state.startDate._d.getFullYear().toString()
						+"-"+this.addZero(this.state.startDate._d.getMonth()+1)
						+"-"+this.addZero(this.state.startDate._d.getDate());
		}
		if (! formatDate.match(/^[0-3][0-9][01][0-9]-[0-9]{2}-[0-9]{2}$/)) {
			date_valid1 = false;
			this.unhide("date_error");

		} else if (formatDate !== "") {
      var checkDate = new Date(formatDate);
      var today = new Date();
      if (checkDate >= today) {
        date_valid1 = false;
        this.unhide("date_error");
        console.log(checkDate >= today);
      }
    }
		if (date_valid1) {
			this.hide("date_error");
		}
    //check values
    var curr_valid = true;
    if (this.state.usdValue < 0) {
      curr_valid = false;
      this.unhide("curr_error");

    } else {
      this.hide("curr_error");
    }

    if (date_valid1 && curr_valid) {
      this.getCurrencyData();
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

	getSectorCompany(sec) {
		var sec_name = sec.replace(/ /,'_');
		if (allSectors.sec_name) {

		} else {
			console.log('not happening');
		}
	}


	getCurrencyData() {
    	var url = "";
      const apikey = "c617b6987d0897bece1933d77bd2b8b5";
    	var currencyCode = "";
      var currencyValue = "";
      var usdValue = this.state.usdValue;
      if (this.state.usdValue < 0) {
        usdValue = 1;
      }
    	if (this.state.currencyValue != null && this.state.currencyCode !== "" && this.state.startDate !== null) {
        console.log(this.state);
        var dateStr = this.state.startDate._d.getFullYear().toString()
            +"-"+this.addZero(this.state.startDate._d.getMonth()+1)
            +"-"+this.addZero(this.state.startDate._d.getDate());
    		currencyCode = this.state.currencyCode;
        url = "http://apilayer.net/api/live?access_key="+apikey+'&date='+dateStr+"&currencies=USD,"+currencyCode+"&format=1";
        axios.get(url)
          .then (function (response) {
            var body = response.data['quotes'];
            for (var key in body) {
              if (key === 'USDUSD') {
                continue;
              }
              currencyValue = body[key]*usdValue;
              document.getElementById("valueChange").innerHTML = currencyValue;
            }
          })
    	}
      this.state.currencyValue = currencyValue;
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
				data: [{
					name: 'Market Sector',
					y: 1
				}]
			}]
			};

			function clickEvent(e) {
				var ret = [];
				var sec = e.point.name;
				if (sec !== 'Market Sector') {
					document.getElementById("click-sector").innerHTML = 'Major '+sec+' Companies';
					sec = sec.replace(/ /,'_');
					//var url = "https://cors.io/?http://167.99.73.105:8000/?symbol="+allSectors[sec]['codes'].join(',');
					for (var c=0; c < allSectors[sec]['codes'].length; c++) {
						var obj = {};
						obj['code'] = allSectors[sec]['codes'][c];
						obj['name'] = allSectors[sec]['names'][c];
						var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+allSectors[sec]['codes'][c]+'&apikey='+alphaKey;
						axios.get(url)
							.then(function (response) {
								var body = response.data['Time Series (Daily)'];
								for (var b in body) {
									console.log(body[b]);
									break;
								}
							})
					}
					axios.get(url)
						.then(function (response) {
							var body = response.data['CompanyReturns'];
							console.log(body);
						})
				}
			}

    	return (
      	<div className='searchbar-container'>
          <form onSubmit={e => e.preventDefault()} encType="multipart/form-data">
          <br />
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">USD $</span>
            </div>
            <input class="form-control" placeholder="1.00" aria-label="Username" aria-describedby="basic-addon1"
              type='text'
              size='45'
              placeholder='Enter USD amount'
              onChange={this.handleUsdChange.bind(this)}
              value={this.state.usdValue}
            />
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Conversion</span>
              <span class="input-group-text" id="valueChange"></span>
            </div>
          </div>
          <div id="curr_error" className="error_hide">Input valid USD amount</div>

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Currency</label>
            </div>
            <select class="custom-select" id="inputGroupSelect01" onChange={this.handleComSearch.bind(this)} value={this.state.currencyCode}>
              <option value='AUD'>AUD (Australian Dollar)</option>
              <option value='AED'>AED (United Arab Emirates Dirham)</option>
              <option value='AFN'>AFN (Afghan Afghani)</option>
              <option value='AWG'>AWG (Aruban Florin)</option>
              <option value='BGN'>BGN (Bulgarian Lev)</option>
              <option value='BRL'>BRL (Brazilian Real)</option>
              <option value='CAD'>CAD (Canadian Dollar)</option>
              <option value='CHF'>CHF (Swiss Franc)</option>
              <option value='CLP'>CLP (Chilean Peso)</option>
              <option value='CNY'>CNY (Chinese Yuan Renminbi)</option>
              <option value='COP'>COP (Colombian Peso)</option>
              <option value='CUC'>CUC (Cuban Convertible Peso)</option>
              <option value='CZK'>CZK (Czech Koruna)</option>
              <option value='DKK'>DKK (Danish Krone)</option>
              <option value='DOP'>DOP (Dominican Peso)</option>
              <option value='DZD'>DZD (Algerian Dinar)</option>
              <option value='EGP'>EGP (Egyptian Pound)</option>
              <option value='ETB'>ETB (Ethiopian Birr)</option>
              <option value='EUR'>EUR (Euro)</option>
              <option value='FJD'>FJD (Fijian Dollar)</option>
              <option value='GBP'>GBP (British Pound)</option>
              <option value='GEL'>GEL (Georgian Lari)</option>
              <option value='GHS'>GHS (Ghanaian Cedi)</option>
              <option value='GMD'>GMD (Gambian Dalasi)</option>
              <option value='GNF'>GNF (Guinean Franc)</option>
              <option value='HKD'>HKD (Hong Kong Dollar)</option>
              <option value='HUF'>HUF (Hungarian Forint)</option>
              <option value='IDR'>IDR (Indonesian Rupiah)</option>
              <option value='ILS'>ILS (Israeli Shekel)</option>
              <option value='INR'>INR (Indian Rupee)</option>
              <option value='IQD'>IQD (Iraqi Dinar)</option>
              <option value='ISK'>ISK (Icelandic Krona)</option>
              <option value='JEP'>JEP (Jersey Pound)</option>
              <option value='JMD'>JMD (Jamaican Dollar)</option>
              <option value='JOD'>JOD (Jordanian Dinar)</option>
              <option value='JPY'>JPY (Japanese Yen)</option>
              <option value='KES'>KES (Kenyan Shilling)</option>
              <option value='KHR'>KHR (Cambodian Riel)</option>
              <option value='KPW'>KPW (North Korean Won)</option>
              <option value='KRW'>KRW (South Korean Won)</option>
              <option value='LAK'>LAK (Lao Kip)</option>
              <option value='LBP'>LBP (Lebanese Pound)</option>
              <option value='LKR'>LKR (Sri Lankan Rupee)</option>
              <option value='LRD'>LRD (Liberian Dollar)</option>
              <option value='LYD'>LYD (Libyan Dinar)</option>
              <option value='MAD'>MAD (Moroccan Dirham)</option>
              <option value='MNT'>MNT (Mongolian Tughrik)</option>
              <option value='MOP'>MOP (Macau Pataca)</option>
              <option value='MVR'>MVR (Maldivian Rufiyaa)</option>
              <option value='MXN'>MXN (Mexican Peso)</option>
              <option value='MYR'>MYR (Malaysian Ringgit)</option>
              <option value='NGN'>NGN (Nigerian Naira)</option>
              <option value='NOK'>Nok (Norwegian Krone)</option>
              <option value='NPR'>NPR (Nepalese Rupee)</option>
              <option value='NZD'>NZD (New Zealand Dollar)</option>
              <option value='OMR'>OMR (Omani Rial)</option>
              <option value='PEN'>PEN (Peruvian Sol)</option>
              <option value='PGK'>PGK (Papua New Guinean Kina)</option>
              <option value='PHP'>PHP (Philippine Piso)</option>
              <option value='PKR'>PKR (Pakistani Rupee)</option>
              <option value='PLN'>PLN (Polish Zloty)</option>
              <option value='RON'>RON (Romanian Leu)</option>
              <option value='RSD'>RSD (Serbian Dinar)</option>
              <option value='RUB'>RUB (Russian Ruble)</option>
              <option value='SAR'>SAR (Saudi Arabian Riyal)</option>
              <option value='SDG'>SDG (Sudanese Pound)</option>
              <option value='SEK'>SEK (Swedian Krona)</option>
              <option value='SGD'>SGD (Singapore Dollar)</option>
              <option value='SOS'>SOS (Somali Shilling)</option>
              <option value='SYP'>SYP (Syrian Pound)</option>
              <option value='THB'>THB (Thai Baht)</option>
              <option value='TJS'>TJS (Tajikistani Somoni)</option>
              <option value='TRY'>TRY (Turkish Liar)</option>
              <option value='TWD'>TWD (Taiwan New Dollar)</option>
              <option value='TZS'>TZS (Tanzanian Shilling)</option>
              <option value='UAH'>UAH (Ukrainian Hryvnia)</option>
              <option value='UGX'>UGX (Ugandan Shilling)</option>
              <option value='VND'>VND (Vietnamese Dong)</option>
              <option value='WST'>WST (Samoan Tala)</option>
              <option value='YER'>YER (yemeni Rial)</option>
              <option value='ZAR'>ZAR (South African Rand)</option>
              <option value='ZMW'>ZMW (Zambian Kwacha)</option>
            </select>
          </div>

          <br />
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Select Date</span>
            </div>
            <DatePicker id="date-selector"
    					dateFormat="DD-MM-YYYY"
    					selected={this.state.startDate}
    					onChange={this.handleDateChange.bind(this)}
    					placeholderText="Click to select a date"
    				/>
          </div>
          <div id="date_error" className="error_hide"><p>Input valid Date</p></div>

          <div id="button-div">
    				<button class="btn btn-primary" type='submit' onClick={this.handleGoClick.bind(this)}>
    				  Search
    				</button>
          </div>

  	      </form>
      	</div>
    	)
    }
}

export default Currency;
