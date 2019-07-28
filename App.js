import React from 'react';

import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    TouchableOpacity 
} from 'react-native';

import { 
    apiKey_google_place, 
    apiKey_openweather,
    apiKey_openweather_hourly 
} from './apiKey';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SelectedPlace from './SelectedPlace';
import PlaceListView from './PlaceListView';


export default class App extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            listViewDisplayed : false,
            placeSelected     : false,
            placeName         : '',
            headername        : '',
            weatherDetails    : [],
            forecastDetails   : [],
            selectedPlaceList : [],
            unitType          : 'metric',
            unit_temp         : '°C',
            unit_speed        : 'm/s',
            isFetched         : false
        };
    }

    /**
    * Return user to selected place list
    * Clear search input
    */
    backToList = () => {
        this.setState({
            placeSelected : false,
            placeName     : ''
        });
        this.googlePlacesAutocomplete._handleChangeText('');
    }

    /**
    * Add selected place to history list
    */
    addPlaceToList = () => {
        this.setState(state => {
            const dup             = state.selectedPlaceList.find(item => item.name === state.weatherDetails.name);
            let selectedPlaceList = [];

            if (!dup) 
                selectedPlaceList = [...state.selectedPlaceList, state.weatherDetails];
            
            else
                selectedPlaceList = [...state.selectedPlaceList];
            

            return{
                selectedPlaceList,
            };
        });
    }

    /**
    * Remove selected place from history list
    * @param selected place
    */
    removePlaceFromList = (place) => {
        this.setState(state => {
            const selectedPlaceList = state.selectedPlaceList.filter(item => item.name !== place.name);

            return {
                selectedPlaceList,
            };
        });
    }

    getAllWeatherDetails = (placeName, unitType) => {
        let unit_temp      = '';
        let unit_speed     = '';

        switch(unitType){
            case 'metric':
                unit_temp  = '°C';
                unit_speed = 'm/s';
            break;
            case 'default':
                unit_temp  = 'K';
                unit_speed = 'm/s';
            break;
            case 'imperial':
                unit_temp  = '°F';
                unit_speed = 'mph';
            break;
        }

        let api_url_weather = 'http://api.openweathermap.org/data/2.5/weather?q='+placeName+'&units='+unitType+'&appid=' + apiKey_openweather;

        fetch(api_url_weather)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.cod != 404) {
                iconURI = 'http://openweathermap.org/img/wn/'+responseJson.weather[0].icon+'@2x.png';
                            
                this.setState({
                    listViewDisplayed : false,
                    placeSelected     : true,
                    isLoading         : false,
                    weatherDetails    : {...responseJson, ['unitType']: this.state.unitType},
                    placeName,
                    unitType,
                    unit_temp,
                    unit_speed,

                }, function(){
                    this.addPlaceToList(this.state.weatherDetails);

                });
            }
            else{
                this.setState({
                    placeSelected: false,
                });
                alert('City is not found');
            }

        })
        .catch((error) =>{
            console.error(error);
        });
        
        let api_url_forecast = 'https://api.openweathermap.org/data/2.5/forecast?q='+placeName+'&units='+unitType+'&appid=' + apiKey_openweather_hourly;
        
        fetch(api_url_forecast)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.cod != 404) {
                
                this.setState({
                    forecastDetails: responseJson.list,
                    isFetched: true
                }, function(){

                });
            }
            else{
                alert('City is not found');
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }

    /**
    * Render and initialise main application component
    * @return main application component
    */
    render(){
        return(
            <View style = { styles.container }>
                <View style = { styles.searchInput_container }>
                    <GooglePlacesAutocomplete 
                        ref               = { c => this.googlePlacesAutocomplete = c }
                        placeholder       = 'Search'
                        minLength         = { 2 }
                        autoFocus         = { false }
                        fetchDetails      = { true }
                        listViewDisplayed = { this.state.listViewDisplayed }
                        debounce          = { 200 }

                        onPress = { (data, details = null) => { 
                            let placeName =data.description.replace(/\s/g,'%20');

                            this.setState({
                                placeName 
                            });

                            this.getAllWeatherDetails(placeName, this.state.unitType);

                        }}

                        query = {{
                            key      : apiKey_google_place,
                            language : 'en',
                            types    : '(cities)', 
                        }}

                        renderLeftButton = { () => 
                            <View>
                                {
                                    !this.state.placeSelected ?

                                    <TouchableOpacity>
                                        <Image style={styles.image_burger} source={require('./assets/burger_icon_grey.png')} />  
                                    </TouchableOpacity> :
                                  
                                    <TouchableOpacity onPress={() => this.backToList()}>
                                        <Image style={styles.image_burger} source={require('./assets/left_arrow_grey.png')} />
                                    </TouchableOpacity>
                                  
                                }
                            </View>
                        }

                        renderRightButton={() => <Image style={styles.image_search} source={require('./assets/search_icon_grey.png')} />}

                        styles = {{
                            container: { 
                                zIndex          : 999,
                                overflow        : 'visible',
                                padding         : 5,
                                backgroundColor : '#000000'
                            },
                            textInputContainer: {
                                backgroundColor : '#fff',
                                marginHorizontal: 5
                            },
                            listView: {
                                elevation       :999,
                                overflow        :'visible',
                                backgroundColor : '#fff'
                            }
                          
                        }}
                    ></GooglePlacesAutocomplete>
                </View>
                <View style = { styles.content_container }>
                {
                    this.state.placeSelected ? 

                    <SelectedPlace 
                        unitType          = { this.state.unitType }
                        unit_temp         = { this.state.unit_temp }
                        unit_speed        = { this.state.unit_speed }
                        updateUnitType    = { this.getAllWeatherDetails }
                        isLoading         = { this.state.isLoading }
                        weatherDetails    = { this.state.weatherDetails }
                        forecastDetails   = { this.state.forecastDetails }
                    /> :

                    <PlaceListView 
                        unitType          = { this.state.unitType }
                        selectedPlaceList = { this.state.selectedPlaceList } 
                        removeList        = { this.removePlaceFromList } 
                        loadPlaceDetails  = { this.getAllWeatherDetails }
                    />
                }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        paddingTop: 24,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column' ,
    },
    content_container : {
        flex: 7,
        alignSelf: 'stretch',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        zIndex: -5
    },
    textInput_style: {
        flex: 1,
        height: 70,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 10
    },
    searchInput_container : {
        flex: 1,
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
