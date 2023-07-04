import { client } from "@hotwax/oms-api";

const login = async (username: string, password: string): Promise<any> => {
  // TODO - use api after fixing the baseUrl issue
  return client({
    url: "login",
    method: "post",
    data: {
      'USERNAME': username,
      'PASSWORD': password
    },
    baseURL: 'https://dev-oms.hotwax.io/api'
  });
}


export const UserService = {
  login
}