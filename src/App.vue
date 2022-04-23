<template>
  <v-app>
    <div class="mx-4">
      <v-alert dismissible type="error" v-model="showErrorInput">
        Please input valid phone number and message.</v-alert
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
    };
  },
  methods: {
    phoneInput(formattedNumber, { number, valid }) {
      this.phoneNumber = number.e164;
      console.log(this.phoneNumber);
      this.phoneNumberisValid = valid;
    },

    async sendMessage() {
      if (!this.phoneNumberisValid || this.message == "") {
        this.showErrorInput = true;
        return;
      }

      console.log(this.phoneNumber);
      console.log(this.message);
      try {
        var response = await api.post(
          "https://vlq8i3k6bf.execute-api.us-east-1.amazonaws.com/dev/sendSms",
          { message: this.message, phone: this.phoneNumber }
        );
      } catch (e) {
        console.log("Error = " + e);
      }
    },
  },
};
</script>
<style>
input.heighttext {
  padding: 20px 10px;
  line-height: 28px;
}
</style>
