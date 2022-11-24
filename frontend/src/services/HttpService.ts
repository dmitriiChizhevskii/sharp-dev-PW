/*
  All the reuests to backend are here
*/
export default class HttpService {

  token?:string;

  constructor(private endpoint:string, private subscriber: (value: string) => void) {}

  setToken(str:string) {
    this.token = str;
  }

  send = (path:string, body:Object = {}, token?:string) => fetch(`${this.endpoint}/${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || this.token}`
    },
    body: JSON.stringify(body),
  })
    .then(async response => {
      if (response.status === 401) {
        localStorage.clear();
        return;
      }
      if (response.status !== 200 && response.status !== 201) {
        try {
          const ans = await response.json();
          this.subscriber(`${ans.message}`);
        } catch (e) {
          this.subscriber(`${response.status} ${response.statusText} ${response.url}`);
        }
      
      
        return Promise.reject()
      }
      return response.json();
    });
}