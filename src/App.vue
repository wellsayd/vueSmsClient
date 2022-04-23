<template>
  <div id="app">
    <VuePhoneNumberInput
      v-model="phoneNumber"
      :only-countries="['US']"
      @update="payload = $event"
      @input="update()"
    />

    <button v-on:click="sendMessage">SEND MESSAGE</button>
    <textarea />
  </div>
</template>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import api from "@/utils/api.js";

export default {
  name: "App",
  components: { VuePhoneNumberInput },
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
<style></style>
