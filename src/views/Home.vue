<template>
  <div class="home">
    <div class="content">
      <Header :logged="logged" :userimg="userImg" />
      <div class="container">
        <div class="at">
          <div class="city">{{ city[0].name }}</div>
          <div class="state_country">{{ city[0].state_country }}</div>
        </div>
        <div class="weather">
          <div
            class="icon"
            :style="'background:url(' + city[0].weather[0].img + ')'"
          ></div>
          <div class="temp">
            <span class="text">{{
              truncateText(city[0].weather[0].text)
            }}</span>
            {{ city[0].weather[0].temp }} °C
          </div>
        </div>
      </div>
      <div class="events">
        <div class="event_container">
          <div class="small_title">
            Recent Events
          </div>
          <div class="nothing" v-if="events.features.length == 0">
            Nothing to see here yet.
          </div>
          <div v-if="events.features.length > 0">
            <div
              class="eventsContent"
              v-for="event in events.features"
              :key="event.properties.id"
            >
              <div class="text">{{ event.properties.text }}</div>
              <div class="eventFooter">
                <div class="author">
                  <img
                    :src="event.properties.userImg"
                    :alt="event.properties.author"
                  />
                  <div class="authorName">{{ event.properties.author }}</div>
                </div>
                <div class="time">{{ event.properties.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Map
      :events="events"
      :logged="logged"
      :user="loggedUser"
      @centerChanged="changeCity"
    />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Map from "@/components/Map.vue";
import firebase from "firebase";

export default {
  name: "Home",
  components: {
    Header,
    Map
  },
  data() {
    return {
      events: {
        type: "FeatureCollection",
        features: []
      },
      logged: null,
      loggedUser: null,
      userImg: null,
      city: [
        {
          name: "...",
          state_country: "...",
          weather: [
            {
              text: "...",
              img: "",
              temp: "..."
            }
          ]
        }
      ]
    };
  },
  watch: {
    loggedUser(user) {
      if (user) {
        this.logged = true;
        this.userImg = user.photoURL;
      } else {
        this.logged = false;
      }
    }
  },
  methods: {
    truncateText(str) {
      return str.length > 25
        ? str.substring(0, 25).replace(/((\s*\S+)*)\s*/, "$1") + "..."
        : str;
    },
    changeCity(newCity, newCenter) {
      fetch(`http://localhost:3000/get/${newCity.split(",")[0]}/weather`)
        .then(res => res.json())
        .then(result => {
          this.city[0].name = newCity.split(",")[0];
          this.city[0].state_country = newCity.split(",").splice(1, 2)[0];
          this.city[0].weather[0].text = result.text;
          this.city[0].weather[0].img = "https:" + result.icon;
          this.city[0].weather[0].temp = result.temp;
        })
        .catch(err => console.error(err));

      let db = firebase.firestore();
      let that = this;
      db.collection("event")
        .where("center", "==", newCenter)
        .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
              that.events.features.push({
                type: "Feature",
                properties: {
                  id: change.doc.id,
                  text: change.doc.data().text,
                  time: change.doc.data().time,
                  userImg: change.doc.data().userimg,
                  author: change.doc.data().author
                },
                geometry: {
                  type: "Point",
                  coordinates: [
                    change.doc.data().points[1],
                    change.doc.data().points[0]
                  ]
                }
              });
            }
          });
        });
    }
  },
  mounted() {
    this.changeCity("Dallas, Texas, United States", [-96.7969, 32.7763]);
    let that = this;
    firebase.auth().onAuthStateChanged(user => {
      that.loggedUser = user;
    });
  }
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: row;
}
.content {
  top: 0;
  bottom: 0;
  right: 0;
  flex-grow: 1;
  background: rgb(10, 10, 10);
  padding: 2vh 20px;
  min-height: 96vh;
  max-height: 100vh;
  text-align: left;
  position: relative;
}

.container {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 30px 0;
  .city {
    font-size: 26px;
  }
  .state_country {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.42);
  }
  .weather {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .icon {
      width: 30px;
      height: 30px;
      background-size: 125% !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
    }
    .temp {
      font-size: 16px;
      margin-top: 10px;
      .text {
        margin-right: 5px;
      }
      .celcius {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-size: cover;
        background-repeat: no-repeat;
        margin-right: 2px;
        position: relative;
        bottom: -2px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4.5 10a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM22 10h-2a4 4 0 1 0-8 0v5a4 4 0 1 0 8 0h2a6 6 0 1 1-12 0v-5a6 6 0 1 1 12 0z' fill='rgba(255,255,255,1)'/%3E%3C/svg%3E");
      }
    }
  }
}

.events {
  margin: 30px 0;
  .event_container {
    margin: 15px 0;
  }
  .small_title {
    margin-bottom: 15px;
    font-size: 18px;
  }
}

.eventsContent {
  padding: 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  margin-bottom: 15px;
  .text {
    margin-bottom: 10px;
    font-size: 22px;
  }
  .eventFooter {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.42);
  }
  .author {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }
}
.nothing {
  margin: 15px 0;
  color: rgba(255, 255, 255, 0.42);
}
</style>
