import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers } from '@angular/http';

@Injectable()
export class ImageService {
    
  private query: string;
  private API_URL: string = 'https://images-api.nasa.gov/';
  private SEARCH_URL: string = this.API_URL + '/search?q='

  constructor(private http: Http) {
      
  }
  
  getImage(query){
      return this.http.get(this.SEARCH_URL + query).map(res => res.json());
  }
}
