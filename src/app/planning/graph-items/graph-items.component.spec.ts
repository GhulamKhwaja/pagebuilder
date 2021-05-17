import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GraphItemsComponent } from "./graph-items.component";

describe("GraphItemsComponent", () => {
 let component: GraphItemsComponent;
 let fixture: ComponentFixture<GraphItemsComponent>;

 beforeEach(async(() => {
  TestBed.configureTestingModule({
   declarations: [GraphItemsComponent],
  }).compileComponents();
 }));

 beforeEach(() => {
  fixture = TestBed.createComponent(GraphItemsComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
 });

 it("should create", () => {
  expect(component).toBeTruthy();
 });
});
