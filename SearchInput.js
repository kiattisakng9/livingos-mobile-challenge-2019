'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { apiKey_google_place, apiKey_openweather } from './apiKey';

class SearchInput extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	listViewDisplayed: this.props.listViewDisplayed,
	  	placeSelected: this.props.placeSelected
	  };
	}
  render() {
    return (
        <View style={styles.searchInput_container}>
          <GooglePlacesAutocomplete 
            ref={c => this.googlePlacesAutocomplete = c}
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            fetchDetails={true}
            listViewDisplayed={this.state.listViewDisplayed}

            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log("TOWN NAME: \n" + data.description);
              let placeName=data.description.replace(/\s/g,'');
              
              this.setState({
                listViewDisplayed: false,
                placeSelected: true,
                placeName
              });
            }}
          
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: apiKey_google_place,
              language: 'en', // language of the results
              types: '(cities)', // default: 'geocode'
            }}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            renderLeftButton={() => 
              <TouchableOpacity onPress={() => this.backToList()}>
                {
                  !this.state.placeSelected ?
                  <Image style={styles.image_burger} source={require('./assets/burger_icon_grey.png')} /> : 
                  
                  <Image style={styles.image_burger} source={require('./assets/left_arrow_grey.png')} />
                  
                }
              </TouchableOpacity>
              
            }
            renderRightButton={() => <Image style={styles.image_search} source={require('./assets/search_icon_grey.png')} />}
            
            styles={{
              container: { 
                zIndex: 999,
                overflow: 'visible',
              },
              textInputContainer: {
                backgroundColor: '#fff'
              },
              listView:{
                elevation:999,
                overflow:'visible',
              }
              
            }}
            >
          </GooglePlacesAutocomplete>
        </View>
    );
  }
}

const styles = StyleSheet.create({
	searchInput_container : {
	    flex: 1,
	    // backgroundColor: '#8dd7f3',
	    paddingTop: 24,
	    alignItems: 'flex-start',
	    justifyContent: 'center',
	    flexDirection: 'row',
	    position: 'absolute'  

	},
	image_burger: {
		width: 30,
		height: 30,
		margin: 5
	},
	image_search: {
		width: 27,
		height: 27,
		margin: 7
	}
});


export default SearchInput;