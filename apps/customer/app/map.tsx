import React from "react";
import {View,Text,StyleSheet} from "react-native";
import MapView,{UrlTile,Marker,Region} from "react-native-maps";

const initialRegion:Region={latitude:28.6047,longitude:77.4355,latitudeDelta:0.045,longitudeDelta:0.045};
// Configure a compliant OSM-derived tile provider in EXPO_PUBLIC_OSM_TILE_URL.
// Do not assume the community OSMF tile server is an unlimited production tile host.
const tileTemplate=process.env.EXPO_PUBLIC_OSM_TILE_URL;

export default function ServiceAreaMap(){
 return <View style={styles.wrap}>
  <MapView style={styles.map} initialRegion={initialRegion}>
   {tileTemplate?<UrlTile urlTemplate={tileTemplate} maximumZ={19} tileSize={256}/>:null}
   <Marker coordinate={{latitude:28.6047,longitude:77.4355}} title="Gaur City 2"/>
   <Marker coordinate={{latitude:28.5992,longitude:77.4294}} title="Gaur City 1"/>
   <Marker coordinate={{latitude:28.6277,longitude:77.4386}} title="Crossings Republik"/>
  </MapView>
  <View style={styles.attribution}><Text style={styles.attrText}>© OpenStreetMap contributors</Text></View>
  {!tileTemplate?<View style={styles.notice}><Text style={styles.noticeText}>Map tiles are not configured yet. Set EXPO_PUBLIC_OSM_TILE_URL to your chosen compliant OSM tile provider.</Text></View>:null}
 </View>
}
const styles=StyleSheet.create({wrap:{height:320,borderRadius:18,overflow:"hidden",backgroundColor:"#E7EFE9"},map:{flex:1},attribution:{position:"absolute",right:8,bottom:8,backgroundColor:"rgba(255,255,255,0.9)",paddingHorizontal:8,paddingVertical:5,borderRadius:6},attrText:{fontSize:10,color:"#173D32"},notice:{position:"absolute",top:12,left:12,right:12,backgroundColor:"rgba(255,249,240,0.95)",padding:10,borderRadius:10},noticeText:{fontSize:11,color:"#173D32"}});
