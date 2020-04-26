<template>
  <div class="map">
    <div class="error" v-if="error">
      <div class="errorInner">{{ errorText }}</div>
    </div>
    <div class="eventMaker" v-if="eventMaker && points.length > 0">
      <div class="eventMakerContainer">
        <div class="eventMakerHeader">
          <div class="title">Add new event</div>
          <div class="btn close" @click="showEventMaker"></div>
        </div>
        <div class="form">
          <input
            type="text"
            placeholder="Event text, eg: its raining here"
            v-model="text"
          />
          <br />
          <button class="addBtn" @click="addEvent">Add</button>
        </div>
      </div>
    </div>
    <div class="input_container">
      <input
        type="text"
        placeholder="search for a city"
        @keyup="searchCities"
      />
    </div>
    <mapbox
      class="map"
      :access-token="process.env.mapBoxToken"
      :map-options="{
        style: 'mapbox://styles/mapbox/dark-v10',
        center: center,
        zoom: 10,
        interactive: false
      }"
      :nav-control="{ show: false }"
      @map-load="loadEvent"
      @map-click="addPoints"
    />
    <div class="add" @click="showEventMaker" v-if="logged"></div>
  </div>
</template>

<script>
import firebase from "firebase";
import Mapbox from "mapbox-gl-vue";

let mapData = {};

export default {
  name: "Map",
  components: { Mapbox },
  props: ["events", "logged", "user"],
  data() {
    return {
      points: [],
      center: [-96.7969, 32.7763],
      eventMaker: false,
      text: null,
      error: false,
      errorText: null,
      newCity: null
    };
  },
  watch: {
    events() {
      this.addPins(mapData);
    },
    center(newCenter) {
      this.$emit("centerChanged", this.newCity, newCenter);
    }
  },
  methods: {
    loadEvent(map) {
      mapData = map;
      this.events == false ? "" : this.addPins(map);
    },
    addPins(map) {
      const mapboxgl = require("mapbox-gl/dist/mapbox-gl");

      this.events.features.forEach(function(marker) {
        var el = document.createElement("div");
        el.className = "pin event";
        el.id = `pin_${marker.properties.id}`;
        el.style.width = "50px";
        el.style.height = "50px";

        el.addEventListener("click", function() {
          window.alert(marker.properties.text);
        });
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map);
      });
    },
    searchCities(v) {
      if (v.keyCode == 13) {
        fetch(`http://localhost:3000/get/${v.target.value}/center`)
          .then(res => res.json())
          .then(result => {
            this.center = result.center;
            mapData.easeTo({
              center: [result.center[0], result.center[1]]
            });
            this.newCity = result.city;
            v.target.value = "";
          })
          .catch(err => console.error(err));
      }
    },
    addPoints(map, e) {
      if (this.eventMaker) {
        this.points.push(e.lngLat.lat, e.lngLat.lng);
        this.error = false;
        this.errorText = null;
      }
    },
    reset() {
      this.error = false;
      this.errorText = null;
      this.points = [];
      this.text = null;
    },
    showEventMaker() {
      this.eventMaker = this.eventMaker ? false : true;
      if (this.eventMaker && this.points <= 0) {
        this.error = true;
        this.errorText =
          "Where you want to add new event? (choose a point by clicking the map)";
      } else {
        this.reset();
      }
    },
    addEvent() {
      if (this.points.length < 0) {
        (this.error = true),
          (this.errorText =
            "Something isn't working right, Try refreshing the page");
        return 0;
      } else if (this.text == null) {
        (this.error = true),
          (this.errorText = "Please provide some details about the event");
        return 0;
      } else {
        let db = firebase.firestore();
        let that = this;
        db.collection("event")
          .add({
            text: that.text,
            owner: that.user.uid,
            author: that.user.displayName,
            userimg: that.user.photoURL,
            points: that.points,
            center: that.center,
            time: new Date().getTime()
          })
          .then(function(docRef) {
            db.collection("byUser")
              .doc(that.user.uid)
              .set(
                {
                  events: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                },
                { merge: true }
              );
            (that.error = true), (that.errorText = "Event added!!");
            setTimeout(() => {
              that.showEventMaker();
            }, 3000);
          })
          .catch(function() {
            (that.error = true),
              (that.errorText = "Error adding event, please try again later");
            setTimeout(() => {
              that.showEventMaker();
            }, 4000);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css");

.map {
  width: 65vw;
  height: 100vh;
  position: relative;
}

.error {
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  z-index: 999;
  .errorInner {
    border-radius: 15px;
    background: rgb(255, 55, 55);
    padding: 10px;
    margin: 0 auto;
    display: inline-block;
    width: auto;
  }
}

.input_container {
  position: absolute;
  width: 65vw;
  top: 2vh;
  z-index: 5;
  input {
    margin: 0 auto;
    font-family: inherit;
    font-size: 18px;
    width: 80%;
    border-radius: 50px;
    padding: 10px 15px;
    border: 0;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    color: inherit;
    &::placeholder {
      color: inherit;
    }
    &:focus {
      outline: 0;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.add {
  position: fixed;
  bottom: 40px;
  right: 30px;
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.08);
  z-index: 9;
  border-radius: 50%;
  backdrop-filter: blur(12px);
  background-size: 80% !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z' fill='rgba(255,255,255,1)'/%3E%3C/svg%3E") !important;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.eventMaker {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 12;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.eventMakerContainer {
  margin: 0 auto;
  width: 40%;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 15px;
  padding: 15px 20px;
  .eventMakerHeader {
    margin: 15px 0;
    width: 100%;
    font-size: 24px;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z' fill='rgba(255,255,255,1)'/%3E%3C/svg%3E");
  }
}

.form {
  input[type="text"] {
    width: 96%;
    padding: 10px 2%;
    font-family: inherit;
    background: rgba(255, 255, 255, 0.06);
    border: 0;
    color: inherit;
    font-size: 16px;
    border-radius: 15px;
    &::placeholder {
      color: inherit;
    }
    &:focus {
      outline: 0;
      background: rgba(255, 255, 255, 0.2);
    }
  }
  button {
    margin: 15px 0;
    padding: 10px 5%;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.96);
    font-family: inherit;
    border: 0;
    font-size: 16px;
    color: rgb(10, 10, 10);
    cursor: pointer;
    &:active {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
