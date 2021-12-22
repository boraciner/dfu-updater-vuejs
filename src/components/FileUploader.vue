<template>
  <div class="container-fluid applicationUpdatePage mt-5">
    <div class="row justify-content-center">
      <div class="col-7">
        <div class="input-group">
          <div class="custom-file">
            <input
              type="file"
              class="custom-file-input"
              aria-describedby="inputGroupFileAddon04"
              @change="SelectFile"
            />
            <label class="custom-file-label" for="inputGroupFile04"
              >Choose Application Firmware File</label
            >
          </div>
          <div class="input-group-append">
            <button
              class="btn btn-dark"
              type="button"
              v-if="fileOk"
              @click="StartToUpload"
            >
              Upgrade From File
            </button>
          </div>
        </div>
      </div>
      <div class="col-1">
        <div
          class="spinner-border text-danger"
          role="status"
          v-if="byteCount>0"
        >
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div
        class="col-12 text-capitalize badge badge-primary text-wrap"
        style="width: 100%"
        v-if="byteCount>0"
      >
        {{progressBarPercentage}} Transferred {{byteCount}} of {{bytes.length}}
      </div>
      <div class="col-lg-2 col-md-1 col-sm-1"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "file-uploader",
  setup() {},
  computed:{
    progressBarPercentage(){
      let precentage = Math.ceil((this.byteCount / this.bytes.length) * 100)
      return precentage+"%"
    }
  },
  watch: {
    bytes(value) {
      if (value.length > 0) {
        this.fileOk = true;
      } else {
        this.fileOk = false;
      }
    },
    byteCount(value) {
      console.log("Byte count ==========> ", value);
    },
  },
  data() {
    return {
      byteCount: 0,
      file: null,
      fileOk: false,
      bytes: [],
    };
  },
  props: {
    device: {},
  },
  methods: {
    SelectFile(e) {
      console.log("SelectFile 1");
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.file = files[0];
      console.log("SelectFile 2");

      let reader = new FileReader();
      reader.onload = (event) => {
        let arrayBuffer = event.target.result;
        this.bytes = new Uint8Array(arrayBuffer);
      };

      reader.readAsArrayBuffer(this.file);
    },
    StartToUpload() {
      console.log("Pressed 1");
      this.Update(this.bytes);
      console.log("Pressed 2");
    },
    Update(myByteArray, blockCounter = 0, askForStatus = false) {
      console.log(
        ">>>>Application Updater | Update | blockCounter",
        blockCounter,
        "askForStatus",
        askForStatus
      );

      if (askForStatus) {
        console.log("askForStatus true....");

        return this.device
          .controlTransferIn(
            {
              requestType: "class",
              recipient: "interface",
              request: 3,
              value: 0,
              index: 0,
            },
            6
          )
          .then((res2) => {
            console.log("RESULT Status of Device ", res2);
            let arrayBuffer = res2.data.buffer;
            let receivedData = new Uint8Array(arrayBuffer);
            console.log(">>> Status ");
            console.hex(receivedData);
            if (receivedData[4] === 0x04 || receivedData[4] === 0x05) {
              console.log(">>> Status stage 1");
              if (receivedData[4] === 0x04) {
                console.log(">>> Status stage 2");
                let timeout =
                  ((receivedData[2] & 0xff) << 8) | (receivedData[1] & 0xff);
                setTimeout(() => {
                  console.log("wait for ", timeout, " milliseconds");
                  this.Update(myByteArray, blockCounter, true);
                }, timeout);
              } else {
                console.log(">>> Status stage 3");
                console.log("do it now...");
                this.Update(myByteArray, blockCounter, false);
              }
            } else {
              console.error("There is a problem");
              Promise.reject();
            }
          });
      } else {
        console.log("askForStatus false....");
        let myCurrentByteIndex = blockCounter * 512;
        this.byteCount = myCurrentByteIndex
        let availableNextBytes = 0;
        if (myCurrentByteIndex > myByteArray.length) {
          console.warn(
            "askForStatus false.... myByteArray.length",
            myByteArray.length,
            "myCurrentByteIndex",
            myCurrentByteIndex,
            " You must handle this"
          );
          availableNextBytes = 0;
        } else if (myByteArray.length >= myCurrentByteIndex + 512)
          availableNextBytes = myCurrentByteIndex + 512;
        else availableNextBytes = myByteArray.length;

        console.log(
          "myCurrentByteIndex",
          myCurrentByteIndex,
          "availableNextBytes",
          availableNextBytes,
          "total length",
          myByteArray.length
        );
        if (availableNextBytes > 0) {
          console.log(
            "Write IT ===> FROM ",
            myCurrentByteIndex,
            "TO",
            availableNextBytes
          );
          console.hex(
            myByteArray.slice(myCurrentByteIndex, availableNextBytes)
          );

          this.device
            .controlTransferOut(
              {
                requestType: "class",
                recipient: "interface",
                request: 1,
                value: blockCounter,
                index: 0,
              },
              myByteArray.slice(myCurrentByteIndex, availableNextBytes)
            )
            .then((res) => {
              blockCounter += 1;
              console.log("RESULT writing BULK ", res);
              this.device
                .controlTransferIn(
                  {
                    requestType: "class",
                    recipient: "interface",
                    request: 3,
                    value: 0,
                    index: 0,
                  },
                  6
                )
                .then((res2) => {
                  console.log("RESULT Status of Device ", res2);
                  let arrayBuffer = res2.data.buffer;
                  let receivedData = new Uint8Array(arrayBuffer);
                  console.log(">>> Status ");
                  console.hex(receivedData);
                  if (receivedData[4] === 0x04 || receivedData[4] === 0x05) {
                    console.log(">>> Status stage 1");
                    if (receivedData[4] === 0x04) {
                      console.log(">>> Status stage 2");
                      let timeout =
                        ((receivedData[2] & 0xff) << 8) |
                        (receivedData[1] & 0xff);
                      setTimeout(() => {
                        console.log("wait for ", timeout, " milliseconds");
                        this.Update(myByteArray, blockCounter, true);
                      }, timeout);
                    } else {
                      console.log(">>> Status stage 3");
                      console.log("do it now...");
                      this.Update(myByteArray, blockCounter, false);
                    }
                  } else {
                    console.error("Something is wrong");
                    Promise.reject();
                  }
                });
            });
        } else {
          // Final Stage After finishing Application Firmware
          console.log("Finishing Application Firmware Upload - 1");
          return this.device
            .controlTransferOut(
              {
                requestType: "class",
                recipient: "interface",
                request: 1,
                value: blockCounter,
                index: 0,
              },
              new Uint8Array()
            )
            .then(() => {
              console.log("Finishing Application Firmware Upload - 2");
              this.device
                .controlTransferIn(
                  {
                    requestType: "class",
                    recipient: "interface",
                    request: 3,
                    value: 0,
                    index: 0,
                  },
                  6
                )
                .then(() => {
                  console.log("Finishing Application Firmware Upload - 3");
                  this.device.controlTransferIn(
                    {
                      requestType: "class",
                      recipient: "interface",
                      request: 3,
                      value: 0,
                      index: 0,
                    },
                    6
                  );
                })
                .then(() => {
                    console.log("finished!!!!!")
                    this.byteCount= 0
                    this.file= null
                    this.fileOk=false
                    this.bytes= []
                });
            });
        }
      }
    },
  },
};
</script>

<style>
</style>