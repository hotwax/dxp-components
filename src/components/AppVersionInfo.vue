<template>
  <div class="section-header">
    <div>
      <h1>{{ $t('App') }}</h1>
      <p class="overline">{{ "Version: " + appVersion }}</p>
    </div>
    <p class="overline">{{ "Built: " + getDateTime(appInfo.builtTime) }}</p>
  </div>
</template>
  
<script setup lang="ts">
import { DateTime } from 'luxon';

declare var process: any;

const appInfo = (process.env.VUE_APP_VERSION_INFO ? JSON.parse(process.env.VUE_APP_VERSION_INFO) : {}) as any;
const appVersion = appInfo.branch ? (appInfo.branch + "-" + appInfo.revision) : appInfo.tag;
const getDateTime = (time: any) => DateTime.fromMillis(time).toLocaleString(DateTime.DATETIME_MED);
</script>