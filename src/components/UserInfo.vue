<template>
  <ion-card>
    <ion-item lines="full">
      <ion-avatar slot="start" v-if="user?.partyImageUrl">
        <Image :src="user.partyImageUrl"/>
      </ion-avatar>
      <!-- ion-no-padding to remove extra side/horizontal padding as additional padding 
      is added on sides from ion-item and ion-padding-vertical to compensate the removed
      vertical padding -->
      <ion-card-header class="ion-no-padding ion-padding-vertical">
        <ion-card-subtitle>{{ user?.userLoginId }}</ion-card-subtitle>
        <ion-card-title>{{ user?.partyName }}</ion-card-title>
      </ion-card-header>
    </ion-item>
    <ion-button color="danger">{{ "Logout" }}</ion-button>
    <ion-button fill="outline">
      {{ "Go to Launchpad" }}
    </ion-button>
  </ion-card>
</template>

<script setup lang="ts">
defineProps(["user"])
</script>