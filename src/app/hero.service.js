"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var HeroService = (function () {
    function HeroService(http) {
        this.http = http;
        this.moviesUrl = 'api.themoviedb.org/';
        this.movieImages = 'image.tmdb.org/t/p/w500';
        this.apiKey = '802cd9bec58e75474a66bfa717fd1106';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.heroesUrl = 'api/heroes'; // URL para la api web
    }
    HeroService.prototype._normalizeEndpoint = function (version) {
        return { 'url': this.moviesUrl + version,
            'apiKey': this.apiKey };
    };
    HeroService.prototype.Discover = function () {
        var serviceVersion = "3";
        var serviceBase = this._normalizeEndpoint(serviceVersion);
        console.log(serviceBase);
        /* http://docs.themoviedb.apiary.io/reference/discover/discovermovie */
        var movieList = function (sortBy, page, includeAdult) {
            if (sortBy === undefined) {
                sortBy = 'popularity.desc';
            }
            if (page === undefined) {
                page = 1;
            }
            if (includeAdult === undefined) {
                includeAdult = 'false';
            }
            var uri = serviceBase.url + '/discover/movie?page=' + page + '&include_adult=' + includeAdult + '&sort_by=' + sortBy + '&api_key=' + serviceBase.apiKey;
            return this.http.get("//api.themoviedb.org/3/discover/movie?page=1&include_adult=false&sort_by=popularity.desc&api_key=802cd9bec58e75474a66bfa717fd1106");
        };
        /* http://docs.themoviedb.apiary.io/reference/discover/discovertv */
        var televisionList = function (sortBy, page) {
            if (sortBy === undefined) {
                sortBy = 'popularity.desc';
            }
            if (page === undefined) {
                page = 1;
            }
            var uri = serviceBase.url + '/discover/tv?page=' + page + '&sort_by=' + sortBy + '&api_key=' + serviceBase.apiKey;
            return this.http.get(uri);
        };
        return {
            discover: {
                movies: movieList,
                tv: televisionList
            }
        };
    };
    //http.get es un observable, el .toPromise lo convierte en una promesa, RxJS amplia los operadores del observable
    HeroService.prototype.getHeroes = function () {
        var list = [];
        console.log("Prueba Servicio Movie List");
        this.http.get('http://api.themoviedb.org/3/discover/movie%3Fpage=1&include_adult=false&sort_by=popularity.desc&api_key=802cd9bec58e75474a66bfa717fd1106')
            .toPromise()
            .then(function (response) { return response.json().data; }).catch(this.handleError);
        console.log("list: ", list);
        return this.http.get(this.heroesUrl)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    HeroService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    // getHeroes(): Promise<Hero[]> {
    // 	return Promise.resolve(HEROES);
    // }
    HeroService.prototype.getHeroesSlowly = function () {
        var _this = this;
        return new Promise(function (resolve) {
            // Simulate server latency with 2 second delay
            setTimeout(function () { return resolve(_this.getHeroes()); }, 2000);
            console.log(resolve);
        });
    };
    //URL servicio para extraer hero por el id api/hero/:id por medio de un get-by-id request
    HeroService.prototype.getHero = function (id) {
        var url = this.heroesUrl + "/" + id;
        return this.http.get(url)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    // getHero(id: number): Promise<Hero> {
    // 	return this.getHeroes()
    // 	.then(heroes => heroes.find(hero => hero.id === id));
    // }
    HeroService.prototype.update = function (hero) {
        var url = this.heroesUrl + "/" + hero.id;
        return this.http.put(url, JSON.stringify(hero), { headers: this.headers })
            .toPromise()
            .then(function () { return hero; })
            .catch(this.handleError);
    };
    HeroService.prototype.create = function (name) {
        return this.http.post(this.heroesUrl, JSON.stringify({ name: name }), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    HeroService.prototype.delete = function (id) {
        var url = this.heroesUrl + "/" + id;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(function () { return null; })
            .catch(this.handleError);
    };
    return HeroService;
}());
HeroService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], HeroService);
exports.HeroService = HeroService;
//# sourceMappingURL=hero.service.js.map