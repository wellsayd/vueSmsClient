<template>
  <v-app>
    <div class="mx-4">
      <v-alert dismissible type="error" v-model="showErrorInput">
        Please check your phone and email inputs.</v-alert
      >

      <vue-tel-input-vuetify
        defaultCountry="US"
        v-model="phoneNumber"
        :onlyCountries="['US']"
        @input="phoneInput"
      ></vue-tel-input-vuetify>

      <v-text-field
        v-model="message"
        label="Enter text message here"
        clearable
        class="shrink"
      ></v-text-field>
      <v-btn elevation="2" v-on:click="sendMessage">Send Message</v-btn>

      <v-textarea
        name="input-7-1"
        v-model="conversationToString"
        hint="Hint text"
      ></v-textarea>
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
      conversation: [],
      connection: null,
    };
  },
  computed: {
    conversationToString: {
      get() {
        return this.conversation.join("\r");
      },
    },
  },

  methods: {
    parseReceivedMessage(event) {
      try {
        var data = JSON.parse(event.data);
        console.log(data.Records);
        for (var i = 0; i < data.Records.length; i++) {
          console.log(data.Records[i].dynamodb.NewImage.message.S);

          this.conversation.push(
            data.Records[i].dynamodb.NewImage.phone.S +
              " responded: " +
              data.Records[i].dynamodb.NewImage.message.S
          );
        }
      } catch (error) {
        console.log("error = " + error);
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

      try {
        await api.post(
          "https://vlq8i3k6bf.execute-api.us-east-1.amazonaws.com/dev/sendSms",
          { message: this.message, phone: this.phoneNumber }
        );

        this.conversation.push(this.phoneNumber + " sent: " + this.message);
      } catch (e) {
        console.log("Error = " + e);
        this.showErrorInput = true;
      }
    },
  },

  /**
   * Page has mounted
   */
  created() {
    var connection = new WebSocket(
      "wss://2bqssjlvja.execute-api.us-east-1.amazonaws.com/production"
    );

    connection.onmessage = function (event) {
      console.log("event = " + JSON.stringify(event));
    };

    connection.onopen = function (event) {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
    };

    connection.addEventListener(
      "message",
      this.parseReceivedMessage.bind(this)
    );
  },
};
</script>
<style></style>
