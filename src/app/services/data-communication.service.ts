import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class DataCommunicationService {
  canUseCode:boolean=false;
  constructor(private httpClient:HttpClient) { }

  checkCodeUrl="https://shatranj-backend-9wbyg500w-sagardeep77.vercel.app?code=";
  webSocketUrl="http://shatranj-backend-9wbyg500w-sagardeep77.vercel.app"
  

  async checkCode(code):Promise<boolean>{
    const response = await this.httpClient.get(this.checkCodeUrl+code).toPromise().then((response)=>{
        let stringifiedResponse = JSON.stringify(response);
        this.canUseCode= <boolean>JSON.parse(stringifiedResponse).canUse;
        // console.log("canUSeCode-->",this.canUseCode);
    });
    return this.canUseCode;
  }
}
