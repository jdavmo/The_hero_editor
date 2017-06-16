import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';


@Injectable()
export class HeroService {
	constructor(private http: Http) { }

	private moviesUrl = 'api.themoviedb.org/';
	private movieImages = 'image.tmdb.org/t/p/w500';
	private apiKey = '802cd9bec58e75474a66bfa717fd1106';

	_normalizeEndpoint(version: string): any {
	    return {'url':  this.moviesUrl + version,
	            'apiKey': this.apiKey};
	}


	Discover(): any {
        var serviceVersion = "3";
        var serviceBase    = this._normalizeEndpoint( serviceVersion);

        console.log(serviceBase);

        /* http://docs.themoviedb.apiary.io/reference/discover/discovermovie */
        var movieList = function ( sortBy, page, includeAdult ) {
            if ( sortBy === undefined ) {
                sortBy = 'popularity.desc';
            }
            if ( page === undefined ) {
                page = 1;
            }
            if ( includeAdult === undefined ) {
                includeAdult = 'false';
            }
            var uri = serviceBase.url + '/discover/movie?page=' + page + '&include_adult=' + includeAdult + '&sort_by=' + sortBy + '&api_key=' + serviceBase.apiKey;
            return this.http.get( "//api.themoviedb.org/3/discover/movie?page=1&include_adult=false&sort_by=popularity.desc&api_key=802cd9bec58e75474a66bfa717fd1106" );
        };

        /* http://docs.themoviedb.apiary.io/reference/discover/discovertv */
        var televisionList = function ( sortBy, page ) {
            if ( sortBy === undefined ) {
                sortBy = 'popularity.desc';
            }
            if ( page === undefined ) {
                page = 1;
            }
            var uri = serviceBase.url + '/discover/tv?page=' + page + '&sort_by=' + sortBy + '&api_key=' + serviceBase.apiKey;
            return this.http.get( uri );
        };

        return {
            discover: {
                movies: movieList,
                tv: televisionList
            }
        };
     
    }


	private headers = new Headers({'Content-Type': 'application/json'});
    private heroesUrl = 'api/heroes';  // URL para la api web

     
    
    
    //http.get es un observable, el .toPromise lo convierte en una promesa, RxJS amplia los operadores del observable
    getHeroes(): Promise<Hero[]> {
    	
    	var list = [];
    	
    	console.log("Prueba Servicio Movie List");

    	this.http.get('http://api.themoviedb.org/3/discover/movie%3Fpage=1&include_adult=false&sort_by=popularity.desc&api_key=802cd9bec58e75474a66bfa717fd1106')
    	.toPromise()
    	.then(response => response.json().data as list[]).catch(this.handleError);

    	console.log("list: "list);

		return this.http.get(this.heroesUrl)
		         .toPromise()
		         .then(response => response.json().data as Hero[])
		         .catch(this.handleError);

    }

     
    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); 
      return Promise.reject(error.message || error);
    }

	// getHeroes(): Promise<Hero[]> {
	// 	return Promise.resolve(HEROES);
	// }

	getHeroesSlowly(): Promise<Hero[]> {
		return new Promise(resolve => {
		// Simulate server latency with 2 second delay
			setTimeout(() => resolve(this.getHeroes()), 2000);
			console.log(resolve);
		});

	}

	//URL servicio para extraer hero por el id api/hero/:id por medio de un get-by-id request
	getHero(id: number): Promise<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json().data as Hero)
			.catch(this.handleError);
	}

	// getHero(id: number): Promise<Hero> {
	// 	return this.getHeroes()
	// 	.then(heroes => heroes.find(hero => hero.id === id));
	// }

	update(hero: Hero): Promise<Hero> {
		const url = `${this.heroesUrl}/${hero.id}`;
		return this.http.put(url, JSON.stringify(hero), {headers: this.headers})
			.toPromise()
			.then(() => hero)
			.catch(this.handleError);
	}

	create(name: string): Promise<Hero> {
		return this.http.post(this.heroesUrl, JSON.stringify({name: name}), {headers: this.headers})
			.toPromise()
			.then(res => res.json().data as Hero)
			.catch(this.handleError);
	}

	delete(id: number): Promise<void> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.delete(url, {headers: this.headers})
			.toPromise()
			.then(() => null)
			.catch(this.handleError);
	}
}

