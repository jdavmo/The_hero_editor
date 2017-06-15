import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';


@Injectable()
export class HeroService {
	private headers = new Headers({'Content-Type': 'application/json'});
    private heroesUrl = 'api/heroes';  // URL para la api web
     
    constructor(private http: Http) { }
    
    //http.get es un observable, el .toPromise lo convierte en una promesa, RxJS amplia los operadores del observable
    getHeroes(): Promise<Hero[]> {
    	console.log("Hola");

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

