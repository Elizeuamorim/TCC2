import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

export default function DetailsScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [distance1, setDistance1] = useState(null);
  const [distance2, setDistance2] = useState(null);

  const partner1 = { //-14.89305826976846, -40.844668289939165
    latitude: -14.89305826976846,
    longitude: -40.844668289939165,
  };

  const partner2 = { // -14.877033208583322, -40.81793087177224
    latitude: -14.877033208583322,
    longitude: -40.81793087177224,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de acesso à localização negada');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      if (currentLocation) {
        const dist1 = getDistance(
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          partner1
        );
        const dist2 = getDistance(
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          partner2
        );
        setDistance1(dist1 / 1000); // Convert to km
        setDistance2(dist2 / 1000); // Convert to km
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parceiros que Permitem Uso do Sanitário</Text>
      
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Endereço 1</Text>
        <Text style={styles.address}>Av. Juracy Magalhães, 3340 - Felicia</Text>
        <Text style={styles.address}>Vitória da Conquista - BA</Text>
        {distance1 !== null && (
          <Text style={styles.distance}>Distância: {distance1.toFixed(2)} km</Text>
        )}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: partner1.latitude,
            longitude: partner1.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={partner1}
            title={"Parceiro 1"}
            description={"Av. Juracy Magalhães, 3340 - Felicia, Vitória da Conquista - BA"}
          />
        </MapView>
      </View>
      
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Endereço 2</Text>
        <Text style={styles.address}>Av. Olívia Flores, 2500 - Universidade</Text>
        <Text style={styles.address}>Vitória da Conquista - BA</Text>
        {distance2 !== null && (
          <Text style={styles.distance}>Distância: {distance2.toFixed(2)} km</Text>
        )}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: partner2.latitude,
            longitude: partner2.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={partner2}
            title={"Parceiro 2"}
            description={"Av. Olívia Flores, 2500 - Universidade, Vitória da Conquista - BA"}
          />
        </MapView>
      </View>
      
      <Button
        title="Ir para Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addressContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    textAlign: 'center',
  },
  distance: {
    fontSize: 14,
    color: 'blue',
    marginVertical: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});
