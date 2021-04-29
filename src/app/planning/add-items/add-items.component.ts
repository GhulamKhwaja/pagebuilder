import { Component, OnInit } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
// import { map } from "rxjs/operators";

import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServiceService } from 'src/app/service.service';
import { Subscription } from 'rxjs';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private _location: Location,
    private fb: FormBuilder,
    private http: HttpClient,
    private appService: ServiceService
  ) {
    // this.myFormGroup = new FormGroup({});
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
      this.EditsubscriptionName = this.appService
        .getUpdate()
        .subscribe((message) => {
          //message contains the data sent from service
          this.listItemMsgReceived = message.text;
          this.pageType = this.listItemMsgReceived.pageType;
          this.elementID = this.listItemMsgReceived.elementID;
          // console.log('edit item');
          // console.log(this.pageType, this.elementID);
          this.GetallElementsByID(this.elementID, this.pageType);
        });
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
    // this.route.params.subscribe((params: Params) => {
    //   this.pageId = params.id;
    //   this.pageName = params.pageName;
    // });
    // this.planningService.createPageItems(this.pageId).subscribe((data: any) => {
    //   this.formElements = data.tabs_list[0].elements_list;
    //   // console.log(this.formElements);
    //   this.formElements.forEach((input_template) => {
    //     this.myFormGroup.addControl(
    //       input_template.api_param_name,
    //       new FormControl('')
    //     );
    //   });
    // });
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
          alert(res.message);
          this.router.navigate([
            '/planning/list-items',
            { pageName: this.pageName, id: this.pageId },
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

      // console.log(tab_element_id);
      // console.log(child_element_Value);
      // console.log(element_action);
      // console.log(child_element_id);

      const selectEl = event.target;
      const selectedVal = selectEl.options[selectEl.selectedIndex].getAttribute(
        'data-val'
      );

      // console.log('const val=' + selectedVal);

      if (selectedVal == '') {
        return;
      }
      // $('#bind' + child_element_id).css({ 'background-color': 'blue' });
      // let elem = document.getElementById('bind' + child_element_id);
      // console.log(elem);

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
            // console.log(element_id, 'element_id');

            $('#bind' + element_id).append(
              $('<option></option>')
                .attr('value', -1)
                .attr('selected', true)
                .text('Please Select')
            );

            $.each(child_element_options, function (key, value) {
              // console.log(
              //   'key-->' +
              //     value.opt_id +
              //     ' value---->' +
              //     value.opt_value +
              //     ' selectedvalue---->' +
              //     value.opt_selected_value
              // );
              $('#bind' + element_id).append(
                $('<option></option>')
                  .attr('value', value.opt_id)
                  .attr('data-val', value.opt_selected_value)
                  .text(value.opt_value)
              );
            });
            // alert('called dropdown');
          }
        });
    }
  }

  discardFunc() {
    // this._location.back();

    let url = '/planning/list-items/' + this.pageName + '/' + this.pageId + '';
    // console.log(url);
    return url;

    // this.router.navigate([
    //   "/planning/list-items",
    //   { pageName: this.pageName, id: this.pageId },
    // ]);
  }

  GetallElementsByID(id, type) {
    if (type == 'Device') {
      this.planningService
        .getDeviceDataByID(type, id)
        .subscribe((data: any) => {
          this.deviceDtls = data.Details;
          console.log(this.deviceDtls);

          for (let key in this.deviceDtls[0]) {
            let val = this.deviceDtls[0][key];
            console.log('elementkey:' + key);
            console.log('elementval:' + val);
            Object.keys(this.myFormGroup.controls).forEach((formkey) => {
              if (formkey == key) {
                console.log('keyname:' + formkey);
                //  this.myFormGroup.patchValue({
                //   formkey: val,
                //  });
                this.myFormGroup.controls[formkey].setValue(val);
              }
            });
          }
        });
    }
  }
}
