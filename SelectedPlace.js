'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Picker
} from 'react-native';
import ForecastWeather from './ForecastWeather';
import moment from "moment";

class SelectedPlace extends Component {

	/**
	* Get date string
	* @param seconds from API
	* @return date string
	*/
	parseDate = (sec) => {
	    let today = new Date();
	    return moment().format('dddd, Do MMMM YYYY'); 
	}

	/**
	* Get weather icons from icon URI
	* @param icon ID from API
	* @return icon URI
	*/
	getIcon = (icon_id) => {
		iconURI = 'http://openweathermap.org/img/wn/'+icon_id+'@2x.png';
		return iconURI;
	}

	/**
	* Render selected place details component
	* @return selected place details component
	*/
	render() {

		if (this.props.isLoading) {
			return(
				<View style={styles.content}>
					<ActivityIndicator
					  animating={true}
					  color={'#808080'}
					  size={'small'}
					/>
					
				</View>
			);
		}
		else{
			return (
				<View style={styles.content_container_selected}>
					<View style={styles.header_container}>

						<View style={{flex: 1}, styles.header_left_col}>
							<Text style={[styles.text_style,styles.headerName]}>
								{this.props.weatherDetails.name}
							</Text>

							<Text style={[styles.text_style, styles.headerDate]}>
								{this.parseDate(this.props.weatherDetails.dt)}
							</Text>

							<Text style={[styles.text_style, styles.headerTemp]}>
								MIN: {this.props.weatherDetails.main.temp_min }{this.props.unit}, 
								MAX: {this.props.weatherDetails.main.temp_max }{this.props.unit}
							</Text> 
						</View>
						<View style={styles.header_right_col}>
							<Picker
								selectedValue={this.props.unitType}
								style={{height: 30, width: 150}}
								onValueChange={
									(itemValue) => this.props.updateUnitType(this.props.weatherDetails.name,itemValue)
								}
							>
								<Picker.Item label="Celsius " value="metric" />
								<Picker.Item label="Kelvin " value="default" />
								<Picker.Item label="Fahrenheit " value="imperial" />
							</Picker> 
						</View>

					</View>

					<View style={styles.mid_container}>
						<Image
						  style={styles.weather_icon}
						  source={{uri: this.getIcon(this.props.weatherDetails.weather[0].icon)}}
						/>
						
						<Text style={[styles.text_style, styles.midTemp]}>
							{this.props.weatherDetails.main.temp}{this.props.unit_temp}
						</Text>

						<Text style={styles.text_style}>
							{this.props.weatherDetails.weather[0].description}
						</Text> 
					</View>

					<ForecastWeather forecastDetails={this.props.forecastDetails} unit_temp={this.props.unit_temp}/>

					<View style={styles.addDetails_container}>
						<View style={styles.text_row}>
							<Text style={[styles.left_col_style, styles.text_row_style, styles.headerDate]}>
								Humidity	
							</Text>
							<Text style={[styles.text_row_style, styles.headerDate]}>
								: {this.props.weatherDetails.main.humidity} %
							</Text>
						</View>

						<View style={styles.text_row}>
							<Text style={[styles.left_col_style, styles.text_row_style, styles.headerDate]}>
								Wind	
							</Text>
							<Text style={[styles.text_row_style, styles.headerDate]}>
								: {this.props.weatherDetails.wind.speed} {this.props.unit_speed}
							</Text>
						</View>

						<View style={styles.text_row}>
							<Text style={[styles.left_col_style, styles.text_row_style, styles.headerDate]}>
								Pressure	
							</Text>
							<Text style={[styles.text_row_style, styles.headerDate]}>
								: {this.props.weatherDetails.main.pressure} hPa
							</Text>
						</View>
					</View>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	content_container_selected:{
		flex: 1,
		paddingTop: 65,
		padding: 10,
	},
	
	header_container:{
		flex: 1,
		flexDirection: 'row',
		// backgroundColor: 'red'
	},
	mid_container:{
		flex: 3,
		// backgroundColor: '#a3c6cd',
		alignItems: 'center',
		justifyContent: 'center'
	},
	forecast_container:{
		flex: 2,
		// backgroundColor: '#fff',

	},
	addDetails_container:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// backgroundColor: 'yellow'
	},
	headerName:{
		fontSize: 22,
		fontWeight: 'bold',
		fontFamily: 'sans-serif-light',
		paddingBottom: 4
	},
	headerDate:{
		fontSize: 13,
		fontWeight: '300',
		fontFamily: 'sans-serif',

	},
	headerTemp:{
		fontSize: 10,
		fontWeight: 'bold',
		fontFamily: 'sans-serif-light',
		color: '#919191'
	},
	header_right_col:{
		flex: 1, 
		justifyContent: 'flex-start', 
		alignItems: 'flex-end', 
		padding: 2
	},
	midTemp:{
		fontSize: 60,
		fontWeight: 'bold',
		fontFamily: 'sans-serif-light',
		color: '#000'
	},
	weather_icon:{
		height: 50,
		width: 70,
	},
	text_row:{
		flexDirection: 'row',
		margin: 5,
	},
	text_row_style:{
		flex: 1,
		height: 15,
	},
	left_col_style:{
		paddingLeft: 50
	},
	text_style:{
		paddingBottom: 5
	}
});


export default SelectedPlace;