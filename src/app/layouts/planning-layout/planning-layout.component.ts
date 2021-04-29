import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { PlanningService } from 'src/app/planning/planning.service';
import { ServiceService } from '../../service.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  private subscriptionName: Subscription;
  listItemMsgReceived: any;
  constructor(
    private router: Router,
    private planningService: PlanningService,
    private appService: ServiceService
  ) {
    this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      this.listItemMsgReceived = message.text;
      this.pageType = this.listItemMsgReceived.pageType;
      this.elementID = this.listItemMsgReceived.elementID;

      console.log(this.pageType, this.elementID);
      this.GetallDataByID(this.elementID, this.pageType);
    });
  }
  pageType;
  elementID;
  menuList;
  deviceDtls;
  showDiv1: boolean = false;
  showDiv2: boolean = true;

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

  changeTab(event: any) {
    // angular.element('tab a[data-target="#tab-two"]').trigger('click');
    // console.log(event.target.checked);
    // console.log(this.showDiv);

    // $('#nav-tabContent id="#"').trigger('click');
    // document.getElementById('#nav-Editdata').click();
    // $('#nav-Editdata').trigger('click');
    // $('.clickMe#' + 'nav-Editdata').trigger('click');

    // var ix = $(this).index();

    // $('#nav-graph').toggle(ix === 0);
    // $('#nav-Editdata').toggle(ix === 1);
    // if (this.showDiv === true) {
    //   this.showDiv = false;
    // }
    // if (this.showDiv === false) {
    //   this.showDiv = true;
    // }
    if (this.showDiv1) {
      this.showDiv1 = false;
      this.showDiv2 = true;
      return;
    }
    if (this.showDiv2) {
      this.showDiv2 = false;
      this.showDiv1 = true;
      return;
    }
    // this.showDiv1
  }

  showAddDiv() {
    if (this.showDiv1) {
      this.showDiv1 = false;
      this.showDiv2 = true;
      return;
    }
    // if (this.showDiv2) {
    //   this.showDiv2 = false;
    //   this.showDiv1 = true;
    //   return;
    // }

    console.log(this.showDiv1);
  }

  deleteSelectedIds() {
    let selectedIdsArr = JSON.parse(localStorage.getItem('selectedIds'));
    console.log();
    if (selectedIdsArr.length > 0) {
      selectedIdsArr.forEach((x) => {
        let obj = {
          uid: environment.uid,
          orderid: environment.orderid,
          NEID: x,
        };
        console.log(obj);
        this.planningService.removeNE(obj).subscribe((res: any) => {
          console.log(res);
        });
      });
    } else {
      alert('select at least one item to delete');
    }
  }

  GetallDataByID(id, type) {
    if (type == 'Device') {
      this.planningService
        .getDeviceListByID(type, id)
        .subscribe((data: any) => {
          this.deviceDtls = data.Details;
          console.log(this.deviceDtls);
        });
    }
  }
}
