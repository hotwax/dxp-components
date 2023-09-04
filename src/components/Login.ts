import { defineComponent } from "vue"
import { loginContext as context, useAuthStore, appContext } from "../index"
import { initialiseFirebaseApp } from "../firebase-utils"

export default defineComponent({
  template: `
            <div style='position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);'>
              <h4 v-if='errorMsg.length'> 
                {{ errorMsg }}
              </h4>
            </div>
            `,
  data() {
    return {
      errorMsg: '',
      authStore: {} as any,
      router: {} as any,
      route: {} as any,
    }
  },
  async mounted() {
    this.authStore = useAuthStore()
    this.router = appContext.config.globalProperties.$router
    this.route = appContext.config.globalProperties.$route

    if (!Object.keys(this.route.query).length) {
      window.location.href = context.appLoginUrl
      return
    }

    // initialising and connecting firebase app for notification support
    await initialiseFirebaseApp()

    const { token, oms, expirationTime } = this.route.query
    this.handleUserFlow(token, oms, expirationTime)
  },
  methods: {
    async handleUserFlow(token: string, oms: string, expirationTime: string) {
      // logout to clear current user state
      await context.logout()

      this.authStore.$patch({
        token: { value: token, expiration: expirationTime },
        oms
      })

      context.loader.present('Logging in')
      try {
        await context.login({ token, oms })
        this.router.push('/')
      } catch (error) {
        console.error(error)
        this.errorMsg = 'Unable to login. Please contact the administrator'
      } finally {
        context.loader.dismiss()
      }
    }
  }
})