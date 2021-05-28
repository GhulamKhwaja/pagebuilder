import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PlanningService } from '../planning.service';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { map } from "rxjs/operators";

import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServiceService } from 'src/app/service.service';
import { Subscription } from 'rxjs';

import * as go from 'gojs';
import * as Jquery from 'jquery';
import { CompileDirectiveMetadata } from '@angular/compiler';
import { isDifferent } from '@angular/core/src/render3/util';
import { NotifierService } from 'angular-notifier';
import { ZoomSlider } from 'src/app/zoomSlider';


@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css'],
})
export class AddItemsComponent implements OnInit {
  myFormGroup: FormGroup;
  // formTemplate: any = form_template;
  childOptionsList: any[];
  messageReceived: any;
  private subscriptionName: Subscription;
  private EditsubscriptionName: Subscription;
  listItemMsgReceived: any;
  //declation for go js codes
  myDiagram: any;
  public showDiagram: boolean = false;
  clickedPort: number;
  tabsandElements: any = [];
  selectedTab: any;
  id: any;
  currentModel: any[];
  //end declation for go js codes
  private notifier: NotifierService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private _location: Location,
    private fb: FormBuilder,
    private http: HttpClient,
    private appService: ServiceService,
    notifier: NotifierService
  ) {
    this.notifier = notifier;
    this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      this.messageReceived = message.text;
      this.pageName = this.messageReceived.pageName;
      this.pageId = this.messageReceived.pageID;
      console.log(this.pageName, this.pageId);
      this.planningService
        .createPageItems(this.pageId)
        .subscribe((data: any) => {
          this.formElements = data.tabs_list[0].elements_list;
          // console.log(this.formElements);
          this.formElements.forEach((input_template) => {
            this.myFormGroup.addControl(
              input_template.api_param_name,
              new FormControl('')
            );
          });
        });
      //edit item
    });
    this.EditsubscriptionName = this.appService
      .getUpdate()
      .subscribe((message) => {
        //message contains the data sent from service
        this.listItemMsgReceived = message.text;
        this.pageType = this.listItemMsgReceived.pageType;
        this.elementID = this.listItemMsgReceived.elementID;
        console.log('edit item:' + this.pageType + '-' + this.elementID);
        // console.log(this.pageType, this.elementID);
        this.GetallElementsByID(this.elementID, this.pageType);
      });
  }
  pageType;
  elementID;
  pageId;
  pageName;
  formElements;
  submitAction;
  deviceDtls;
  ngOnInit() {
    this.myFormGroup = new FormGroup({});
  }

  onSubmit() {
    // console.log(this.myFormGroup.value);
    this.formElements.forEach((element) => {
      if (
        element.element_name === 'Finish' &&
        element.element_type === 'button'
      ) {
        this.submitAction = element.element_action;
      }
    });
    this.myFormGroup.value.uid = environment.uid;
    // this.myFormGroup.value.orderid = environment.orderid;

    console.log('myFormGroup' + JSON.stringify(this.myFormGroup.value));

    this.planningService
      .createPageValues(this.submitAction, this.myFormGroup.value)
      .subscribe((res) => {
        // console.log(res);
        if (res.status === 200) {
          this.RefreshData();
          // alert(res.message);
          this.notifier.notify('success', res.message);
          this.router.navigate([
            '/planning/list-items',
            { pageName: this.pageName, pageID: this.pageId },
          ]);
        }
        if (res.status === 0) {
          // alert(res.message);
          this.notifier.notify('info', res.message);
          this.router.navigate([
            '/planning/list-items',
            { pageName: this.pageName, pageID: this.pageId },
          ]);
        }
      });
  }

  bindChildDropDownList(
    tab_element_id,
    child_element_id,
    event,
    element_action
  ) {
    if (element_action != null) {
      var child_element_Value = event.target.value;
      const selectEl = event.target;

      const selectedVal =
        selectEl.options[selectEl.selectedIndex].getAttribute('data-val');

      // console.log('const val=' + selectedVal);

      if (selectedVal == '') {
        return;
      }
      this.http
        .get(element_action + '/' + child_element_id + '/' + selectedVal)
        .pipe(map((res) => JSON.parse(JSON.stringify(res))))
        .subscribe((data) => {
          if (data.status == 'success')
            this.childOptionsList = data.child_options_list;
          for (let i = 0; i < this.childOptionsList.length; i++) {
            var childObj = this.childOptionsList[i];
            // console.log('val1=' + childObj.tabElementId);
            var element_id = childObj.tabElementId;

            var child_element_options = childObj.tabelement_options;
            $('#bind' + element_id.trim())
              .find('option')
              .remove();

            $('#bind' + element_id).append(
              $('<option></option>')
                .attr('value', -1)
                .attr('selected', 1)
                .text('Please Select')
            );

            $.each(child_element_options, function (key, value) {
              $('#bind' + element_id).append(
                $('<option></option>')
                  .attr('value', value.opt_id)
                  .attr('data-val', value.opt_selected_value)
                  .text(value.opt_value)
              );
            });
          }
        });
    }
  }

  discardFunc() {
    // this._location.back();
    //this.RefreshData();
    let url = '/planning/list-items/' + this.pageName + '/' + this.pageId + '';
    // console.log(url);
    return url;

    // this.router.navigate([
    //   "/planning/list-items",
    //   { pageName: this.pageName, id: this.pageId },
    // ]);
  }

  GetallElementsByID(id, type) {
    if (
      type == 'Device' ||
      type == 'Shelf' ||
      type == 'Port' ||
      type == 'Card' ||
      type == 'Link'
    ) {
      console.log('GetallElementsByID id::' + id);
      if (id != 0) {
        this.planningService
          .getDeviceDataByID(type, id)
          .subscribe((data: any) => {
            console.log('Edit');
            this.deviceDtls = data.Details;
            this.BindItemsInEdit(this.deviceDtls);
          });
      } else {
        this.Cleardata();
      }
    }
  }

  async BindItemsInEdit(dataDtls) {
    for (let key in dataDtls[0]) {
      let val = dataDtls[0][key];
      Object.keys(this.myFormGroup.controls).forEach(async (formkey) => {
        if (formkey == key) {
          this.myFormGroup.get(formkey).setValue(val);
          this.formElements.forEach((input_template) => {
            if (input_template.api_param_name == key) {
              this.http
                .get(
                  input_template.element_action +
                    '/' +
                    input_template.child_elementid +
                    '/' +
                    val
                )
                .pipe(map((res) => JSON.parse(JSON.stringify(res))))
                .subscribe((data) => {
                  if (data.status == 'success')
                    this.childOptionsList = data.child_options_list;
                  for (let i = 0; i < this.childOptionsList.length; i++) {
                    var childObj = this.childOptionsList[i];
                    var element_id = childObj.tabElementId;
                    var child_element_options = childObj.tabelement_options;

                    $('#bind' + element_id.trim())
                      .find('option')
                      .remove();

                    $('#bind' + element_id).append(
                      $('<option></option>')
                        .attr('value', -1)
                        .attr('selected', 1)
                        .text('Please Select')
                    );

                    $.each(child_element_options, function (key, value) {
                      $('#bind' + element_id).append(
                        $('<option></option>')
                          .attr('value', value.opt_id)
                          .attr('data-val', value.opt_selected_value)
                          .text(value.opt_value)
                      );
                    });
                  }
                });
            }
          });
          await this.sleep(3000);
          this.myFormGroup.get(formkey).setValue(val);
        }
      });
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  sendMessage(pageDetails): void {
    // send message to subscribers via observable subject
    this.appService.sendUpdate(pageDetails);
  }
  RefreshData() {
    let elementDetails = {
      pageType: this.pageType,
      elementID: 0,
      pageName: this.pageName,
      pageID: this.pageId,
    };
    this.sendMessage(elementDetails);
    localStorage.setItem('pageType', this.pageType);
    localStorage.setItem('elementID', '0');
    localStorage.setItem('pageName', this.pageName);
    localStorage.setItem('pageID', this.pageId);
    this.Cleardata();
  }
  Cleardata() {
    Object.keys(this.myFormGroup.controls).forEach(async (formkey) => {
      this.myFormGroup.get(formkey).setValue('');
    });
  }
}
