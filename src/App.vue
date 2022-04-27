<template>
  <v-app>
    <div class="mx-4">
      <v-alert dismissible type="error" v-model="showErrorInput">
        Please check your phone and email inputs.</v-alert
      >
      <v-toolbar color="blue" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>Sender</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <vue-tel-input-vuetify
        defaultCountry="US"
        v-model="phoneNumber"
        :onlyCountries="['US']"
        @input="phoneInput"
        clearable
      ></vue-tel-input-vuetify>

      <v-text-field
        v-model="message"
        label="Enter text message here"
        clearable
        class="shrink"
      ></v-text-field>
      <v-btn elevation="2" v-on:click="sendMessage">Send Message</v-btn>
      <br /><br />
      <v-divider></v-divider>
      <br /><br />
      <v-toolbar color="blue" dark v-if="conversation.length > 0">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>Receiver</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list two-line>
        <v-list-item-group active-class="pink--text" multiple>
          <template v-for="(item, index) in conversation">
            <v-list-item :key="item.title">
              <template>
                <v-list-item-content>
                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.message"
                    :style="createColor(item.phone)"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="item.phone"
                    :style="createColor(item.phone)"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-list-item>

            <v-divider
              v-if="index < conversation.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </div>
  </v-app>
</template>

<script>
import api from "@/utils/api.js";

export default {
  name: "App",

  data() {
    return {
      message: "",
      phoneNumber: "",
      phoneNumberisValid: false,
      showErrorInput: false,
      connection: null,
      connectionId: null,
      conversation: [],
      received: false,
    };
  },

  methods: {
    createColor(text) {
      var color = parseInt(text, 16).toString();
      color = color.substring(0, 6);
      return "color: #" + color + "!important; font-size: 1.25em";
    },

    // ran out of time, but not stoked on this part ...
    parseReceivedMessage(event) {
      try {
        var data = JSON.parse(event.data);
        var phoneToFind = data.Records[0].dynamodb.NewImage.phone.S;
        let check = this.conversation.find((el) => el.phone === phoneToFind);

        if (
          check != undefined ||
          (this.received === true &&
            this.conversation.find(
              (el) => el.phone === data.Records[0].dynamodb.OldImage.message.S
            ) != undefined)
        ) {
          for (var i = 0; i < data.Records.length; i++) {
            this.conversation.push({
              message: data.Records[i].dynamodb.NewImage.message.S,
              phone: data.Records[i].dynamodb.NewImage.phone.S,
            });
            this.received = true;
          }
        }
      } catch (error) {
        // console.log("2 error ===== " + error);
      }
    },
    phoneInput(formattedNumber, { number, valid }) {
      this.phoneNumber = number.e164;
      this.phoneNumberisValid = valid;
    },

    async sendMessage() {
      if (!this.phoneNumberisValid || this.message == "") {
        this.showErrorInput = true;
        return;
      }

      this.showErrorInput = false;

      try {
        await api.post(
          "https://vlq8i3k6bf.execute-api.us-east-1.amazonaws.com/dev/sendSms",
          {
            message: this.message,
            phone: this.phoneNumber,
            connectionId: this.connectionId,
          }
        );

        this.conversation.push({
          message: this.message,
          phone: this.phoneNumber,
        });
      } catch (e) {
        // console.log("Error = " + e);
        this.showErrorInput = true;
      }
    },
  },

  /**
   * Page has mounted
   */
  created() {
    var that = this;

    this.connection = new WebSocket(
      "wss://2bqssjlvja.execute-api.us-east-1.amazonaws.com/production"
    );

    this.connection.onmessage = function (event) {
      if (event.data) {
        var eventData = JSON.parse(event.data);
        that.connectionId = eventData.connectionId;
      }
    };

    this.connection.onopen = function () {
      var message = {
        action: "getConnectionsId",
      };
      this.send(JSON.stringify(message));
    };

    this.connection.addEventListener(
      "message",
      this.parseReceivedMessage.bind(this)
    );
  },
};
</script>
<style></style>
