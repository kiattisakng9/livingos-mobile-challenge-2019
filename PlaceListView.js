'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	Alert
} from 'react-native';
import moment from "moment";

class PlaceListView extends Component {

	/**
	* Get time string
	* @param seconds from API
	* @return time string
	*/
	formatTime(sec){
		return moment(sec).format('h:mm A'); 
	}

	/**
	* Get weather icon from icon URI
	* @param icon ID from API
	* @return icon URI
	*/
	getIcon(icon_id){
		iconURI = 'http://openweathermap.org/img/wn/'+icon_id+'@2x.png';
		return iconURI;
	}

	/**
	* Display confirmation message before deleting place from list
	* @param seconds from API
	* @return day string
	*/
	displayConfirmation(place){
		const title = 'Delete this place? ';
		const message = 'Are you sure you want to remove ' + place.name + '?';

		Alert.alert(title, message, 
			[{
		    	text: 'Cancel',
		    	onPress: () => console.log('Cancel Pressed'),
		    	style: 'cancel',
		    },
		    {
		    	text: 'OK', 
		    	onPress: () => this.props.removeList(place)
		    }]);
	} 

	/**
	* Get unit string from unit type
	* @param unit type from API
	* @return unit string
	*/
	getUnit(unitType){
        let unit = '';
        switch(unitType){
            case 'metric':
                unit = '°C'
            break;
            case 'default':
                unit = 'K'
            break;
            case 'imperial':
                unit = '°F'
            break;
        }
        return unit;
	}

	/**
	* Render listview of places selected by users 
	* @return place listview component
	*/
	render() {
		return (
			<View style={styles.listview_container}>
				<Text style={styles.listviewHeader}>
					History List
				</Text>

				<FlatList 
					data={this.props.selectedPlaceList}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item,index}) =>{

						return(
							<View key={index} >
								<TouchableOpacity 
									onLongPress={this.displayConfirmation.bind(this, item)} 
									onPress={()=> this.props.loadPlaceDetails(item.name, this.props.unitType)} 
								>
									<View style={styles.listviewRow}>
										<View style={styles.left_col}>
											<Text style={{fontWeight: 'bold', fontSize: 25}}>
												{item.name}
											</Text>
										</View>
										<View style={styles.right_col}>
											<View style={styles.image_container}>
												<Image
													style={styles.icon_style}
													source={{uri: this.getIcon(item.weather[0].icon)}}
												/>
											</View>
										
											<Text style={styles.temp_text}>
												{item.main.temp}{this.getUnit(item.unitType)}
											</Text>
										</View>
									</View>
								</TouchableOpacity>
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
	listview_container:{
		flex: 1,
		paddingTop: 65,
		padding: 10
	},
	listviewHeader: {
		fontSize: 30,
		paddingBottom: 10,
		color: '#919191'
	},
	listviewRow: {
		flexDirection: 'row',
		marginVertical: 3
	},
	left_col: {
		flex: 3,
		fontSize: 30,
		justifyContent: 'center'
	},
	right_col: {
		flex: 2,
		flexDirection: 'row',
		alignItems: 'center'
	},
	image_container: {
		flex: 1,
	},
	icon_style: {
		height: 50,
		width: 50,
	},
	temp_text: {
		fontWeight: 'bold', 
		fontSize: 17, 
		flex: 1, 
		color: '#919191'
	}
});


export default PlaceListView;