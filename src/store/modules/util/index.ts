import getters from './getters'
import { Module } from 'vuex'
import UtilState from './UtilState'
import RootState from '@/store/RootState'

const utilModule: Module<UtilState, RootState> = {
  namespaced: true,
  state: {
    packageVersion: process.env.PACKAGE_VERSION || '0'
  },
  getters
}

export default utilModule;