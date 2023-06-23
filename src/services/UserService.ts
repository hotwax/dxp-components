import { api } from "@hotwax/oms-api";

const login = async (username: string, password: string): Promise<any> => {
  return api({
    url: "login",
    method: "post",
    data: {
      'USERNAME': username,
      'PASSWORD': password
    }
  });
}


export const UserService = {
  login
}