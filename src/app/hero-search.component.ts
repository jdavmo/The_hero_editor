    import { Component, OnInit } from '@angular/core';
    import { Router }            from '@angular/router';
     
    import { Observable }        from 'rxjs/Observable';
    import { Subject }           from 'rxjs/Subject';
     
    // Observable class extensions
    import 'rxjs/add/observable/of';
     
    // Observable operators
    import 'rxjs/add/operator/catch';
    import 'rxjs/add/operator/debounceTime';
    import 'rxjs/add/operator/distinctUntilChanged';
     
    import { HeroSearchService } from './hero-search.service';
    import { Hero } from './hero';
     
    @Component({
      selector: 'hero-search',
      templateUrl: './hero-search.component.html',
      styleUrls: [ './hero-search.component.css' ],
      providers: [HeroSearchService]
    })
    
    export class HeroSearchComponent implements OnInit {
      heroes: Observable<Hero[]>;
      private searchTerms = new Subject<string>();
     
      constructor(
        private heroSearchService: HeroSearchService,
        private router: Router) {}
     
      //netx() pone una cadena en el flujo del observable
      search(term: string): void {
        this.searchTerms.next(term);
        console.log(term);
        console.log("Observable");
        console.log(this.searchTerms);
      }

      test(term: any){
            console.log("En el switchMap");
            console.log(term);
            return term  
            //condicional devuelve la búsqueda HTTP observable 
            ? this.heroSearchService.search(term)

            //o el observable de los héroes vacíos si no había término de búsqueda
            : Observable.of<Hero[]>([])
      }
     
      ngOnInit(): void {
        //Aqui lo que ago es asignar el Subject searchTerms que es un observable a Heroes 
        //y le agrego propiedades
        this.heroes = this.searchTerms
          .debounceTime(300)    //Espere 300 ms después de cada pulsación antes de considerar el término    
          .distinctUntilChanged()  //No volver a consultar si no hay cambios en la consulta
          .switchMap(term => this.test(term))
          .catch(error => {
            console.log(error);
            return Observable.of<Hero[]>([]);
          });


      }
       


      gotoDetail(hero: Hero): void {
        let link = ['/detail', hero.id];
        this.router.navigate(link);
      }
    }