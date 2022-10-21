<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="col-10">
      <q-card-section class="row items-center justify-center q-pt-xl">
        <q-avatar>
          <q-icon :name="authIcon" size="3rem" :color="authColor" />
        </q-avatar>
      </q-card-section>

      <q-tab-panels v-model="panel" animated>
        <q-tab-panel style="min-height: 360px" name="info" class="q-pa-none">
          <q-card-section class="row items-center justify-center text-center">
            <p class="text-weight-medium text-primary">
              Hoothoot is a fully anonymous chat app.
            </p>
            <p>
              We do not store any of your private data. You can use Hoothoot
              without a real identity.
            </p>
            <p>
              We use a cryptographic key pair to identify you. Enter your
              username to generate a new key pair or enter your passphrase to
              restore your key pair and sign in.
            </p>
          </q-card-section>
          <q-card-section
            class="row items-center justify-center absolute-bottom"
          >
            <q-btn
              color="primary"
              label="sign up"
              @click="panel = 'sign-up'"
              class="full-width q-mb-md"
              icon-right="chevron_right"
              align="between"
            />
            <q-btn
              color="primary"
              label="sign in"
              @click="panel = 'sign-in'"
              class="full-width"
              icon-right="key"
              align="between"
            />
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel style="min-height: 360px" name="sign-up" class="q-pa-none">
          <q-card-section class="row items-center justify-center">
            <div class="text-h5 text-weight-medium">sign up</div>
            <p>
              your username will be used to identify you in the chat. you can
              use a nickname.
            </p>
          </q-card-section>

          <q-card-section
            class="row items-center justify-center absolute-bottom"
          >
            <q-input
              outlined
              v-model="username"
              ref="inp_username"
              class="full-width q-mb-md"
              placeholder="enter username"
              :rules="rules.username"
            />

            <q-btn
              color="primary"
              label="sign up"
              @click="handleSignUp"
              class="full-width q-mb-md"
              icon-right="chevron_right"
              align="between"
            />

            <q-btn
              flat
              color="secondary"
              label="back"
              @click="handleReset"
              class="full-width"
              align="left"
            />
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel
          style="min-height: 360px"
          name="sign-up-key"
          class="q-pa-none"
        >
          <q-card-section class="row items-center justify-center text-center">
            <div class="text-h5 text-weight-medium">sign up success</div>
            <p>
              please note down the passphrase. you will have to use it for
              signing in next time. without the passphrase, you will have no way
              to access your account
            </p>
          </q-card-section>

          <q-card-section
            class="row items-center justify-center absolute-bottom"
          >
            <q-input
              outlined
              readonly
              v-model="passphrase"
              ref="inp_passphrase"
              class="full-width q-mb-md"
              placeholder="passphrase"
            />

            <q-btn
              color="negative"
              label="continue"
              @click="handleSignIn"
              class="full-width"
              icon-right="chevron_right"
              align="between"
            />
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel style="min-height: 360px" name="sign-in" class="q-pa-none">
          <q-card-section class="row items-center justify-center">
            <div class="text-h5 text-weight-medium">sign in</div>
            <p>please enter the passphrase you received when you signed up.</p>
          </q-card-section>

          <q-card-section
            class="row items-center justify-center absolute-bottom"
          >
            <q-input
              outlined
              v-model="passphrase"
              ref="inp_passphrase"
              class="full-width q-mb-md"
              placeholder="enter passphrase"
              type="password"
            />

            <q-btn
              color="primary"
              label="sign in"
              @click="handleSignIn"
              class="full-width q-mb-md"
              icon-right="chevron_right"
              align="between"
            />

            <q-btn
              flat
              color="secondary"
              label="back"
              @click="handleReset"
              class="full-width"
              align="left"
            />
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name="auth-success" class="q-pa-none">
          <q-card-section class="row items-center justify-center text-center">
            <div class="text-h6">{{ username }}</div>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name="auth-error" class="q-pa-none">
          <q-card-section class="row items-center justify-center">
            <q-btn
              flat
              color="secondary"
              label="try again"
              @click="handleReset"
              class="full-width"
              align="center"
            />
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import rules from '../utils/validation-rules'
import { signIn, signUp } from '../services/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'authPage',

  setup() {
    const panel = ref('info')
    const username = ref('')
    const inp_username = ref()

    const passphrase = ref('')

    const authIcon = ref('lock')
    const authColor = ref('negative')

    const router = useRouter()

    const handleSignUp = async () => {
      if (inp_username.value.validate()) {
        try {
          const user = await signUp(username.value)
          passphrase.value = user.passphrase
          panel.value = 'sign-up-key'
          authColor.value = 'warning'
        } catch (err) {
          panel.value = 'auth-error'
          authColor.value = 'negative'
          authIcon.value = 'error'
          console.error(err)
        }
      }
    }

    const handleSignIn = async () => {
      try {
        const user = await signIn(passphrase.value)
        if (user) {
          panel.value = 'auth-success'
          authColor.value = 'positive'
          authIcon.value = 'verified_user'

          username.value = user.username

          setTimeout(() => {
            router.push('/chats')
          }, 1500)
        } else {
          panel.value = 'auth-error'
          authColor.value = 'negative'
          authIcon.value = 'error'
        }
      } catch (err) {
        panel.value = 'auth-error'
        authColor.value = 'negative'
        authIcon.value = 'error'
        console.error(err)
      }
    }

    const handleReset = () => {
      panel.value = 'info'
      username.value = ''
      passphrase.value = ''
      authColor.value = 'negative'
      authIcon.value = 'lock'
    }

    return {
      authIcon,
      authColor,
      panel,
      username,
      inp_username,
      rules,
      passphrase,
      handleSignUp,
      handleSignIn,
      handleReset,
    }
  },
})
</script>
