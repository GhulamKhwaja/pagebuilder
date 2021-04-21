import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PlanningService } from "../../planning/planning.service";
import * as $ from "jquery";
import { ServiceService } from "../../service.service";
import { Subscription } from "rxjs";

@Component({
 selector: "app-list-items",
 templateUrl: "./list-items.component.html",
 styleUrls: ["./list-items.component.css"],
})
export class ListItemsComponent implements OnInit {
 rightDivShow: boolean = false;
 leftDivShow: boolean = true;
 messageReceived: any;
 private subscriptionName: Subscription;

 constructor(private router: Router, private route: ActivatedRoute, private planningService: PlanningService, private appService: ServiceService) {
  this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
   //message contains the data sent from service
   this.messageReceived = message.text;
   this.pageName = this.messageReceived.pageName;
   this.pageId = this.messageReceived.pageID;

   console.log(this.pageName, this.pageId);
   this.planningService.getDeviceList(this.pageName).subscribe((data: any) => {
    this.allDevices = data.Details;
   });
  });
 }

 allDevices: any = [];
 pageId;
 pageName;
 searchText;

 ngOnInit() {}

 routeToAddDetails() {
  let url = "/planning/add-items/" + this.pageName + "/" + this.pageId + "";
  console.log(url);
  return url;
  // this.router.navigate([
  //   "/planning/add-items",
  //   { pageName: this.pageName, id: this.pageId },
  // ]);
 }

 leftDivClick() {
  this.rightDivShow = true;
  this.leftDivShow = false;
 }

 filterValues(event) {
  this.searchText = event.target.value;
 }
 getRecord(elements) {
  console.log(elements.id);
  console.log(elements.type);
  let elementDetails = { pageType: elements.type, elementID: elements.id };
  this.sendElementMessage(elementDetails);
  localStorage.setItem("pageType", elementDetails.pageType);
  localStorage.setItem("elementID", elementDetails.elementID);
 }

 sendElementMessage(elementDetails): void {
  // send message to subscribers via observable subject
  this.appService.sendUpdate(elementDetails);
 }
}
