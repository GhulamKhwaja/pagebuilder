import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { PlanningService } from 'src/app/planning/planning.service';
import { ServiceService } from '../../service.service';
@Component({
  selector: 'app-planning-layout',
  templateUrl: './planning-layout.component.html',
  styleUrls: ['./planning-layout.component.css'],
})
export class PlanningLayoutComponent implements OnInit {
  pageNa;
  pageI;
  rightDivShow: boolean = false;
  leftDivShow: boolean = true;
  constructor(
    private router: Router,
    private planningService: PlanningService,
    private appService: ServiceService
  ) {}

  menuList;

  ngOnInit() {
    this.planningService.getMenuItems().subscribe((data: any) => {
      this.menuList = data.pages_list[0].pages;
      localStorage.setItem(
        'pageName',
        JSON.stringify(this.menuList[0].pageName)
      );
      localStorage.setItem('pageID', this.menuList[0].pageId);
    });
  }

  sendMessage(pageDetails): void {
    // send message to subscribers via observable subject
    this.appService.sendUpdate(pageDetails);
  }

  getImageUrl(ele) {
    return '../../../assets/menu-icon-' + ele.pageName + '.png';
  }

  navigateToMenu(element) {
    let pageID = element.pageId;
    let pageName = element.pageName;
    this.router.navigate([
      '/planning/list-items',
      { pageName: pageName, id: pageID },
    ]);
  }

  setValue(element) {
    let pageDetails = { pageName: element.pageName, pageID: element.pageId };
    this.sendMessage(pageDetails);
    localStorage.setItem('pageName', element.pageName);
    localStorage.setItem('pageID', element.pageId);
  }

  routeMenu(element) {
    let url =
      '/planning/list-items/' + element.pageName + '/' + element.pageId + '';
    return url;
  }

  rightDivClick() {
    this.leftDivShow = true;
    this.rightDivShow = false;
  }

  leftDivClick() {
    this.rightDivShow = true;
    this.leftDivShow = false;
  }
}
