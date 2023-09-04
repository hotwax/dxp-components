import { defineComponent } from "vue"
import { loginContext as context, useAuthStore, appContext } from "../index"
import { DateTime } from "luxon"

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

    const { token, oms, expirationTime } = this.route.query
    this.handleUserFlow(token, oms, expirationTime)
  },
  methods: {
    async handleUserFlow(token: string, oms: string, expirationTime: string) {
      // logout to clear current user state
      await context.logout()

      // checking if token from launchpad has expired and redirecting there only
      if (+expirationTime < DateTime.now().toMillis()) {
        console.error('User token has expired, redirecting to launchpad.')
        this.errorMsg = 'User token has expired, redirecting to launchpad.'
        const redirectUrl = window.location.origin + '/login' // current app URL
        window.location.href = `${context.appLoginUrl}?isLoggedOut=true&redirectUrl=${redirectUrl}`
        return
      }

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