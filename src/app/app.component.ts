import { Component } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';
import { OnInit } from '@angular/core';
import { HEROES } from './mock-heroes';


@Component({
  selector: 'my-app',
  template: `
	<h1>{{title}}</h1>
	<nav>
		 <a routerLink="/dashboard">Dashboard</a>
		 <a routerLink="/heroes">Heroes</a>
	</nav>
	<router-outlet></router-outlet>

  `
})

export class AppComponent {
  title = 'Tour of Heroes';
}