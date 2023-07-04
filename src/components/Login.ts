import { defineComponent, getCurrentInstance } from "vue"
import { getAndSetUserDetails, useAuthStore, getUserTokenAndOms, confirmSessionEnd, loader, logout } from "../index"

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
    
    const { token, oms } = this.route.query
    const { appToken, appOms } = await getUserTokenAndOms()

    // show alert if token/oms are different from the app's
    if ((appToken && appToken) && (appToken != token || appOms != oms)) {
      // pinia follows direct state manipulation anywhere
      this.authStore.$patch({
        token: { value: appToken, expiry: null },
        oms: appOms
      })
      await confirmSessionEnd(appOms, this.handleUserFlow, oms, token)
      return
    }
    this.handleUserFlow(token, oms)
  },
  methods: {
    async handleUserFlow(token: string, oms: string) {
      // logout to clear current user state
      await logout()

      // update the previously set values if the user opts ending the previous session
      this.authStore.$patch({
        token: { value: token, expiry: null },
        oms
      })

      loader.present()
      try {
        await getAndSetUserDetails({ token, oms })
        this.router.replace({ path: '/' })
      } catch (error) {
        console.error(error)
        this.errorMsg = 'Unable to login. Please contact the administrator'
      } finally {
        loader.dismiss()
      }
    }
  }
})