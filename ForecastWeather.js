'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text
} from 'react-native';
import moment from "moment";
import { apiKey_openweather_hourly } from './apiKey';

class ForecastWeather extends Component {
	/**
	* Get day string from current time
	* @param seconds from API
	* @return day string
	*/
	formatDay = (sec) => {
		let today = moment();
		return today.to(moment(sec));
	}

	/**
	* Get time string
	* @param seconds from API
	* @return time string
	*/
	formatTime = (sec) => {
		return moment(sec).format('h A'); 
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
	* Render output of forecast component
	* @return Forecast weather component
	*/
	render() {
		return (
			<View style={styles.forecast_container}>
				<Text style={styles.forecastHeader}>
					5 Days Forecast / 3 hours
				</Text>
				<FlatList 
					horizontal={true}
					data={this.props.forecastDetails}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item,index}) =>{

						return(
							<View key={index} style={styles.list_item}>
								<Text style={{fontWeight: 'bold'}}>
									{this.formatTime(item.dt_txt)}
								</Text>
								<Text style={{fontSize: 10, color: '#919191'}}>
									{this.formatDay(item.dt_txt)}
								</Text>
								<View style={styles.icon_container}>
									<Image
									  style={styles.weather_icon}
									  source={{uri: this.getIcon(item.weather[0].icon)}}
									/>

								</View>
								<Text style={{fontWeight: 'bold', fontSize: 11}}>
									{item.main.temp}{this.props.unit_temp}
								</Text>
							</View>
						)
					}}
				>

				</FlatList>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	forecastHeader:{
		fontSize: 15,
		paddingBottom: 10,
		color: '#919191'
	},
	list_item:{
		height: 120,
		width: 80,
		marginHorizontal: 5,
		backgroundColor: '#f3f3f3',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	weather_icon:{
		height: 50,
		width: 50,
	},
	icon_container:{
		height: 50,
		width: 50,
		borderRadius: 25,
		backgroundColor: '#fff',
		marginVertical: 3
	},
});


export default ForecastWeather;