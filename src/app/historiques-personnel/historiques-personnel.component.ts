import { Component, OnDestroy, OnInit } from '@angular/core';
import { AvancementService } from '../Services/avancement.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-historiques-personnel',
  templateUrl: './historiques-personnel.component.html',
  styleUrls: ['./historiques-personnel.component.css']
})
export class HistoriquesPersonnelComponent  implements OnInit , OnDestroy{
  showLoader: boolean = true; // Contrôle l'affichage du chargement
  id : string="" ; 
  private routerSubscription: Subscription;
  constructor(private router: Router , public service : AvancementService  , private ar: ActivatedRoute)  { 
    // Subscribe to router events to handle page navigation
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveNavLink();
      }
    });
  }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    console.log("iddddd" +this.id)
    // Appel à une fonction pour masquer le chargement après quelques secondes
    setTimeout(() => {
      this.hideLoader();
    }, 3000); // Délai de 3 secondes (ajustez selon vos besoins)
    /**************************************/
  
    this.initializeNavbarAnimation();
    $(window).on('resize', this.onWindowResize.bind(this));
    $(".navbar-toggler").on('click', this.onNavbarToggle.bind(this));
    const loaderElement = document.getElementById('loader');
  if (loaderElement) {
    setTimeout(() => {
      loaderElement.style.display = 'none';
    }, 3000);
  } else {
    console.warn('Element with ID "loader" not found.');
  }
  }
  hideLoader(): void {
    this.showLoader = false;
  }

  ngOnDestroy(): void {
    // Clean up to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    $(window).off('resize', this.onWindowResize);
    $(".navbar-toggler").off('click', this.onNavbarToggle);
  }

  getAvancementPersonnel(){
    this.service.getAvancementPersonnel(this.id).subscribe(data => {
      this.service.AvancementsPersonnel = data;
      $(document).ready(function () {
        $('#example').DataTable();
      });
    });
  }
  private initializeNavbarAnimation(): void {
    const test = (): void => {
      const tabsNewAnim = $('#navbarSupportedContent');
      const selectorNewAnim = $('#navbarSupportedContent').find('li').length;
      const activeItemNewAnim = tabsNewAnim.find('.active');
      const activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
      const activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
      const itemPosNewAnimTop = activeItemNewAnim.position();
      const itemPosNewAnimLeft = activeItemNewAnim.position();
      $(".hori-selector").css({
        "top": itemPosNewAnimTop.top + "px",
        "left": itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
      });
      $("#navbarSupportedContent").on("click", "li", function (e) {
        $('#navbarSupportedContent ul li').removeClass("active");
        $(this).addClass('active');
        const activeWidthNewAnimHeight = $(this).innerHeight();
        const activeWidthNewAnimWidth = $(this).innerWidth();
        const itemPosNewAnimTop = $(this).position();
        const itemPosNewAnimLeft = $(this).position();
        $(".hori-selector").css({
          "top": itemPosNewAnimTop.top + "px",
          "left": itemPosNewAnimLeft.left + "px",
          "height": activeWidthNewAnimHeight + "px",
          "width": activeWidthNewAnimWidth + "px"
        });
      });
    };

    $(document).ready(() => {
      setTimeout(test);
    });

    this.updateActiveNavLink();
  }

  private onWindowResize(): void {
    setTimeout(() => {
      this.initializeNavbarAnimation();
    }, 500);
  }

  private onNavbarToggle(): void {
    $(".navbar-collapse").slideToggle(300);
    setTimeout(() => {
      this.initializeNavbarAnimation();
    });
  }

  private updateActiveNavLink(): void {
    const path = window.location.pathname.split("/").pop() || 'index.html';
    const target = $(`#navbarSupportedContent ul li a[href="${path}"]`);
    $('#navbarSupportedContent ul li').removeClass('active');
    target.parent().addClass('active');
  }

  deconnexion(){
    localStorage.clear() ; 
    this.router.navigate([''])
  }
  }
