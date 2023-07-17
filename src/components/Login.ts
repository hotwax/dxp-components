import { defineComponent, getCurrentInstance } from "vue"
import { loginContext as context, useAuthStore } from "../index"

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
      router: {} as any,
      route: {} as any,
      authStore: {} as any
    }
  },
  async mounted() {
    // exporting the same from index.ts through globalProperties does not work as expected
    const instance = getCurrentInstance() as any
    this.route = instance.appContext.config.globalProperties.$route
    this.router = instance.appContext.config.globalProperties.$router
    this.authStore = useAuthStore()
    if (!Object.keys(this.route.query).length) {
      this.errorMsg = 'Unable to login. Could not authenticate the user'
      return
    }
    
    const { token, oms, expirationTime } = this.route.query
    const { appToken, appOms, appExpirationTime } = await context.getUserTokenAndOms()

    // show alert if token/oms are different from the app's
    if ((appToken && token) && (appToken != token || appOms != oms)) {
      // pinia follows direct state manipulation anywhere
      this.authStore.$patch({
        token: { value: appToken, expiration: appExpirationTime },
        oms: appOms
      })
      await context.confirmSessionEnd('dev-oms').then((isConfirmed: boolean) => {
        isConfirmed
          ? this.handleUserFlow(token, oms, expirationTime)
          : this.router.push('/')
      })
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

      context.loader.present()
      try {
        await context.getAndSetUserDetails({ token, oms })
        this.router.replace({ path: '/' })
      } catch (error) {
        console.error(error)
        this.errorMsg = 'Unable to login. Please contact the administrator'
      } finally {
        context.loader.dismiss()
      }
    }
  }
})