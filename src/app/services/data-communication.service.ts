import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class DataCommunicationService {
  canUseCode:boolean=false;
  constructor(private httpClient:HttpClient) { }

  // checkCodeUrl="http://localhost:4000?code=";
  // webSocketUrl="http://localhost:4000"
  
  checkCodeUrl="https://shatranj-backend-purple-moon-6895.fly.dev/?code=";
  webSocketUrl="https://shatranj-backend-purple-moon-6895.fly.dev/"
  
  async checkCode(code):Promise<boolean>{
    const response = await this.httpClient.get(this.checkCodeUrl+code).toPromise().then((response)=>{
        let stringifiedResponse = JSON.stringify(response);
        this.canUseCode= <boolean>JSON.parse(stringifiedResponse).canUse;
        // console.log("canUSeCode-->",this.canUseCode);
    });
    return this.canUseCode;
  }
}
