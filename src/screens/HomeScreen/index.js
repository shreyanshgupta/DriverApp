import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, Pressable, AppState, PermissionsAndroid, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from './styles.js'
import NewOrderPopup from "../../components/NewOrderPopup";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Geolocation from "react-native-geolocation-service";

const GOOGLE_MAPS_APIKEY = '';

const HomeScreen = () => {
    const [car,setCar] = useState({
        isActive: false
    })
    const [order, setOrder] = useState(null)
    const [newOrders, setNewOrders] = useState([]);

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [initialLocation, setInitialLocation] = useState({
        longitude: 0,
        latitude: 0,
        accuracy: 0
    });

    const fetchOrders = async () => {
        try {
            await fetch('https://adfee1a0-968e-4ef9-99ae-159faee085c6.mock.pstmn.io/listorders')
                .then(response => response.json())
                .then(data=>{
                    // console.log("orders", data);
                    setNewOrders(data?.items)
                })
        } catch(error){
        }
    }

    const getLocation = async () => {
        const isFineLocationGranted = await PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION');
        if(isFineLocationGranted === PermissionsAndroid.RESULTS.GRANTED){
            return true;
        }
        return false;
    }

    const getLocationPermission = () => {
        getLocation().then((locationPermission) => {
            if(locationPermission){
                Geolocation.getCurrentPosition(
                    (position) => {
                        setInitialLocation({longitude: position.coords.longitude, latitude: position.coords.latitude, accuracy: position.coords.accuracy})
                    },
                    async (error) => {
                        // See error code charts below.
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            }
        });
    }

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (
                appState.current.match(/inactive|background/) ||
                nextAppState === "active"
            ) {
                // console.log("App has come to the foreground!");
                getLocationPermission();
            }
            
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });

        getLocationPermission();

        let interval;

        if(car?.isActive && !order){
            interval = setInterval(fetchOrders, 5000);
        }else{
            clearInterval(interval);
        }

        return (()=>{
            subscription.remove();
            clearInterval(interval);
        })
    }, [car?.isActive, order]);

    const onDecline = () => {
        //make an api call with orderId, so that backend knows order declined by user(driver)
        setNewOrders(newOrders.slice(1));
    }

    const onAccept = async (newOrder) => {
        setOrder(newOrder)
        setNewOrders(newOrders.slice(1));
    }

    const onGoPress = async () => {
        setCar({isActive: !car.isActive})
    }

    const onUserLocationChange = async (event) => {
        const { latitude, longitude, heading } = event.nativeEvent.coordinate
        const payload = {
            "id": 123,
            "latitude": latitude,
            "longitude": longitude,
            "heading": heading,
        }
        sendLocationtoServer(payload);
    }

    const sendLocationtoServer = async (payload) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: payload,
        };

        try {
            await fetch('https://adfee1a0-968e-4ef9-99ae-159faee085c6.mock.pstmn.io/sendlocation', requestOptions)
                .then(response => response.json())
                .then(data=>{
                    // console.log("sendLocationtoServer", data);
                })
        } catch(error){
            // console.log("Error", error);
        }
    }

    const onDirectionFound = (event) => {
        if (order) {
        setOrder({
            ...order,
            distance: event.distance,
            duration: event.duration,
            pickedUp: order.pickedUp || event.distance < 0.2,
        })
        }
    }

    const getDestination = () => {
        if (order && order.pickedUp) {
        return {
            latitude: order.destLatitude,
            longitude: order.destLongitude,
        }
        }
        return {
        latitude: order.originLatitude,
        longitude: order.oreiginLongitude,
        }
    }

    const renderBottomTitle = () => {
        if (order) {
            return (
                <View style={{ alignItems: 'center' }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: '#000000'}}>2 min</Text>
                    <View style={{ backgroundColor: '#1e9203', marginHorizontal: 10, width: 30, height: 30, alignItems:'center', justifyContent: 'center', borderRadius: 20}}>
                    <FontAwesome name={"user"} color={"white"} size={20} />
                    </View>
                    <Text style={{color: '#000000'}}>0.5 mi</Text>
                </View>
                <Text style={styles.bottomText}>Picking up {order?.user?.username}</Text>
                </View>
            )
        }
        if (car?.isActive) {
            return (
                <Text style={styles.bottomText}>You're online</Text>
            )
        }
        return (<Text style={styles.bottomText}>You're offline</Text>);
    }

    return (
        (initialLocation.latitude == 0 && initialLocation.longitude == 0 )?
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size='large' color='black'/> 
            </View>
            :
            <View>
                <MapView
                    style={{width: '100%', height: Dimensions.get('window').height - 100}}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    onUserLocationChange={onUserLocationChange}
                    initialRegion={{
                        latitude: initialLocation.latitude,
                        longitude: initialLocation.longitude,
                        latitudeDelta: 0.0222,
                        longitudeDelta: 0.0121,
                    }}
                    showsMyLocationButton={true}
                    showsTraffic={true}
                >
                    {order && (
                    <MapViewDirections
                        origin={{
                            latitude: 12.924394,
                            longitude: 77.672743,
                        }}
                        onReady={onDirectionFound}
                        destination={getDestination()}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={5}
                        strokeColor="black"
                    />
                    )}
                </MapView>

                <Pressable
                    onPress={() => console.warn('Balance')}
                    style={styles.balanceButton}>
                    <Text style={styles.balanceText}>
                    <Text style={{ color: 'green' }}>$</Text>
                    {' '}
                    0.00
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => console.warn('Menu')}
                    style={[styles.roundButton, {top: 10, left: 10}]}>
                    <Entypo name={"menu"} size={24} color="#4a4a4a"/>
                </Pressable>

                <Pressable
                    onPress={onGoPress}
                    style={styles.goButton}>
                    <Text style={styles.goText}>
                    {car?.isActive ? 'END' : 'GO'}
                    </Text>
                </Pressable>

                <View style={styles.bottomContainer}>
                    <Ionicons name={"options"} size={30} color="#4a4a4a"/>
                    {renderBottomTitle()}
                    <Entypo name={"menu"} size={30} color="#4a4a4a" />
                </View>

                {newOrders.length > 0 && !order && <NewOrderPopup
                    newOrder={newOrders[0]}
                    duration={2}
                    distance={0.5}
                    onDecline={onDecline}
                    onAccept={() => onAccept(newOrders[0])}
                />}
            </View>
    );
};

export default HomeScreen;