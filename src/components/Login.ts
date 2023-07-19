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
      authStore: {} as any
    }
  },
  async mounted() {
    this.authStore = useAuthStore()
    const queryParams = new URLSearchParams(window.location.search);
    const queryParamsObj = Object.fromEntries(queryParams.entries());
    if (!Object.keys(queryParamsObj).length) {
      this.errorMsg = 'Unable to login. Could not authenticate the user'
      return
    }

    const { token, oms, expirationTime } = queryParamsObj
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
      await context.confirmSessionEnd('dev-oms').then((isConfirmed: boolean) => {
        isConfirmed
          ? this.handleUserFlow(token, oms, expirationTime)
          : window.location.href = window.location.origin
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
        window.location.href = window.location.origin
      } catch (error) {
        console.error(error)
        this.errorMsg = 'Unable to login. Please contact the administrator'
      } finally {
        context.loader.dismiss()
      }
    }
  }
})