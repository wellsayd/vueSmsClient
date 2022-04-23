<template>
  <v-app>
    <div class="mx-4">
      <v-alert dismissible type="error"
        >Please input valid phone number and message.</v-alert
      >

      <vue-tel-input-vuetify
        v-model="phone"
        :onlyCountries="['US']"
      ></vue-tel-input-vuetify>

      <v-text-field
        v-model="message1"
        label="Enter text message here"
        clearable
        class="shrink"
      ></v-text-field>
      <v-btn elevation="2">Send Message</v-btn>
    </div>
  </v-app>
</template>

<script>
import api from "@/utils/api.js";

export default {
  name: "App",

  data() {
    return {
      phoneNumber: null,
      payload: false,
    };
  },
  methods: {
    update() {
      console.log(this.payload.nationalNumber);
      console.log(this.payload.isValid);
    },
    async sendMessage() {
      if (!this.payload.isValid) {
        alert("nope");
        return;
      }
      try {
        var response = await api.post(
          "https://vlq8i3k6bf.execute-api.us-east-1.amazonaws.com/dev/sendSms",
          { message: "brian", phone: "+17576791881" }
        );
        console.log("response = " + JSON.stringify(response));
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
