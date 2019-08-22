import axios from './http'

export default class ReptileBaseComponent {
  constructor() {
    this.callApi = axios
  }
}
