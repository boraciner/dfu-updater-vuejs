<template>
  <div class="container-fluid">
    <div class="row justify-content-start" style="height: 250px">
      <div class="col-lg-2 col-md-4 col-sm-12">
        <img src="./images/inklang.png" class="rounded float-left" alt="..." />
      </div>
    </div>
    <div class="row justify-content-start">
      <div class="col-2">
        <button
          type="button"
          class="btn btn-lg"
          @click="connectToUSB"
          :class="connectButtonClasses"
        >
          <i class="fab fa-usb"></i>
          {{ connectButtonText }}
        </button>
      </div>
      <div class="col-3 mt-2">
        <device-information
          v-if="connected"
          :product-name="productName"
          :manufacturer-name="manufacturerName"
        ></device-information>
      </div>
      <div class="col-4 mt-2">
        <product-information
          :ready-to-get-product-info="connected"
          :app-updater="applicationUpdater"
        ></product-information>
      </div>
    </div>
  </div>
  <file-uploader
    v-if="connected"
    :device="device"
  ></file-uploader>
  <alert-manager :my-alert-message="myAlert"></alert-manager>
  <version-display></version-display>
</template>



<script>
import DeviceInformation from "./components/DeviceInformation.vue";
import ProductInformation from "./components/ProductInformation.vue";
import FileUploader from "./components/FileUploader.vue";
import AlertManager from "./components/AlertManager.vue";
import VersionDisplay from "./components/VersionDisplay.vue";
import ApplicationUpdater from "./utils/ApplicationUpdater";

export default {
  name: "App",
  components: {
    DeviceInformation,
    ProductInformation,
    FileUploader,
    AlertManager,
    VersionDisplay,
  },
  computed: {
    connectButtonText() {
      if (this.connected) {
        return "Disconnect";
      } else {
        return "Connect";
      }
    },
    connectButtonClasses() {
      if (this.connected) {
        return "btn-danger";
      } else {
        return "btn-dark";
      }
    },
  },
  data() {
    return {
      connected: false,
      device: {},
      applicationUpdater: {},
      productName: "",
      manufacturerName: "",
      myAlert: "",
    };
  },
  methods: {
    connectToUSB() {
      if (!this.connected) {
        navigator.usb
          .requestDevice({
            filters: [
              {
                vendorId: 2492,
              },
            ],
          })
          .then(
            (dev) => {
              this.device = dev;
              this.device.open().then(() => {
                console.log("connect 1");
                this.device.claimInterface(0).then(() => {
                  console.log("connect 2");
                  this.connected = true;
                  this.productName = this.device.productName;
                  this.manufacturerName = this.device.manufacturerName;

                  console.log("productName ", this.productName);
                  console.log("manufacturerName ", this.manufacturerName);
                  this.applicationUpdater = new ApplicationUpdater(this.device);
                });
              });
            },
            function (e) {
              this.device = undefined;
              this.connected = false;
              console.error("rejected", e); // "rejected", 'Error'
            }
          )

          navigator.usb.addEventListener('disconnect', event => {
            console.log("navigator.usb.addEventListener(disconnect),",event);
            this.device = {}
            this.connected = false
            this.productName = ""
            this.manufacturerName = ""
            this.myAlert = ""
          });


      } else {
        this.device.close();
        this.connected = false;
        this.device = null;
      }
    },
  },
};
</script>







<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.slide-in-elliptic-top-fwd {
  animation: slide-in-elliptic-top-fwd 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
}

@keyframes slide-in-elliptic-top-fwd {
  0% {
    transform: translateY(-600px) rotateX(-30deg) scale(0);
    transform-origin: 50% 100%;
    opacity: 0;
  }
  100% {
    transform: translateY(0) rotateX(0) scale(1);
    transform-origin: 50% 1400px;
    opacity: 1;
  }
}

.puff-in-center {
  animation: puff-in-center 0.7s cubic-bezier(0.47, 0, 0.745, 0.715) both;
}
@keyframes puff-in-center {
  0% {
    transform: scale(2);
    filter: blur(4px);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    filter: blur(0px);
    opacity: 1;
  }
}

.carousel-control-next-icon:after {
  content: ">";
  font-size: 55px;
  color: blue;
}

.carousel-control-prev-icon:after {
  content: "<";
  font-size: 55px;
  color: blue;
}

.roll-in-left {
  animation: roll-in-left 0.6s ease-out both;
}

@keyframes roll-in-left {
  0% {
    transform: translateX(800px) rotate(540deg);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
}

.slide-in-blurred-top {
  animation: slide-in-blurred-top 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes slide-in-blurred-top {
  0% {
    transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
    transform-origin: 50% 0%;
    filter: blur(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
}

.fade-out {
  animation: fade-out 1s ease-out both;
}
@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

body {
  font-family: "Roboto", sans-serif;
  margin: 0px;
}

.card {
  background-color: transparent;
  position: absolute;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
}

.icon-cog {
  color: white;
}

.fa-cog {
  color: white;
}

/* Here Is The CSS For The Background*/

/* An Overlay To Dim The Image And Make Text Readable*/
#color-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom right, #34495e, #2c3e50);
  opacity: 0.6;
  z-index: -1;
}

/* Setup For An Image That Fits On Most Screens And Resizes*/
.with-bg-size {
  background-image: url("./images/1.jpeg");
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;

  -webkit-animation: back 12s infinite; /* Safari 4+ */
  -moz-animation: back 12s infinite; /* Fx 5+ */
  -o-animation: back 12s infinite; /* Opera 12+ */
  animation: back 12s infinite; /* IE 10+, Fx 29+ */
}
/* The Keyframes*/
@keyframes back {
  25% {
    background-image: url("./images/1.jpeg");
  }
  50% {
    background-image: url("./images/2.jpeg");
  }

  75% {
    background-image: url("./images/3.jpeg");
  }

  /* Animation Does Not End At 100% Because It Makes The Images Transition In/Out Better For Some Reason*/
}
</style>
