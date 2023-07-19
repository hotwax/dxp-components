import { defineComponent } from "vue"
import { loginContext as context, useAuthStore, appContext } from "../index"

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
      window.location.href = appContext.appLoginUrl
      return
    }

    const { token, oms, expirationTime } = this.route.query
    const appToken = this.authStore.token.value
    const appOms = this.authStore.oms
    const appExpirationTime = this.authStore.token.expiration
    
    // show alert if token/oms exist and are different from the app's
    if ((appToken && token) && (appToken != token || appOms != oms)) {
      // for backward compatibility
      this.authStore.$patch({
        token: { value: appToken, expiration: appExpirationTime },
        oms: appOms
      })
      context.confirmSessionEnd('dev-oms').then((isConfirmed: boolean) => {
        isConfirmed
          ? this.handleUserFlow(token, oms, expirationTime)
          : this.router.push('/')
      })
    } else {
      this.handleUserFlow(token, oms, expirationTime)
    }
  },
  methods: {
    async handleUserFlow(token: string, oms: string, expirationTime: string) {
      // logout to clear current user state
      await context.logout()

      // update the previously set values if the user opts ending the previous session
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