<template>
  <ion-tab-button tab="help" id="gibook-search-modal">
    <ion-icon :icon="helpOutline" />
    <ion-label>{{ translate("Help") }}</ion-label>
  </ion-tab-button>

  <!-- Using inline modal(as recommended by ionic), also using it inline as the component inside modal is not getting mounted when using modalController -->
  <ion-modal ref="gitBookSearchModal" trigger="gibook-search-modal" @willDismiss="clearQueryState()">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal"> 
            <ion-icon :icon="close" slot="icon-only" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ translate("Ask me anything?") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar :placeholder="translate(selectedSegment === 'search' ? 'Search...': 'Ask...')" :value="queryString" @keyup.enter="queryString = $event.target.value; selectedSegment === 'search' ? searchQuery() : askQuery()" />

      <ion-segment v-model="selectedSegment" @ionChange="updateSegment()">
        <ion-segment-button value="search">
          <ion-label>{{ translate("Search") }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="ask">
          <ion-label>{{ translate("Ask") }}</ion-label>
        </ion-segment-button>
      </ion-segment>

      <div class="empty-state" v-if="isLoading">
        <ion-item lines="none">
          <ion-spinner name="crescent" slot="start" />
          {{ translate(selectedSegment === 'search' ? "Searching your query." : "Analyzing the question to answer your question.") }}
        </ion-item>
      </div>

      <template v-else>
        <template v-if="selectedSegment === 'search'">
          <template v-if="searchedItems.length">
            <div v-for="(item, index) in searchedItems" :key="index">
              <ion-item>
                <ion-icon :icon="documentOutline" slot="start" />
                <ion-label>{{ item.title }}</ion-label>
                <ion-button fill="clear" color="medium" slot="end" @click="redirectToDoc(item)">
                  <ion-icon :icon="returnDownBackOutline" slot="start" />
                  {{ translate("go to page") }}
                </ion-button>
              </ion-item>

              <template v-if="item.sections.length">
                <ion-item v-for="(section, index) in item.sections" :key="index" class="ion-padding-left">
                  <ion-icon :icon="returnDownForwardOutline" slot="start" />
                  <ion-label>
                    <div class="item-header">
                      <vue-markdown :source="section.title ? section.title : item.title" />
                      <ion-button fill="clear" color="medium" slot="end" @click="redirectToDoc(section)">
                        <ion-icon :icon="returnDownBackOutline" slot="start" />
                        {{ translate("go to section") }}
                      </ion-button>
                    </div>
                    <p class="truncate"><vue-markdown :source="section.body" /></p>
                  </ion-label>
                </ion-item>
              </template>
            </div>
          </template>
          <div class="empty-state" v-else-if="queryString">
            <ion-item lines="none">
              {{ translate("No page found.") }}
            </ion-item>
          </div>
        </template>

        <template v-else-if="selectedSegment === 'ask'">
          <template v-if="answer && Object.keys(answer).length">
            <ion-item lines="none">
              <ion-label>{{ queryString }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <p><vue-markdown :source="answer.text" /></p>
              </ion-label>
            </ion-item>

            <ion-item v-if="answer.sources.length" button @click="!isResourceFetched ? fetchSources() : ''">
              <ion-label>
                <p>{{ translate("Answer based on resources", { count: answer.sources.length }) }}</p>
              </ion-label>
              <ion-icon :icon="sources.length ? caretDownOutline : caretForwardOutline" />
            </ion-item>

            <div class="empty-state" v-if="isResourceLoading">
              <ion-item lines="none">
                <ion-spinner name="crescent" slot="start" />
                {{ translate("Fetching resources...") }}
              </ion-item>
            </div>

            <ion-list v-else-if="sources.length">
              <ion-item v-for="source in sources" :key="source.title">
                <ion-label>{{ source.title }}</ion-label>
                <ion-button fill="clear" color="medium" slot="end" @click="redirectToDoc(source)">
                  <ion-icon :icon="returnDownBackOutline" slot="start" />
                  {{ translate("go to page") }}
                </ion-button>
              </ion-item>
            </ion-list>

            <ion-item v-else-if="isResourceFetched">
              <ion-label>
                <p>{{ translate("No resource found.") }}</p>
              </ion-label>
            </ion-item>

            <template v-if="answer.followupQuestions.length">
              <ion-item lines="none">
                <ion-label>
                  <p>{{ translate("Related Queries") }}</p>
                </ion-label>
              </ion-item>

              <ion-item lines="none" v-for="(question, index) in answer.followupQuestions" :key="index"  @click="searchRelatedQuestion(question)">
                <ion-chip>
                  <ion-icon :icon="searchOutline" />
                  <ion-label>{{ question }}</ion-label>
                </ion-chip>
              </ion-item>
            </template>
          </template>
          <div class="empty-state" v-else-if="queryString">
            <ion-item lines="none">
              {{ translate("No answer found.") }}
            </ion-item>
          </div>
        </template>
      </template>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonSearchbar, IonSegment, IonSegmentButton, IonSpinner, IonTabButton, IonTitle, IonToolbar, modalController } from "@ionic/vue";
import { ref } from "vue";
import { caretForwardOutline, caretDownOutline, close, documentOutline, helpOutline, returnDownBackOutline, returnDownForwardOutline, searchOutline } from "ionicons/icons";
import { translate } from "src";
import { hasError } from "@hotwax/oms-api";
import VueMarkdown from 'vue-markdown-render';
import { gitBookContext } from "../index"

const gitBookSearchModal = ref();

const selectedSegment = ref("search");
let queryString = ref("")
let searchedItems = ref([]) as any;
const answer = ref({}) as any;

const isLoading = ref(false);

const isResourceLoading = ref(false);
const sources = ref([]) as any;
const isResourceFetched = ref(false);

declare var process: any;

function closeModal() {
  gitBookSearchModal.value.$el.dismiss(null, 'cancel');
}

function updateSegment() {
  queryString.value = "";
  searchedItems.value = [];
  answer.value = {};
}

async function askQuery() {
  isLoading.value = true;
  let response = {} as any;

  try {
    const resp = await gitBookContext.askQuery({ 
      queryString: queryString.value,
      spaceId: process.env.VUE_APP_SPACE_ID,
      baseURL: process.env.VUE_APP_GITBOOK_BASE_URL,
      token: process.env.VUE_APP_GITBOOK_API_KEY
    });

    if(!hasError(resp)) {
      response = resp.data.answer;
      sources.value = []
      isResourceFetched.value = false
    } else {
      throw resp.data;
    }
  } catch(error: any) {
    console.error(error);
  }
  answer.value = response;
  isLoading.value = false;
}

async function searchQuery() {
  isLoading.value = true;
  let items = [] as any;

  const baseURL = process.env.VUE_APP_GITBOOK_BASE_URL

  try {
    const resp = await gitBookContext.searchQuery({
      queryString: queryString.value,
      spaceId: process.env.VUE_APP_SPACE_ID,
      baseURL,
      token: process.env.VUE_APP_GITBOOK_API_KEY
    });

    if(!hasError(resp)) {
      items = resp.data.items;
    } else {
      throw resp.data;
    }
  } catch(error: any) {
    console.error(error);
  }
  searchedItems.value = items
  isLoading.value = false;
}

async function fetchSources() {
  isResourceLoading.value = true;
  const list = [] as any;

  const responses = await (Promise as any).allSettled(answer.value.sources.map((source: any) => {
    if(source.type === "page") {
      return gitBookContext.getGitBookPage({
        pageId: source.page,
        spaceId: process.env.VUE_APP_SPACE_ID,
        baseURL: process.env.VUE_APP_GITBOOK_BASE_URL,
        token: process.env.VUE_APP_GITBOOK_API_KEY
      });
    }
  }))

  responses.map((response: any) => {
    if(response.status === "fulfilled") {
      list.push(response.value.data)
    }
  })

  sources.value = list
  isResourceLoading.value = false
  isResourceFetched.value = true
}

function redirectToDoc(item: any) {
  window.open(`https://docs.hotwax.co/user-guides/${item.path}`, "_blank")
}

function searchRelatedQuestion(question: string) {
  queryString.value = question;
  askQuery()
}

function clearQueryState() {
  selectedSegment.value = "search";
  queryString.value = "";
  searchedItems.value = [];
  answer.value = {};

  isLoading.value = false;

  isResourceLoading.value = false;
  sources.value = [];
  isResourceFetched.value = false;
}
</script>